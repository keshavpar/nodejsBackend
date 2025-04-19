// config/aws.js
const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
  region: "ap-south-1",
});

module.exports = s3;
