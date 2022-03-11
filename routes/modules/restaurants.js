const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')


// 新增餐廳
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const addItems = req.body
  return Restaurant.create (addItems)
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

// 瀏覽特定餐廳Detail
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant
    .findById(id)
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})


// 修改餐廳頁面
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// 更新餐廳頁面
router.put('/:id', (req, res) => {
  const id = req.params.id

  return Restaurant.findById(id)

    .then(restaurant => {
      restaurant = Object.assign(restaurant, req.body)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// 刪除餐廳功能
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

})

module.exports = router
