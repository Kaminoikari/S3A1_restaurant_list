const bcrypt = require ('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require ('dotenv').config ()
}

const Restaurant = require("../restaurant")
const User = require ('../user')
const restaurantList = require("../../restaurant.json").results
const db = require ('../../config/mongoose')

const SEED_USER = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    restaurantId: [1, 2, 3],
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
    restaurantId: [4, 5, 6],
  },
];

db.once('open', () => {
  for (let user_index = 0; user_index < SEED_USER.length; user_index++) {
    // create users
    bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(SEED_USER[user_index].password, salt))
      .then((hash) =>
        User.create({
          name: SEED_USER[user_index].name,
          email: SEED_USER[user_index].email,
          password: hash,
        })
      )
      // create restaurant
      .then((user) => {
        const restaurants = [];

        restaurantList.forEach((restaurant, res_index) => {
          if (res_index >= 3 * user_index && res_index < 3 * (user_index + 1)) {
            restaurant.userId = user._id;
            restaurants.push(restaurant);
          }
        });
        return Restaurant.create(restaurants);
      })
      .then(() => {
        console.log('Seed data created!')
        process.exit()
      })    
  }
});