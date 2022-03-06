"use strict";
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const restaurantList = require("./restaurant.json");
const app = express();
const port = 3000;

// Set up connection w/ mongoDB database
mongoose.connect ("mongodb://localhost/restaurant_list")
const db = mongoose.connect; // 取得資料庫連彥狀態

// 連線異常/失敗
db.on("error", () => {
  console.log("mongoDB error!!")
})

// 連線成功
db.once("open", () => {
  console.log("mongoDB connected!!")
})

// 使用app.use規定每筆請球都需先透過body-parser處理
app.use (bodyParser.urlencoded, ({ extended: true }))

// express template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// setting static files
app.use(express.static("public"));

// render index page
app.get("/", (req, res) => {
  restaurantList
  .find ()
  .lean ()
  .then ((restaurants) => res.render ("index", { restaurants }))
  .catch((error) => console.log (error))
});

// render edit page
app.get("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id
  .findById (id)
  .lean ()
  .then ((restaurant) => res.render ("edit", { restaurant }))
  .catch((error) => console.log (error))
});

// save edit page
app.post("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id
  const newRestaurant = req.body
  return restaurantList
  .findOneAndUpdate ({ _id:id }, newRestaurant)
  .then (res.redirect ('/'))
  .catch((error) => console.log(error))
});

// delete restaurant
app.post("/restaurants/:id/delete", (req, res) => {
  const id = req.params.id
  restaurantList
  .findById (id)
  .then((restaurant) => restaurant.delete())
  .then (res.redirect ('/'))
  .catch((error) => console.log(error))
});

// render create page
app.get ("/restaurants/create", (req, res) => {
  res.render ("create")
})

// submit create page
app.post ("/restaurants/new", (req, res) => {
  const restaurant = req.body
  return restaurantList
  .create (restaurant)
  .then(() => res.redirect ('/'))
  .catch((error) => console.log(error))
})

// render show page
app.get("/restaurants/:restaurants_id", (req, res) => {
  console.log(req.params.restaurants_id);
  const restaurant = restaurantList.results.find(
    (restaurant) => restaurant.id.toString() === req.params.restaurants_id
  );
  console.log(restaurant);
  res.render("show", { restaurant });
});

// render search page
app.get("/search", (req, res) => {
  
  const restaurants = restaurantList.results.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase()) ||
      restaurant.category.includes(req.query.keyword)
  );
  res.render("index", { restaurants, keyword: req.query.keyword });
});

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});
