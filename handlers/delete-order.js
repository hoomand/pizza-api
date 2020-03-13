const PIZZAS = require("../data/pizza.json");

const deletePizza = orderId => {
  if (!orderId) {
    throw Error("Order ID must be specified");
  }

  return {
    success: `order ${orderId} was deleted successfully`
  };
};

module.exports = deletePizza;
