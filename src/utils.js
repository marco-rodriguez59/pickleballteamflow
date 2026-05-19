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

export function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) {
        out.push(arr.slice(i, i + size));
    }
    return out;
}

export function keyPair(a, b) {
    return a < b ? `${a}-${b}` : `${b}-${a}`;
}

// Create a unique key for a team matchup (team1 vs team2)
export function keyMatchup(team1, team2) {
    const t1 = keyPair(team1[0].id, team1[1].id);
    const t2 = keyPair(team2[0].id, team2[1].id);
    return t1 < t2 ? `${t1}:${t2}` : `${t2}:${t1}`;
}

// Create a unique key for a court grouping (4 players on the same court)
export function keyCourtGroup(players) {
    const ids = players.map(p => p.id).sort((a, b) => a - b);
    return ids.join('-');
}

export function pickPairing(playersOfFour, partnerHistory, opponentHistory, courtHistory) {
    const p = playersOfFour;
    const candidates = [
        [[p[0], p[1]], [p[2], p[3]]],
        [[p[0], p[2]], [p[1], p[3]]],
        [[p[0], p[3]], [p[1], p[2]]]
    ];
    
    let best = candidates[0];
    let scoreMin = Infinity;
    
    for (const cand of candidates) {
        const [team1, team2] = cand;
        const [a, b] = team1;
        const [c, d] = team2;
        
        // Calculate penalty score
        let score = 0;
        
        // Heavy penalty for repeat partnerships (weight: 10)
        if (partnerHistory.has(keyPair(a.id, b.id))) score += 10;
        if (partnerHistory.has(keyPair(c.id, d.id))) score += 10;
        
        // Medium penalty for repeat opponent matchups (weight: 5)
        if (opponentHistory.has(keyMatchup(team1, team2))) score += 5;
        
        // Light penalty for same court grouping (weight: 2)
        if (courtHistory.has(keyCourtGroup(p))) score += 2;
        
        if (score < scoreMin) {
            scoreMin = score;
            best = cand;
        }
        
        // Perfect score - no repeats at all
        if (score === 0) break;
    }
    return best;
}

export function buildRound(roster, roundIndex, selectedCourts, partnerHistory, opponentHistory, courtHistory) {
    const total = roster.length;
    const fullCourts = Math.min(selectedCourts, Math.floor(total / PLAYERS_PER_COURT));
    const needed = fullCourts * PLAYERS_PER_COURT;
    const sitCount = Math.max(0, total - needed);

    let sitOut = [];
    if (sitCount > 0) {
        const byFair = shuffle(roster).sort((a, b) => a.sitOuts - b.sitOuts);
        sitOut = byFair.slice(0, sitCount);
    }

    const active = roster.filter(p => !sitOut.some(s => s.id === p.id));

    let bestGroups = [];
    let bestPenalty = Infinity;
    
    // Increase attempts for better optimization  
    for (let attempt = 0; attempt < 50; attempt++) {
        const groups = chunk(shuffle(active), PLAYERS_PER_COURT).slice(0, fullCourts);
        let pen = 0;
        
        for (const g of groups) {
            if (g.length < 4) continue;
            const [team1, team2] = pickPairing(g, partnerHistory, opponentHistory, courtHistory);
            
            // Calculate penalty
            pen += partnerHistory.has(keyPair(team1[0].id, team1[1].id)) ? 10 : 0;
            pen += partnerHistory.has(keyPair(team2[0].id, team2[1].id)) ? 10 : 0;
            pen += opponentHistory.has(keyMatchup(team1, team2)) ? 5 : 0;
            pen += courtHistory.has(keyCourtGroup(g)) ? 2 : 0;
        }
        
        if (pen < bestPenalty) {
            bestPenalty = pen;
            bestGroups = groups;
            if (pen === 0) break; // Perfect solution found
        }
    }

    const courts = bestGroups.map((g, i) => {
        const [team1, team2] = pickPairing(g, partnerHistory, opponentHistory, courtHistory);
        
        // Record all history
        partnerHistory.add(keyPair(team1[0].id, team1[1].id));
        partnerHistory.add(keyPair(team2[0].id, team2[1].id));
        opponentHistory.add(keyMatchup(team1, team2));
        courtHistory.add(keyCourtGroup(g));
        
        return { courtNumber: i + 1, players: g };
    });

    return { index: roundIndex, courts, sitOut, closed: false };
}
