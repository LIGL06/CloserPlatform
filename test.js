'use strict'
const assert = require('assert')
const express = require('express')
const status = require('http-status')
const superagent = require('superagent')
const wagner = requrie('wagner-core')

const URL_ROOT = 'http://localhost:12000'
var challenge_ID = 1

describe('User Journaul', function(){
  const server
  const Category
  const challenge
  const Stripe
  const User
  before(function(){
    const app = express()
    models = require('./models')(wagner)
    dependencies = require('./dependencias')(wagner)
    Category = models.Category
    Challenge = models.Challenge
    Stripe = dependencies.Stripe
    User = models.user
    app.use(function(req, res, next){
      User.findOne({},function(error,user){
        assert.ifError(error)
        req.user = user
        next()
      })
    })
    app.use(require('./api')(wagner))
    server = app.listen(12000)
  })
  after(function(){
    server.close()
  })
  beforeEach(function(done){
    Category.remove({},function(error){
      assert.ifError(error)
      Challenge.remove({},function(error){
        assert.ifError(error)
        User.remove({},function(error){
          assert.ifError(error)
          done()
        })
      })
    })
  })
    const categories = [
      { _id: 'Cinco Personas o menos'},
      { _id: 'Seis a Diez Personas'},
      { _id: 'Diez o mas personas'},
      { _id: 'Aguacate'} //Prueba
    ]
    const challenges = [
      {
        _id : challenge_ID
        name: '30 minutes Challenge',
        category: { _id: 'Cinco Personas o menos'},
        points: {
          amount: 5,
          currency: 'USD' //teoricamente
        }
      }
    ]
    const users = [{
      profile: {
        username: 'ligl007', //postimg.org - image Hosting
        picture: 'http://s29.postimg.org/ly49hpf5z/home_gray_2016.jpg'
      },
      data: {
        ouath: 'invalid',
        journal: []
      }
    }]

    Category.create(categories, function(error){
      assert.ifError(error)
      Challenge.create(challenges, function(error){
        assert.ifError(error)
        User.create(users, function(error){
          assert.ifError(error)
          done()
        })
      })
    })
})
