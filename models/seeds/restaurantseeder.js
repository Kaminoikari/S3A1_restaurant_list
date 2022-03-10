const mongoose = require("mongoose");
const Restaurant = require("../restaurant.js");
const restaurant = require("../../restaurant.json").results;

mongoose.connect("mongodb://localhost/restaurant-list");

const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb error!");
});

db.once("open", () => {
  console.log("mongodb connected!");

  Restaurant.create(restaurant);

  console.log("done.");
});