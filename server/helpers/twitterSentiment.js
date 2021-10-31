function calculateSentiment(listSentiments) {
    const map = listSentiments.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    const sentimentObject =  Object.fromEntries(map);
    ['0','-1','1'].forEach(function(el) {
        if (!(el in sentimentObject)){
            sentimentObject[el] = 0
        }
    });
    return sentimentObject
}


module.exports.calculateSentiment = calculateSentiment;