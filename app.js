const express = require("express")
const exphbs = require("express-handlebars")
const bodyParser = require('body-parser');
const methodOverride = require ('method-override')
const session = require ('express-session')
const flash = require ('connect-flash')

if (process.env.NODE_ENV !== 'production') {
  require ('dotenv').config()
}

const mongoose = require("mongoose")
const restaurantList = require("./models/restaurant")
const app = express()
const port = 3000

const routes = require('./routes')
const { config } = require ('dotenv')
require('./config/mongoose.js');

// express template engine
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: '.hbs'}))
app.set("view engine", 'hbs')

// setting static files
app.use(express.static("public"))

app.use (session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))

// 使用app.use規定每筆請求都需先透過body-parser處理
app.use( bodyParser.urlencoded({ extended: true }) )

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use (methodOverride("_method"))

// 設定router
app.use(routes)


app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})