// import { getSentiment } from "../components/nlp.js";
const { getSentiment } = require("../components/nlp.js");
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

router.get("/", async (req, res, next) => {
  res.send({ message: "This is API main page :)" });
});

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

router.post("/api/sentiment", (req, res) => {
  const data = req.body.data;
  console.log(data);
  const sentiment = getSentiment(data);

  return res.send({ sentiment });
});

module.exports = router;
