const aposToLexForm = require("apos-to-lex-form");
const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = require("natural");
const SpellCorrector = require("spelling-corrector");
const stopword = require("stopword");
const {average} = require("./average");

const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");
const tokenizer = new WordTokenizer();
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

// Calculate the sentiment score
function getSentiment(str) {
  if (!str.trim()) {
    return 0;
  }

  const lexed = aposToLexForm(str)
    .toLowerCase()
    .replace(/[^a-zA-Z\s]+/g, "");

  const tokenized = tokenizer.tokenize(lexed);

  const fixedSpelling = tokenized.map((word) => spellCorrector.correct(word));

  const stopWordsRemoved = stopword.removeStopwords(fixedSpelling);

  const analyzed = analyzer.getSentiment(stopWordsRemoved);
  console.log("Score:" ,analyzed);
  return analyzed; // neutral
}

function getSentimentList(tweetList){
  let sentimentList = Array(tweetList.length).fill(null);
  let scoreList = Array(tweetList.length).fill(null);
  tweetList.map((obj, index) => {
    console.log(`Process: ${index}/${tweetList.length}`)
    scoreList[index] = getSentiment(obj.text)
    if (Math.round(scoreList[index]) >= 1) {
      sentimentList[index] = 1
    } // positive
    else if (Math.round(sentimentList[index]) <= -1) {
      sentimentList[index] = -1
    } // negative
    else{
      sentimentList[index] = 0
    }
  })
  return {sentimentList, averageScore: average(scoreList)};
}
module.exports.getSentiment = getSentiment;
module.exports.getSentimentList = getSentimentList;