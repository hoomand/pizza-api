const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const rp = require("minimal-request-promise");
const apis = require("../config/api_urls");

const deletePizza = orderId => {
  if (!orderId) {
    throw Error("Order ID must be specified");
  }

  console.log("Delete order ID is", orderId);

  return docClient
    .get({
      TableName: "pizza-orders",
      Key: {
        orderId: orderId
      }
    })
    .promise()
    .then(result => result.Item)
    .then(item => {
      console.log("delete an order", item);
      if (item.orderStatus !== "pending") {
        throw new Error(
          `Order id ${orderId} status is not pending, thus cannot be cancelled`
        );
      }

      return rp
        .delete(`${apis.deliveryService}/delivery/${orderId}`, {
          headers: {
            Authorization: "aunt-marias-pizzeria-1234567890",
            "Content-type": "application/json"
          }
        })
        .then(() => {
          return docClient
            .delete({
              TableName: "pizza-orders",
              Key: {
                orderId: orderId
              }
            })
            .promise();
        })
        .then(res => {
          console.log("Order is deleted", res);
          return res;
        })
        .catch(err => {
          console.error(`Oops, order is not deleted :(`, err);
          throw err;
        });
    });
};

module.exports = deletePizza;
