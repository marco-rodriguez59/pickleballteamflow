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

export function pickPairing(playersOfFour, history) {
    const p = playersOfFour;
    const candidates = [
        [[p[0], p[1]], [p[2], p[3]]],
        [[p[0], p[2]], [p[1], p[3]]],
        [[p[0], p[3]], [p[1], p[2]]]
    ];
    
    let best = candidates[0];
    let scoreMin = Infinity;
    
    for (const cand of candidates) {
        const [[a, b], [c, d]] = cand;
        const score = 
            (history.has(keyPair(a.id, b.id)) ? 1 : 0) +
            (history.has(keyPair(c.id, d.id)) ? 1 : 0);
        if (score < scoreMin) {
            scoreMin = score;
            best = cand;
        }
    }
    return best;
}

export function buildRound(roster, roundIndex, selectedCourts, history) {
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
    
    for (let attempt = 0; attempt < 10; attempt++) {
        const groups = chunk(shuffle(active), PLAYERS_PER_COURT).slice(0, fullCourts);
        let pen = 0;
        
        for (const g of groups) {
            if (g.length < 4) continue;
            const [t1, t2] = pickPairing(g, history);
            pen += history.has(keyPair(t1[0].id, t1[1].id)) ? 1 : 0;
            pen += history.has(keyPair(t2[0].id, t2[1].id)) ? 1 : 0;
        }
        
        if (pen < bestPenalty) {
            bestPenalty = pen;
            bestGroups = groups;
            if (pen === 0) break;
        }
    }

    const courts = bestGroups.map((g, i) => {
        const [t1, t2] = pickPairing(g, history);
        history.add(keyPair(t1[0].id, t1[1].id));
        history.add(keyPair(t2[0].id, t2[1].id));
        return { courtNumber: i + 1, players: g };
    });

    return { index: roundIndex, courts, sitOut, closed: false };
}
