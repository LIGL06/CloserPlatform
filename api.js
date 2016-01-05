'use strict'
const bodyParser = require('body-parser')
const express = require('express')
const status = require('http-status')
const _ = require('underscore')

module.exports = function(wagner){
  const api = express.Router()

  api.put('/me/challenges',wagner.invoke(function(User){
    return function(req,res){
      try {
        const journal = req.body.data.journal
      } catch (e) {
        return res.status(status.BAD_REQUEST).json({ error: 'No llevas ningún desafío'})
      }
      req.user.data.cart = cart
      req.user.save(function(error,user){
        if (error) return res.status(status.INTERNAL_SERVER_ERROR).json({error:error.toString()})
        return res.json({user:user})
      })
    }
  }))

  api.get('/me',function(req,res){
    if (!req.user) return res.status(status.UNAUTHORIZED).json({error:'No iniciaste sesión'})
    req.user.populate({path:'data.journal.challenge', model: 'Challenge'},
      handleOne.bind(null, 'user' , res))
  })

  api.post('/checkout', wagner.invoke(function(User, Stripe){
    return function(req,res){
      if (!req.user) return res.status(status.UNAUTHORIZED).json({error:'No iniciaste sesión'})

      req.user.populate({path: 'data.journal.challenge', model: 'Challenge'}, function(error,user){
        const totalCostUSD = 0
        _.each(user.data.journal, function(item){
          totalCostUSD += item.challenge.internal.approximatePriceUSD * item.quantify;
        })

      Stripe.charges.create(
        {
          amount: Math.ceil(totalCostUSD * 100),
          currency: 'usd',
          source: req.body.stripeToken,
          description: 'Example Charge'
        },
        function(error,charge){
          if (error && error.type === 'StripeCardError') return res.status(status.BAD_REQUEST).json({error: error.toString()})
          if (error) return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()})
          req.user.data.journal = []
          req.user.save(function(){
            return res.json({ id:charge.id })
          })
        })
      })
    }
  }))
  return api
}

function handleOne(property, res, error, result){
  if (error) return res.status(status.INTERNAL_SERVER_ERROR).json({error:error.toString()})
  if (!result) return res.status(status.NOT_FOUND).json({error:'Not found'})
  const json = {}
  json[property] = result
  res.json(json)
}
