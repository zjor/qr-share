require('dotenv').config();

const AWS = require('aws-sdk');

const credentials = {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey : process.env.S3_SECRET_KEY
};

AWS.config.update({credentials: credentials, region: 'eu-central-1'});
const s3 = new AWS.S3();

const preSignedUrl = s3.getSignedUrl('putObject', {
    Bucket: process.env.S3_BUCKET,
    Key: 'image.jpg', //filename
    Expires: 300 //time to expire in seconds
});

console.log(preSignedUrl);