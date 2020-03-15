"use sctrict";
const Api = require("claudia-api-builder");
const api = new Api();

const getPizzas = require("./handlers/get-pizzas");
const createOrder = require("./handlers/create-order");
const getOrders = require("./handlers/get-orders");
const deleteOrder = require("./handlers/delete-order");
const updateOrder = require("./handlers/update-order");

api.get("/", () => "Welcome to Pizza API");

// ** Pizzas
api.get("/pizzas", () => {
  return getPizzas();
});
api.get(
  "/pizzas/{id}",
  request => {
    return getPizzas(request.pathParams.id);
  },
  {
    error: 404
  }
);

// ** Orders
api.get("/orders", () => {
  return getOrders();
});
api.get(
  "/orders/{id}",
  request => {
    return getOrders(request.pathParams.id);
  },
  { error: 404 }
);
api.post(
  "/orders",
  request => {
    return createOrder(request.body);
  },
  { success: 201, error: 400 }
);
api.delete(
  "/orders/{id}",
  request => {
    return deleteOrder(request.pathParams.id);
  },
  { success: 201, error: 400 }
);

api.put(
  "/orders/{id}",
  request => {
    return updateOrder(request.pathParams.id, request.body);
  },
  { success: 201, error: 400 }
);

module.exports = api;
