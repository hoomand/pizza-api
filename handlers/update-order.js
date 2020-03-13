const PIZZAS = require("../data/pizza.json");

const updateOrderPizza = (orderId, newOrder) => {
  if (!orderId) {
    throw Error("Order ID must be specified");
  }
  if (!newOrder || !newOrder.pizzaId || !newOrder.address) {
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
    success: `Order ${orderId} is updated and pizza ${pizza.name} will be delivered to address ${address}`
  };
};

module.exports = updateOrderPizza;
