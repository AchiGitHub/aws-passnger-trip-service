// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

var AWS = require('aws-sdk');

module.exports.createPassengerTrips = async (event, context, callback) => {
    var dynamoDb = new AWS.DynamoDB.DocumentClient();
    let responseBody = JSON.parse(event.body);
    const params = {
        TableName: "Passenger-Trips",
        Item: {
            id: context.awsRequestId,
            passengerName: responseBody.passengerName,
            tripTime: responseBody.tripTime,
            fare: responseBody.fare,
            createdAt: Date.now()
        }
    };
    return dynamoDb
        .put(params)
        .promise()
        .then((result) => {
            var response = {
                "statusCode": 200,
                "body": JSON.stringify(params.Item)
            };
            return response;
        }, (error) => {
            return error;
        });
};

module.exports.getPassengerTrips = async (event, context, callback) => {
    var dynamoDb = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: "Passenger-Trips",
        Select: "ALL_ATTRIBUTES"
    };

    return dynamoDb
        .scan(params)
        .promise()
        .then((result) => {
            var response = {
                "statusCode": 200,
                "body": JSON.stringify(result)
            };
            return response;
        }, (error) => {
            return error;
        });
};