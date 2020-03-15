const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const PIZZAS = require("../data/pizza.json");

const deletePizza = orderId => {
  if (!orderId) {
    throw Error("Order ID must be specified");
  }

  return docClient
    .delete({
      TableName: "pizza-orders",
      Key: {
        orderId: orderId
      }
    })
    .promise()
    .then(res => {
      console.log("Order is deleted", res);
      return res;
    })
    .catch(err => {
      throw err;
    });
};

module.exports = deletePizza;
