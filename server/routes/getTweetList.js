const { getSentiment } = require("../helpers/nlp.js");
const Twitter = require("twitter-v2");
const express = require("express");
const {getSentimentList} = require("../helpers/nlp");
const Twitter2 = require("twitter-v2");
const {calculateSentiment} = require("../helpers/twitterSentiment");
const {awsClient} = require("../helpers/awsClient");
const router = express.Router();


const twitterClient = new Twitter2({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

// router.get("/search2", async (req, res, next) => {
//     try {
//         const query = req.query.q;
//         console.log("q", query);
//         const { data }  = await twitterClient.get(
//             'tweets/search/recent',
//             {
//                 query: 'csgo',
//                 max_results: 10,
//                 tweet: {
//                     fields: [
//                         'created_at',
//                         'entities',
//                         'in_reply_to_user_id',
//                         'public_metrics',
//                         'referenced_tweets',
//                         'source',
//                         'author_id',
//                     ],
//                 },
//             }
//         );
//         const listSentiments = getSentimentList(data);
//         const result = calculateSentiment(listSentiments);
//         res.status(200).json(result);
//     } catch (error) {
//         console.log(error);
//     }
// });
router.get("/search/sentiment", async (req, res, next) => {
    try {
        const query = req.query.q;
        console.log("q", query);
        const { data }  = await twitterClient.get(
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

router.get("/search", async (req, res, next) => {
    try {
        const query = req.query.q.replace(/ /g,"_");
        console.log("search for trends:", query);

        const s3Key = `sentiment-${query}`
        const params = {Bucket: process.env.AWS_S3_BUCKET_NAME, Key: s3Key};

        awsClient.getObject(params, async (err, result) => {
            // Serve from S3
            if (result) {
                console.log("Successfully get data from " + params.Bucket + "/" + params.Key)
                return res.status(200).json(JSON.parse(result.Body));
            } else {
                const { data }  = await twitterClient.get(
                    'tweets/search/recent',
                    {
                        query,
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
                const listSentiments = getSentimentList(data);
                const result = calculateSentiment(listSentiments);

                const body = JSON.stringify(result);
                const objectParams = {Bucket: process.env.AWS_S3_BUCKET_NAME, Key: s3Key, Body: body};
                const uploadPromise = awsClient.putObject(objectParams).promise();
                uploadPromise.then(function (data) {
                    console.log("Successfully uploaded data to " + objectParams.Bucket + "/" + objectParams.Key);
                }).catch(err => console.error(err));

                return res.status(200).json(result);
            }
        })
    } catch (error) {
        console.log(error);
    }
});

router.get("/search-fake", async (req, res, next) => {
    try {
        const query = req.query.q.replace(/ /g,"_");

        console.log("search for trends:", query);


        const s3Key = `sentiment-${query}`
        const params = {Bucket: process.env.AWS_S3_BUCKET_NAME, Key: s3Key};

        awsClient.getObject(params, async (err, result) => {
            // Serve from S3
            if (result) {
                console.log("Successfully get data from " + params.Bucket + "/" + params.Key)
                return res.status(200).json(JSON.parse(result.Body));
            } else {
                const { data }  = await twitterClient.get(
                    'tweets/search/recent',
                    {
                        query,
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
                ).catch(err => {
                    console.error(err)
                    res.status(401).json(err);
                });
                const listSentiments = [1,0,0,1,1,0,1,-1,-1,1,-1,1,-1,1,-1,1,-1];
                const result = await calculateSentiment(listSentiments);
                console.log("result", result)

                const objectParams = {Bucket: process.env.AWS_S3_BUCKET_NAME, Key: s3Key, Body: JSON.stringify(result)};
                const uploadPromise = awsClient.putObject(objectParams).promise();
                uploadPromise.then(function (data) {
                    console.log("Successfully uploaded data to " + objectParams.Bucket + "/" + objectParams.Key);
                }).catch(err => console.error(err));

                return res.status(200).json(result);
            }
        })
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
