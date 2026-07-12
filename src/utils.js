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

function chunk(array, size) {
    const groups = [];
    for (let i = 0; i < array.length; i += size) {
        groups.push(array.slice(i, i + size));
    }
    return groups;
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

        // Partner history: repeated partnerships are penalized
        const partnerScore =
            (partnerCount.get(pk1) || 0) * 10 +
            (partnerCount.get(pk2) || 0) * 10;

        // Opponent matchup history: repeated team matchups are heavily penalized
        const opponentScore = (opponentCount.get(mk) || 0) * 15;

        // Individual opponent history: each cross-team player pairing penalized by their encounter count
        const individualScore =
            ((individualOpponentCount.get(keyPair(candidate.team1[0].id, candidate.team2[0].id)) || 0) +
             (individualOpponentCount.get(keyPair(candidate.team1[0].id, candidate.team2[1].id)) || 0) +
             (individualOpponentCount.get(keyPair(candidate.team1[1].id, candidate.team2[0].id)) || 0) +
             (individualOpponentCount.get(keyPair(candidate.team1[1].id, candidate.team2[1].id)) || 0)) * 5;

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

// partnerCount: Map<pairKey, number>  — how many times each pair have been partners
// opponentCount: Map<matchupKey, number> — how many times each pair-vs-pair matchup has occurred
export function buildRound(roster, roundIndex, selectedCourts, partnerCount, opponentCount, individualOpponentCount) {
    const fullCourts = Math.min(selectedCourts, Math.floor(roster.length / PLAYERS_PER_COURT));
    const activePlayerCount = fullCourts * PLAYERS_PER_COURT;
    const sitCount = Math.max(0, roster.length - activePlayerCount);
    const sitOut = chooseSitOuts(roster, sitCount, roundIndex);
    const sitOutIds = new Set(sitOut.map(p => p.id));
    const activePlayers = roster.filter(p => !sitOutIds.has(p.id));

    let bestCourtGroups = [];
    let lowestRoundRepeatScore = Infinity;

    for (let attempt = 0; attempt < 30; attempt++) {
        const courtGroups = chunk(shuffle(activePlayers), PLAYERS_PER_COURT)
            .filter(group => group.length === PLAYERS_PER_COURT)
            .slice(0, fullCourts);

        if (courtGroups.length !== fullCourts) continue;

        let roundRepeatScore = 0;
        for (const group of courtGroups) {
            roundRepeatScore += selectBestPairing(group, partnerCount, opponentCount, individualOpponentCount).repeatScore;
        }

        if (roundRepeatScore < lowestRoundRepeatScore) {
            lowestRoundRepeatScore = roundRepeatScore;
            bestCourtGroups = courtGroups;
            if (roundRepeatScore === 0) break;
        }
    }

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
