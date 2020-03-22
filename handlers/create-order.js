const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));
const docClient = new AWS.DynamoDB.DocumentClient();
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

  return rp
    .post(apis.deliveryService, {
      headers: {
        Authorization: "aunt-marias-pizzeria-1234567890",
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        pickupTime: "15.34pm",
        pickupAddress: "Aunt Maria Pizzeria",
        deliveryAddress: address,
        webhookUrl: apis.ourWebhook
      })
    })
    .then(rawResponse => JSON.parse(rawResponse.body))
    .then(response => {
      return docClient
        .put({
          TableName: "pizza-orders",
          Item: {
            cognitoUsername: address["cognito:username"],
            orderId: response.deliveryId,
            pizza: pizza,
            address: address,
            orderStatus: "pending"
          }
        })
        .promise();
    })
    .then(res => {
      console.log("Order is saved");
      return res;
    })
    .catch(error => {
      console.error(`Oops, order is not saved :(`, error);
      throw error;
    });
};

module.exports = orderPizza;
