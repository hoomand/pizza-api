const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const rp = require("minimal-request-promise");
const uuid = require("uuid");
const PIZZAS = require("../data/pizza.json");
const DUMMY_DELIVERY_API =
  "https://some-like-it-hot.effortless-serverless.com/delivery";
const WEBHOOK_DELIVERY_URL =
  "https://ufvag71js5.execute-api.ap-southeast-2.amazonaws.com/latest/delivery";

const orderPizza = order => {
  if (!order || !order.pizzaId || !order.address) {
    throw new Error("Pizza id and address are needed for an order");
  }
  const { pizzaId, address } = order;

  const pizza = PIZZAS.find(pizza => {
    return pizza.id == pizzaId;
  });

  if (!pizza) {
    throw new Error("The pizza you requested was not found");
  }

  return rp
    .post(DUMMY_DELIVERY_API, {
      headers: {
        Authorization: "aunt-marias-pizzeria-1234567890",
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        pickupTime: "15.34pm",
        pickupAddress: "Aunt Maria Pizzeria",
        deliveryAddress: order.address,
        webhookUrl: WEBHOOK_DELIVERY_URL
      })
    })
    .then(rawResponse => JSON.parse(rawResponse.body))
    .then(response => {
      return docClient
        .put({
          TableName: "pizza-orders",
          Item: {
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
