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

  return {
    success: `Pizza ${pizza.name} will be delivered to address ${address}`
  };
};

module.exports = orderPizza;