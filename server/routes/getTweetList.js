const { getSentiment } = require("../helpers/nlp.js");
const Twitter = require("twitter");
const express = require("express");
const {getSentimentList} = require("../helpers/nlp");
const router = express.Router();

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});


// The route gets the data from the exact key word
// https://developer.twitter.com/en/docs/twitter-api/v1/tweets/search/api-reference/get-search-tweets
router.get("/", async (req, res, next) => {
    console.log(client)
    try {
        const q = req.query.q;

        const search = await client.get("search/tweets", {
            q,
            lang: 'en'
        }).catch(r => console.log(r));

        res.status(200).json(getSentimentList(search));
    } catch (error) {
        next(error);
    }
});


module.exports = router;
