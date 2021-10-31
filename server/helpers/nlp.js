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
  console.log("stopWordsRemoved", stopWordsRemoved)
  const analyzed = analyzer.getSentiment(stopWordsRemoved);
  console.log("Score:" ,analyzed);
  if (Math.round(analyzed) >= 1) return 1; // positive
  if (Math.round(analyzed) <= -1) return -1; // negative
  return 0; // neutral
}

function getSentimentList(tweetList){
  let sentimentList = Array(tweetList.length).fill(null);

  tweetList.map((obj, index) => {
    console.log(`Process: ${index}/${tweetList.length}`)
    sentimentList[index] = getSentiment(obj.text)
  })
  return sentimentList;
}
module.exports.getSentiment = getSentiment;
module.exports.getSentimentList = getSentimentList;