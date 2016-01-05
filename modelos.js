'use strict'
const mongoose = require('mongoose')
const _ = require('underscore')

module.exports = function(wagner){
  mongoose.connect('mongodb://localhost:27017/closer')

  const Category =
    mongoose.model('Category', require('./category'), 'categories')
  const Challenge =
    mongoose.models('Challenge', require('./challenge'), 'challenges')
  const User =
    mongoose.models('User', require('./user'), 'users')

  const models = {
    Category: Category,
    Challenge: Challenge,
    User: User
  }

  _.each(models, function(value,key){
    wagner.factory(key, function(){
      return value
    })
  })

  return models
}
