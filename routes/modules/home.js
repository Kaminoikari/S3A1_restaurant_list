const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// 瀏覽所有餐廳
router.get('/', (req, res) => {
  Restaurant
    .find()
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => 
      console.log(error))
})

// 搜尋欄
router.get('/search', (req, res) => {
  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()
  const sort = req.query.sort
  let mode = {}

  switch(sort) {
    case "A > Z":
      mode = { name: "asc" }
      break;
    case "Z > A":
      mode = { name: "desc" }
      break;
    case "類別":
      mode = { category: 'asc' }
      break;
    case "地區":
      mode = { location: 'asc' }
      break;
  }


  if (!req.query.keywords) {
    Restaurant.find()
      .lean()
      .sort(mode)
      .then(restaurant => res.render('index', { restaurant }))
    
    } else {
    Restaurant.find()
      .lean()
      .then(restaurant => {
        const filterRestaurantData = 
        restaurant.filter((data) => { 
          return data.name.toLowerCase().includes(keyword) || 
          data.category.toLowerCase().includes(keyword) })
        return filterRestaurantData
      })

      .then((filterRestaurantData) => 
      res.render('index', { restaurant: filterRestaurantData, keyword: keywords }))
      .catch(error => console.log('error'))
  }
})

module.exports = router