const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const uniqid = require("uniqid");
const PIZZAS = require("../data/pizza.json");

const orderPizza = order => {
  if (!order || !order.pizzaId || !order.address) {
    throw Error("Pizza id and address are needed for an order");
  }

  const { pizzaId, address } = order;

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
        orderId: uniqid(),
        pizza: pizza,
        address: order.address,
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
