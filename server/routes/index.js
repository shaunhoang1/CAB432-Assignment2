var express = require("express");
var router = express.Router();
const Twitter = require("twitter");
require("dotenv").config();
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

// To get trending topics
router.get("/trends", function (req, res, next) {
  //   /**
  //    * Stream statuses filtered by keyword
  //    * number of tweets per second depends on topic popularity
  //    **/
  //   client.stream("statuses/filter", { track: "twitter" }, function (stream) {
  //     stream.on("data", function (tweet) {
  //       console.log(tweet.text);
  //     });
  //     stream.on("error", function (error) {
  //       console.log(error);
  //     });
  //   });
  client.get(
    "search/tweets",
    { q: "node.js" },
    function (error, tweets, response) {
      console.log(tweets);
    }
  );
});

module.exports = router;
