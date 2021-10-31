// import { getSentiment } from "../helpers/nlp.js";
const {getSentiment} = require("../helpers/nlp.js");
const express = require("express");
const router = express.Router();
const Twitter = require("twitter");
const redis = require("redis");

const twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});
// This section will change for Cloud Services
const redisClient = redis.createClient(); // Uncomment below for production
// const redisClient = redis.createClient({
//     host: "shaun-patrick-cluster.km2jzi.0001.apse2.cache.amazonaws.com",
//     port: 6379
// });
redisClient.on('error', (err) => {
    console.log("Error", err);
})

// router.get("/", async (req, res, next) => {
//   res.send({ message: "This is API main page :)" });
// });

// // To get trending topics
// router.get("/trends", async (req, res, next) => {
//     try {
//         const id = req.query.woeid;
//         const trends = await twitterClient.get("trends/place.json", {
//             id,
//         });
//
//         res.status(200).json(trends[0]);
//     } catch (error) {
//         next(error);
//     }
// });
// To get trending topics
router.get("/trends", async (req, res, next) => {

    const id = req.query.woeid;
    const key = `trends-${id}`

    return redisClient.get(key, async (err, result) => {
        if (result) {
            // Serve from Cache
            const resultJSON = JSON.parse(result);
            console.log("Achieved from redis: ", key);
            return res.status(200).json(resultJSON);
        }

        const trends = await twitterClient.get("trends/place.json", {
            id,
        });
        const trend = await trends[0]
        // Store to Redis for 3600s
        await redisClient.setex(key, 3600, JSON.stringify({
            source: 'Redis Cache', ...trend,
        }));
        return res.status(200).json(trend);
    });
});

// The route gets the WOEID for a particular location (latitude/longtitude)
router.get("/near-me", async (req, res, next) => {
    try {
        const {lat, long} = req.query;
        const response = await twitterClient.get("/trends/closest.json", {
            lat,
            long,
        });
        console.log(response)
        res.send(response);
    } catch (error) {
        next(error);
    }
});

router.post("/api/sentiment", (req, res) => {
    const data = req.body.data;
    console.log(data);
    const sentiment = getSentiment(data);

    return res.send({sentiment});
});

module.exports = router;
