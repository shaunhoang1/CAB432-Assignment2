require("dotenv").config();
const express = require("express");
const responseTime = require("response-time");
const axios = require("axios");
const redis = require("redis");

const app = express();

// This section will change for Cloud Services
const redisClient = redis.createClient();

const AWS = require("aws-sdk");
// Create unique bucket name
const bucketName = "tuanhoang0110-wikipedia-store";

// const bucketPromise = new AWS.S3({apiVersion: '2006-03-01'}).createBucket({Bucket: bucketName}).promise();
// // Handle promise fulfilled/rejected states
// bucketPromise.then(function(data) {
//     console.log("Successfully created " + bucketName)
//  }).catch(function(err) {
//  console.error(err, err.stack);
// });

redisClient.on("error", (err) => {
  console.log("Error " + err);
});

// Used for header info later.
app.use(responseTime());

app.get("/api/store", (req, res) => {
  const key = req.query.key.trim();
  // Construct the wiki URL and S3 key
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${key}`;
  const s3key = `wikipedia-${key}`;

  // Check S3
  const params = { Bucket: bucketName, Key: s3key };

  return new AWS.S3({ apiVersion: "2006-03-01" }).getObject(
    params,
    (err, result) => {
      if (result) {
        // Serve from S3
        console.log(result);
        const resultJSON = JSON.parse(result.Body);
        return res.status(200).json(resultJSON);
      } else {
        // Serve from Wikipedia API and store in S3
        return axios
          .get(searchUrl)
          .then((response) => {
            const responseJSON = response.data;
            const body = JSON.stringify({
              source: "S3 Bucket",
              ...responseJSON,
            });
            const objectParams = { Bucket: bucketName, Key: s3key, Body: body };
            const uploadPromise = new AWS.S3({ apiVersion: "2006-03-01" })
              .putObject(objectParams)
              .promise();
            uploadPromise.then(function (data) {
              console.log(
                "Successfully uploaded data to " + bucketName + "/" + s3key
              );
            });
            return res
              .status(200)
              .json({ source: "Wikipedia API", ...responseJSON });
          })
          .catch((err) => {
            return res.json(err);
          });
      }
    }
  );
});

app.get("/api/search", (req, res) => {
  const query = req.query.query.trim();
  // Construct the wiki URL and key
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${query}`;
  const redisKey = `wikipedia:${query}`;
  const s3key = `wikipedia-${query}`;

  // Try the cache
  return redisClient.get(redisKey, (err, result) => {
    // If key exist in Redis store
    if (result) {
      // Serve from Cache
      const resultJSON = JSON.parse(result);
      return res.status(200).json(resultJSON);
    } // If key does not exist in Redis cache, check in S3 and serve if contains, also store in cache
    else {
      // Check S3
      const params = { Bucket: bucketName, Key: s3key };

      return new AWS.S3({ apiVersion: "2006-03-01" }).getObject(
        params,
        (err, result) => {
          if (result) {
            // Serve from S3
            const resultJSON = JSON.parse(result.Body);
            return axios
              .get(searchUrl)
              .then((response) => {
                const responseJSON = response.data;
                redisClient.setex(
                  redisKey,
                  3600,
                  JSON.stringify({ source: "Redis Cache", ...responseJSON })
                );
                return res.status(200).json(resultJSON);
              })
              .catch((err) => {
                return res.json(err);
              });
          } else {
            // Serve from Wikipedia API and store in S3 and in the cache
            return axios
              .get(searchUrl)
              .then((response) => {
                const responseJSON = response.data;
                redisClient.setex(
                  redisKey,
                  3600,
                  JSON.stringify({ source: "Redis Cache", ...responseJSON })
                ); // Store in cache
                const body = JSON.stringify({
                  source: "S3 Bucket",
                  ...responseJSON,
                });
                const objectParams = {
                  Bucket: bucketName,
                  Key: s3key,
                  Body: body,
                };
                const uploadPromise = new AWS.S3({ apiVersion: "2006-03-01" })
                  .putObject(objectParams)
                  .promise();
                uploadPromise.then(function (data) {
                  console.log(
                    "Successfully uploaded data to " + bucketName + "/" + s3key
                  );
                });
                return res
                  .status(200)
                  .json({ source: "Wikipedia API", ...responseJSON });
              })
              .catch((err) => {
                return res.json(err);
              });
          }
        }
      );
    }
  });
});
app.listen(3000, () => {
  console.log("Server listening on port: ", 3000);
});
