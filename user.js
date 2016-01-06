'use strict'
const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
  profile: {
    username: {
      type: String,
      required: true,
      lowecase: true
    },
    picture: {
      type: String,
      required: true,
      match: /^http:\/\//i
    }
  },
  data: {
    oauth: {
      type: String,
      required: true
    },
    journal: [{
      challenge: {
        type: mongoose.Schema.Types.ObjectId
      },
      quantify: {
        type: Number,
        default: 1,
        min: 1
      }
    }]
  }
})

module.exports.set('toObject', {virtuals: true})
module.exporst.set('toJSON', {virtuals: true})
