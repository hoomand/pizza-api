"use strict";
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const updateDeliveryStatus = request => {
  if (!request.deliveryId || !request.status) {
    throw new Error("Status and delivery ID are required");
  }

  return docClient
    .update({
      TableName: "pizza-orders",
      Key: {
        orderId: request.deliveryId
      },
      AttributeUpdates: {
        deliveryStatus: {
          Action: "PUT",
          Value: request.status
        }
      }
    })
    .promise()
    .then(() => {
      return {};
    });
};

module.exports = updateDeliveryStatus;
