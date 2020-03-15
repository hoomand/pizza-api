const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const PIZZAS = require("../data/pizza.json");

const updateOrderPizza = (orderId, newOrder) => {
  if (!orderId) {
    throw Error("Order ID must be specified");
  }
  if (!newOrder || !newOrder.pizzaId || !newOrder.address) {
    throw Error("Pizza id and address are needed to identify an order");
  }

  const { pizzaId, address } = newOrder;

  const pizza = PIZZAS.find(pizza => {
    return pizza.id == pizzaId;
  });

  if (!pizza) {
    throw new Error("The pizza you requested was not found");
  }

  return docClient
    .update({
      TableName: "pizza-orders",
      Key: { orderId: orderId },
      UpdateExpression: "set pizza = :p, address = :a",
      ExpressionAttributeValues: {
        ":p": pizza,
        ":a": address
      },
      ReturnValues: "ALL_NEW"
    })
    .promise()
    .then(res => {
      console.log("Order is updated!", res);
      return res.Attributes;
    })
    .catch(err => {
      console.error(
        `Order not updated :( Error JSON: ${JSON.stringify(err, null, 2)}`
      );
      throw err;
    });
};

module.exports = updateOrderPizza;
