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

// Generate all C(n,2) unordered pairs from an array of players
function allPairs(players) {
    const pairs = [];
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            pairs.push([players[i], players[j]]);
        }
    }
    return pairs;
}

// One greedy attempt to fill numCourts courts from activePlayers.
// Shuffles all C(n,2) pairs first (random tiebreak), then stable-sorts by ascending
// partnership usage count so least-used pairs are always preferred.
// team1 = first unassigned pair; team2 = lowest-penalty compatible pair (no shared
// players, prefers unused partnership then unused matchup).
function tryAssignCourts(activePlayers, numCourts, partnerCount, opponentCount) {
    const pairs = shuffle(allPairs(activePlayers)).sort((a, b) =>
        (partnerCount.get(keyPair(a[0].id, a[1].id)) || 0) -
        (partnerCount.get(keyPair(b[0].id, b[1].id)) || 0)
    );

    const assigned = new Set();
    const courts = [];

    for (let c = 0; c < numCourts; c++) {
        // team1: first unassigned pair (least partnership-count after sort)
        let team1 = null;
        for (const pair of pairs) {
            if (!assigned.has(pair[0].id) && !assigned.has(pair[1].id)) {
                team1 = pair;
                break;
            }
        }
        if (!team1) break;

        // team2: no shared players with team1; lowest weighted penalty score
        let team2 = null;
        let bestScore = Infinity;
        for (const pair of pairs) {
            const [c, d] = pair;
            if (assigned.has(c.id) || assigned.has(d.id)) continue;
            if (c.id === team1[0].id || c.id === team1[1].id ||
                d.id === team1[0].id || d.id === team1[1].id) continue;

            const score =
                (partnerCount.get(keyPair(c.id, d.id)) || 0) * 10 +
                (opponentCount.get(keyMatchup(team1, pair)) || 0) * 5;

            if (score < bestScore) {
                bestScore = score;
                team2 = pair;
                if (score === 0) break;
            }
        }
        if (!team2) break;

        assigned.add(team1[0].id); assigned.add(team1[1].id);
        assigned.add(team2[0].id); assigned.add(team2[1].id);
        courts.push({ team1, team2 });
    }

    const totalPenalty = courts.reduce((sum, { team1, team2 }) =>
        sum +
        (partnerCount.get(keyPair(team1[0].id, team1[1].id)) || 0) * 10 +
        (partnerCount.get(keyPair(team2[0].id, team2[1].id)) || 0) * 10 +
        (opponentCount.get(keyMatchup(team1, team2)) || 0) * 5, 0);

    return { courts, totalPenalty, filled: courts.length };
}

// partnerCount: Map<pairKey, number>  — how many times each pair have been partners
// opponentCount: Map<matchupKey, number> — how many times each pair-vs-pair matchup has occurred
export function buildRound(roster, roundIndex, selectedCourts, partnerCount, opponentCount) {
    const total = roster.length;
    const fullCourts = Math.min(selectedCourts, Math.floor(total / PLAYERS_PER_COURT));
    const needed = fullCourts * PLAYERS_PER_COURT;
    const sitCount = Math.max(0, total - needed);

    let sitOut = [];
    if (sitCount > 0) {
        // Group players into tiers by sit-out count, shuffle within each tier,
        // then fill from the lowest tier first. This guarantees no player sits out
        // a second time while any player has not yet sat out at all (or fewer times).
        const tierMap = new Map();
        for (const p of roster) {
            const bucket = tierMap.get(p.sitOuts) ?? [];
            bucket.push(p);
            tierMap.set(p.sitOuts, bucket);
        }
        const pool = [];
        for (const key of [...tierMap.keys()].sort((a, b) => a - b)) {
            pool.push(...shuffle(tierMap.get(key)));
        }
        sitOut = pool.slice(0, sitCount);
    }

    const active = roster.filter(p => !sitOut.some(s => s.id === p.id));

    let bestResult = null;
    let bestPenalty = Infinity;

    for (let attempt = 0; attempt < 100; attempt++) {
        const result = tryAssignCourts(active, fullCourts, partnerCount, opponentCount);
        if (result.filled === fullCourts && result.totalPenalty < bestPenalty) {
            bestPenalty = result.totalPenalty;
            bestResult = result;
            if (bestPenalty === 0) break;
        }
    }

    if (!bestResult) bestResult = { courts: [] };

    const courts = bestResult.courts.map(({ team1, team2 }, i) => {
        const pk1 = keyPair(team1[0].id, team1[1].id);
        const pk2 = keyPair(team2[0].id, team2[1].id);
        const mk = keyMatchup(team1, team2);
        partnerCount.set(pk1, (partnerCount.get(pk1) || 0) + 1);
        partnerCount.set(pk2, (partnerCount.get(pk2) || 0) + 1);
        opponentCount.set(mk, (opponentCount.get(mk) || 0) + 1);

        return {
            courtNumber: i + 1,
            players: [...team1, ...team2],
            team1Ids: [team1[0].id, team1[1].id],
            team2Ids: [team2[0].id, team2[1].id]
        };
    });

    return { index: roundIndex, courts, sitOut, closed: false };
}
