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
                        max_results: 100, // 100 <PROD> || 10: <DEV>
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

module.exports = router;
