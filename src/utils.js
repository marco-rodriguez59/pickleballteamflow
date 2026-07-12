// Utility functions for pickleball court assignment

export const PLAYERS_PER_COURT = 4;

export function shuffle(arr, rng = Math.random) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Order-independent pair key: keyPair(1,2) === keyPair(2,1) === "1-2"
export function keyPair(a, b) {
    return a < b ? `${a}-${b}` : `${b}-${a}`;
}

// Order-independent matchup key: keyMatchup(t1,t2) === keyMatchup(t2,t1)
// team1/team2 are arrays of player objects with .id
export function keyMatchup(team1, team2) {
    const t1 = keyPair(team1[0].id, team1[1].id);
    const t2 = keyPair(team2[0].id, team2[1].id);
    return t1 < t2 ? `${t1}:${t2}` : `${t2}:${t1}`;
}

function selectBestPairing(players, partnerCount, opponentCount, individualOpponentCount) {
    const [a, b, c, d] = players;
    const candidates = [
        { team1: [a, b], team2: [c, d] },
        { team1: [a, c], team2: [b, d] },
        { team1: [a, d], team2: [b, c] }
    ];

    let best = candidates[0];
    let lowestScore = Infinity;

    for (const candidate of candidates) {
        const pk1 = keyPair(candidate.team1[0].id, candidate.team1[1].id);
        const pk2 = keyPair(candidate.team2[0].id, candidate.team2[1].id);
        const mk = keyMatchup(candidate.team1, candidate.team2);

        const pk1Cnt = partnerCount.get(pk1) || 0;
        const pk2Cnt = partnerCount.get(pk2) || 0;
        const mkCnt = opponentCount.get(mk) || 0;

        const i00 = individualOpponentCount.get(keyPair(candidate.team1[0].id, candidate.team2[0].id)) || 0;
        const i01 = individualOpponentCount.get(keyPair(candidate.team1[0].id, candidate.team2[1].id)) || 0;
        const i10 = individualOpponentCount.get(keyPair(candidate.team1[1].id, candidate.team2[0].id)) || 0;
        const i11 = individualOpponentCount.get(keyPair(candidate.team1[1].id, candidate.team2[1].id)) || 0;

        // Quadratic penalties: each additional repeat is progressively more costly
        const partnerScore = (pk1Cnt * pk1Cnt + pk2Cnt * pk2Cnt) * 10;
        const opponentScore = mkCnt * mkCnt * 15;
        const individualScore = (i00*i00 + i01*i01 + i10*i10 + i11*i11) * 5;

        const totalScore = partnerScore + opponentScore + individualScore;

        if (totalScore < lowestScore) {
            lowestScore = totalScore;
            best = candidate;
        }
    }

    return { ...best, repeatScore: lowestScore };
}

function chooseSitOuts(roster, sitCount, roundIndex) {
    if (sitCount <= 0) return [];

    return shuffle(roster)
        .sort((a, b) => {
            const sitDiff = (a.sitOuts || 0) - (b.sitOuts || 0);
            if (sitDiff !== 0) return sitDiff;

            const aSatLastRound = (a.lastSatRound ?? Number.NEGATIVE_INFINITY) === roundIndex - 1 ? 1 : 0;
            const bSatLastRound = (b.lastSatRound ?? Number.NEGATIVE_INFINITY) === roundIndex - 1 ? 1 : 0;
            return aSatLastRound - bSatLastRound;
        })
        .slice(0, sitCount);
}

