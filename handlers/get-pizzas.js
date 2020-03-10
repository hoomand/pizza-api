const PIZZAS = require("../data/pizza.json");

const getPizzas = pizzaId => {
  if (!pizzaId) {
    return PIZZAS;
  }
  const pizza = PIZZAS.find(pizza => {
    return pizza.id == pizzaId;
  });

  if (pizza) return pizza;

  throw new Error("The pizza you requested was not found");
};

module.exports = getPizzas;
