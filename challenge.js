'use strict'
const mongoose = require('mongoose')
const Category = require('./category')
const fx = require('./fx')

const challengeSchema = {
  name: { type: String, required: true},
  pictures: [{ type: String, match: /^http:\/\//i}],
  points: {
    amount: {
      type: Number,
      require: true,
      set: function(v){
        this.internal.aproximatePriceUSD = v / (fx()[this.price.currency] || 1)
        return v
      }
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP'],
      required: true,
      set: function(v){
        this.internal.approximatePriceUSD = this.price.amount / (fx()[v] || 1)
        return v
      }
    }
  },
  category: Category.categorySchema,
  internal: {
    approximatePriceUSD: Number
  }
}

const schema = new mongoose.Schema(challengeSchema)

const currencySymbols = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£'
}

schema.virtual('displayPrice').get(function(){
  return currencySymbols[this.price.currency] + '' + this.price.amount
})

schema.set('toObject',{ virtuals: true })
schema.set('toJSON', { virtual: true })

module.exports = schema
module.exports.productSchema = productSchema
