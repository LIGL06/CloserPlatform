'use strict'
const Stripe = require('stripe')

module.exports = function(wagner){
  const stripe = Stripe(process.env.STRIPE_API) //Necesitas una API Key

  wagner.factory('Stripe',function(){
    return stripe
  })

  return{
    Stripe: stripe
  }
}