// Partition activePlayers into numCourts groups of PLAYERS_PER_COURT,
// minimizing total pairwise interaction history within each group.
// Uses greedy construction + local swap optimization + multiple random restarts.
function formCourtGroups(activePlayers, numCourts, partnerCount, individualOpponentCount) {
    // Exponential penalty: each additional encounter between two players is progressively
    // more costly, strongly discouraging high-repeat pairings over any single-fresh-pair swap.
    function pairInteraction(idA, idB) {
        const k = keyPair(idA, idB);
        const p = partnerCount.get(k) || 0;
        const o = individualOpponentCount.get(k) || 0;
        const total = p * 2 + o; // partner weighs double: more "used up" relationship
        return total > 0 ? Math.pow(3, total - 1) : 0;
    }

    function groupScore(group) {
        let score = 0;
        for (let i = 0; i < group.length; i++)
            for (let j = i + 1; j < group.length; j++)
                score += pairInteraction(group[i].id, group[j].id);
        return score;
    }

    function totalScore(groups) {
        return groups.reduce((sum, g) => sum + groupScore(g), 0);
    }

    // Greedily build groups: anchor = first unassigned player (randomised by caller's shuffle).
    // Pick the trio of remaining players whose combination with the anchor has the lowest
    // total pairwise interaction score, searching the top-9 by anchor affinity.
    function greedyConstruct(shuffledPlayers) {
        const assigned = new Set();
        const groups = [];

        for (let g = 0; g < numCourts; g++) {
            const unassigned = shuffledPlayers.filter(p => !assigned.has(p.id));
            if (unassigned.length < PLAYERS_PER_COURT) break;

            const anchor = unassigned[0];
            const rest = unassigned.slice(1);

            rest.sort((a, b) =>
                pairInteraction(anchor.id, a.id) - pairInteraction(anchor.id, b.id)
            );

            // Search all remaining players — no artificial cap — so no fresh player is ever ignored
            const topN = rest;
            let bestTrio = topN.slice(0, 3);
            let best = Infinity;

            for (let i = 0; i < topN.length; i++)
                for (let j = i + 1; j < topN.length; j++)
                    for (let k = j + 1; k < topN.length; k++) {
                        const s = groupScore([anchor, topN[i], topN[j], topN[k]]);
                        if (s < best) { best = s; bestTrio = [topN[i], topN[j], topN[k]]; }
                    }

            const group = [anchor, ...bestTrio];
            group.forEach(p => assigned.add(p.id));
            groups.push(group);
        }

        return groups;
    }

    // Local swap: repeatedly swap individual players between any two courts until
    // no single swap further reduces the total interaction score.
    function localSearch(initial) {
        let current = initial.map(g => [...g]);
        let curScore = totalScore(current);
        let improved = true;

        while (improved) {
            improved = false;
            for (let g1 = 0; g1 < current.length; g1++) {
                for (let g2 = g1 + 1; g2 < current.length; g2++) {
                    for (let i = 0; i < PLAYERS_PER_COURT; i++) {
                        for (let j = 0; j < PLAYERS_PER_COURT; j++) {
                            const next = current.map(g => [...g]);
                            [next[g1][i], next[g2][j]] = [next[g2][j], next[g1][i]];
                            const nextScore = totalScore(next);
                            if (nextScore < curScore) {
                                curScore = nextScore;
                                current = next;
                                improved = true;
                            }
                        }
                    }
                }
            }
        }

        return current;
    }

    let bestGroups = [];
    let bestScore = Infinity;

    for (let attempt = 0; attempt < 30; attempt++) {
        const initial = greedyConstruct(shuffle(activePlayers));
        if (initial.length !== numCourts) continue;
        const optimized = localSearch(initial);
        const score = totalScore(optimized);
        if (score < bestScore) {
            bestScore = score;
            bestGroups = optimized;
        }
    }

    return bestGroups;
}

// partnerCount: Map<pairKey, number>  — how many times each pair have been partners
// opponentCount: Map<matchupKey, number> — how many times each pair-vs-pair matchup has occurred
export function buildRound(roster, roundIndex, selectedCourts, partnerCount, opponentCount, individualOpponentCount) {
    const fullCourts = Math.min(selectedCourts, Math.floor(roster.length / PLAYERS_PER_COURT));
    const activePlayerCount = fullCourts * PLAYERS_PER_COURT;
    const sitCount = Math.max(0, roster.length - activePlayerCount);
    const sitOut = chooseSitOuts(roster, sitCount, roundIndex);
    const sitOutIds = new Set(sitOut.map(p => p.id));
    const activePlayers = roster.filter(p => !sitOutIds.has(p.id));

    const bestCourtGroups = formCourtGroups(activePlayers, fullCourts, partnerCount, individualOpponentCount);

    const courts = bestCourtGroups.map((group, i) => {
        const { team1, team2 } = selectBestPairing(group, partnerCount, opponentCount, individualOpponentCount);
        const pk1 = keyPair(team1[0].id, team1[1].id);
        const pk2 = keyPair(team2[0].id, team2[1].id);
        const mk = keyMatchup(team1, team2);
        partnerCount.set(pk1, (partnerCount.get(pk1) || 0) + 1);
        partnerCount.set(pk2, (partnerCount.get(pk2) || 0) + 1);
        opponentCount.set(mk, (opponentCount.get(mk) || 0) + 1);

        // Record individual cross-opponent encounters: each player on team1 faced each player on team2
        [[team1[0], team2[0]], [team1[0], team2[1]],
         [team1[1], team2[0]], [team1[1], team2[1]]].forEach(([x, y]) => {
            const ik = keyPair(x.id, y.id);
            individualOpponentCount.set(ik, (individualOpponentCount.get(ik) || 0) + 1);
        });

        return {
            courtNumber: i + 1,
            players: [...team1, ...team2],
            team1Ids: [team1[0].id, team1[1].id],
            team2Ids: [team2[0].id, team2[1].id]
        };
    });

    return { index: roundIndex, courts, sitOut, closed: false };
}
