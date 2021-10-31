const AWS = require('aws-sdk');

// Cloud Services Set-up
// Create unique bucket name
const bucketName = process.env.AWS_S3_BUCKET_NAME;

const awsClient = new AWS.S3({
    apiVersion: '2006-03-01'
})
// Create a promise on S3 service object
const bucketPromise = awsClient.createBucket({Bucket: bucketName}).promise();

bucketPromise.then(function (data) {
    console.log("Successfully created bucket:", bucketName)
}).catch(function (err) {
    console.log("Can not create bucket, please check if bucket is existed!");

});


module.exports.awsClient = awsClient;