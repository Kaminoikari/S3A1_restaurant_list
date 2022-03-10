"use strict";
const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require ('method-override')
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const restaurantList = require("./models/restaurant");

mongoose.connect('mongodb://localhost/restaurant_list', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

const app = express();
const port = 3000;

// express template engine
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: '.hbs'}));
app.set("view engine", 'hbs');

// setting static files
app.use(express.static("public"));

// 使用app.use規定每筆請求都需先透過body-parser處理
app.use( bodyParser.urlencoded({ extended: true }) )

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use (methodOverride("_method"))

// 瀏覽全部餐廳
app.get("/", (req, res) => {
  restaurantList.find({})
    .lean()
    .then(restaurantsData => res.render("index", { restaurantsData }))
    .catch(err => console.log(err))
})

// 搜尋特定餐廳
app.get("/search", (req, res) => {
  if (!req.query.keywords) {
    res.redirect("/")
  }

  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()

  restaurantList.find({})
    .lean()
    .then(restaurantsData => {
      const filterRestaurantsData = restaurantsData.filter(
        data =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      )
      res.render("index", { restaurantsData: filterRestaurantsData, keywords })
    })
    .catch(err => console.log(err))
})

// 新增餐廳頁面
app.get("/restaurants/new", (req, res) => {
  res.render("new")
})

// 瀏覽特定餐廳
app.get("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurantData => res.render("show", { restaurantData }))
    .catch(err => console.log(err))
})

// 新增餐廳
app.post("/restaurants", (req, res) => {
  restaurantList.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

// 編輯餐廳頁面
app.get("/restaurants/:restaurantId/edit", (req, res) => {
  const { restaurantId } = req.params
  restaurantList.findById(restaurantId)
    .lean()
    .then(restaurantData => res.render("edit", { restaurantData }))
    .catch(err => console.log(err))
})

// 更新餐廳
app.put("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
    //可依照專案發展方向自定編輯後的動作，這邊是導向到瀏覽特定餐廳頁面
    .then(() => res.redirect(`/restaurants/${restaurantId}`))
    .catch(err => console.log(err))
})

// 刪除餐廳
app.delete("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findByIdAndDelete(restaurantId)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})