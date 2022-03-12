const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// 瀏覽所有餐廳
router.get('/', (req, res) => {
  Restaurant
    .find()
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.log(error))
})

// 搜尋欄
router.get('/search', (req, res) => {

  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()

  Restaurant.find() // Current restaurant list
    .lean()
    .then(restaurant => {
      if (!keywords) {
        return res.render('index', { restaurant })
      }
      
    const restaurantSearchResults = 
    restaurant.filter((data) => { 
      return data.name.toLowerCase().includes(keyword) || 
      data.category.toLowerCase().includes(keyword) })
      return restaurantSearchResults
      })

    .then((restaurantSearchResults) => res.render('index', { restaurant: restaurantSearchResults, keyword: keywords }))
    .catch(error => console.log('error'))
})

module.exports = router