const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// 新增餐廳
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const userId = req.user._id;
  const name = req.body.name;

  return Restaurant.create ({ name, userId }) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後回首頁
    .catch((error) => console.log(error))
})

// 瀏覽特定餐廳Detail
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})


// 修改餐廳頁面
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({_id, userId})
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// 更新餐廳頁面
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const id = req.params.id

  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => {
      restaurant = Object.assign(restaurant, req.params.id)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// 刪除餐廳功能
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const id = req.params.id
  
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

})

module.exports = router
