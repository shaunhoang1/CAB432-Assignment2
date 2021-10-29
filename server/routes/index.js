// import { getSentiment } from "../helpers/nlp.js";
const { getSentiment } = require("../helpers/nlp.js");
const express = require("express");
const router = express.Router();
const Twitter = require("twitter");
const Twitter2 = require("twitter-v2");
const { getSentimentList } = require("../helpers/nlp");
const { calculateSentiment } = require("../helpers/twitterSentiment");

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});
const client2 = new Twitter2({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

// router.get("/", async (req, res, next) => {
//   res.send({ message: "This is API main page :)" });
// });

// To get trending topics
router.get("/trends", async (req, res, next) => {
  try {
    const id = req.query.woeid;
    const trends = await client.get("trends/place.json", {
      id,
    });
    res.send(trends);
  } catch (error) {
    next(error);
  }
});

// The route gets the WOEID for a particular location (latitude/longtitude)
router.get("/near-me", async (req, res, next) => {
  try {
    const { lat, long } = req.query;
    const response = await client.get("/trends/closest.json", {
      lat,
      long,
    });
    res.send(response);
  } catch (error) {
    next(error);
  }
});

// The route gets the data from the exact key word
// https://developer.twitter.com/en/docs/twitter-api/v1/tweets/search/api-reference/get-search-tweets
router.get("/search", async (req, res, next) => {
  try {
    const q = req.query.q;
    const search = await client.get("search/tweets", {
      q,
      lang: "en",
      count: 100, // Max tweets return. Default:15 - Max:100
      result_type: "mixed", // Both realtime and popular
    });
    const listSentiments = getSentimentList(search.statuses);
    const result = calculateSentiment(listSentiments);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/search2", async (req, res, next) => {
    try {
        const query = req.query.q;
        console.log("q", query);
        const { data }  = await client2.get(
            'tweets/search/recent',
            {
                query: 'csgo',
                max_results: 10,
                tweet: {
                    fields: [
                        'created_at',
                        'entities',
                        'in_reply_to_user_id',
                        'public_metrics',
                        'referenced_tweets',
                        'source',
                        'author_id',
                    ],
                },
            }
        );
        // const listSentiments = getSentimentList(search.statuses);
        // const result = calculateSentiment(listSentiments);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
});
router.get("/search/sentiment", async (req, res, next) => {
  try {
      const query = req.query.q;
      console.log("q", query);
      const { data }  = await client2.get(
          'tweets/search/recent',
          {
              query: 'csgo',
              max_results: 10,
              tweet: {
                  fields: [
                      'created_at',
                      'entities',
                      'in_reply_to_user_id',
                      'public_metrics',
                      'referenced_tweets',
                      'source',
                      'author_id',
                  ],
              },
          }
      );
      // const listSentiments = getSentimentList(search.statuses);
      // const result = calculateSentiment(listSentiments);
      res.status(200).json(data);
  } catch (error) {
      console.log(error);
  }
});
router.post("/api/sentiment", (req, res) => {
  const data = req.body.data;
  console.log(data);
  const sentiment = getSentiment(data);

  return res.send({ sentiment });
});

module.exports = router;
