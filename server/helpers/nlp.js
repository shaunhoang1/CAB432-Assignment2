const aposToLexForm = require("apos-to-lex-form");
const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = require("natural");
const SpellCorrector = require("spelling-corrector");
const stopword = require("stopword");

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

  if (analyzed >= 1) return 1; // positive
  if (analyzed === 0) return 0;
  return -1;
}

function getSentimentList(tweetList){
  let sentimentList = Array(tweetList.length).fill(null);

  tweetList.map((obj, index) => {
    console.log("???", index)
    sentimentList[index] = getSentiment(obj.text)
  })
  console.log(sentimentList)
  return sentimentList;
}
module.exports.getSentiment = getSentiment;
module.exports.getSentimentList = getSentimentList;