'use strict'
const assert = require('assert')
const express = require('express')
const status = require('http-status')
const superagent = require('superagent')
const wagner = require('wagner-core')

const URL_ROOT = 'http://localhost:12000'
var challenge_ID = 1

describe('User Journal', function(){
  var server;
  var Category;
  var challenge;
  var Stripe;
  var User;
  before(function(){
    var app = express();

    models = require('./modelos')(wagner)
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
  beforeEach(function(done){
    const categories = [
      { _id: 'Cinco Personas o menos'},
      { _id: 'Seis a Diez Personas'},
      { _id: 'Diez o mas personas'},
      { _id: 'Aguacate'} //Prueba
    ]
    const challenges = [
      {
        _id : challenge_ID,
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
  it('can save users journal',function(done){
    const url = URL_ROOT + '/me/journal'
    superagent.put(utl).send({
        data: {
          cart:[{challenge_ID, quantity: 1}]
        }
      }).
      end(function(error,res){
        assert.ifError(error)
        assert.equal(res.status, status.OK)
        User.findOne({}, function(error,user){
          assert.ifError(error)
          assert.equal(user.data.journal.length,1)
          assert.equal(user.data.cart[0].challenge, challenge_ID)
          assert.equal(user.data.cart[0].quantity, 1)
          done()
        })
      })
  })
  it('can load users journal',function(done){
    const url = URL_ROOT + '/me'
    User.findOne({},function(error,user){
      assert.ifError(error)
      user.data.journal = [{ challenge: challenge_ID, quantity: 1}]
      user.save(function(error){
        assert.ifError(error)
        superagent.get(url,function(error,res){
          assert.ifError(error)
          assert.equal(res.status, 200)
          var result;
          assert.doesNotThrow(function(){
            result = JSON.parse(res.text).user
          })
          assert.equal(result.data.journal.length, 1)
          assert.equal(result.data.journal[0].challenge.name, '30 minutes Challenge')
          assert.equal(result.data.journal[0].quantity, 1)
          done()
        })
      })
    })
  })
  it('can check out',function(done){
    const url = URL_ROOT + '/checkout'
    User.findOne({},function(error,user){
      asert.ifError(error)
      user.data.journal = [{ product: challenge_ID, quantify: 1 }]
      user.save(function(error){
        assert.ifError(error)
        superagent.post(url).send({
          stripeToken: {
            number: '4242424242424242',
            cvc: '123',
            exp_month: '12',
            exp_yar: '2016'
          }
        }).end(function(error,res){
          assert.ifError(error)
          assert.equal(res.status, 200)
          var result;
          assert.doesNotThrow(function(){
            result = JSON.parse(res.text)
          })
          assert.ok(result.id)
          Stripe.charges.retrieve(result.id,function(error,charge){
            assert.ifError(error)
            assert.ok(charge)
            assert.equal(charge.amount, 100)
            done()
          })
        })
      })
    })
  })
})
