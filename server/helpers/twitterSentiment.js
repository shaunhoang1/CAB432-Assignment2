const example = [
    -1,  0, -1, -1, -1, -1, -1,  0,  0, -1, -1, -1,
    0, -1,  0,  0, -1,  0, -1, -1, -1, -1, -1,  0,
    -1,  0, -1, -1,  0, -1,  0, -1, -1, -1, -1,  0,
    -1,  0,  0, -1, -1, -1,  0, -1, -1, -1, -1,  0,
    -1, -1,  0,  0, -1,  0,  0, -1, -1, -1,  0, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0, -1,
    -1, -1,  0,  0, -1,  0, -1, -1, -1,  0, -1,  0,
    0,  0,  0,  0,  0,  0, -1,  0,  0, -1, -1, -1,
    0, -1, -1, -1
]

function calculateSentiment(listSentiments) {
    const map = listSentiments.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    console.log("map", map);
    return map.entries()
}


module.exports.calculateSentiment = calculateSentiment;