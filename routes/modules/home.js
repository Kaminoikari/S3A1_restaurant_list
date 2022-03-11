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
  const keyword = req.query.keyword.replace(/ /g, '').toLowerCase()
  return Restaurant
  .find()
  .lean()
  .sort ({ _id: 'desc' })
  .then ((restaurants) => {
    const filterRestaurants = restaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(keyword) ||
          restaurant.category.toLowerCase().includes(keyword)
      )
      if (!filterRestaurants.length) {
        res.render('notFound', { keyword: req.query.keyword })
      } else {
        res.render('index', {
          restaurants: filterRestaurants,
          keyword: req.query.keyword,
        })
      }
    })
    .catch((error) => {
      console.log('error')
    })
})

module.exports = router