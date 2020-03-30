const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));
const docClient = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");
const rp = require("minimal-request-promise");
const PIZZAS = require("../data/pizza.json");
const apis = require("../config/api_urls");

const orderPizza = order => {
  console.log("Save an order", order);

  const userData = order.context.authorizer.claims;
  console.log("User data", userData);

  let address = order.body && order.body.address;
  if (!address) {
    address = JSON.parse(userData.address).formatted;
  }

  if (!order.body || !order.body.pizzaId || address) {
    throw new Error("Pizza id and address are needed for an order");
  }
  const { pizzaId } = order.body;

  const pizza = PIZZAS.find(pizza => {
    return pizza.id == pizzaId;
  });

  if (!pizza) {
    throw new Error("The pizza you requested was not found");
  }

  return docClient
    .put({
      TableName: "pizza-orders",
      Item: {
        orderId: uuid.v4(),
        pizza: pizza,
        address: address,
        orderStatus: "pending"
      }
    })
    .promise()
    .then(res => {
      success: `Pizza ${pizza.name} will be delivered to address ${address}`;
    })
    .catch(error => {
      console.log(`Oops, order is not saved :(`, error);
      throw error;
    });
};

module.exports = orderPizza;
