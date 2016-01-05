'use strict'
/*Main Dependencies*/
const express = require('express')
const stormpath = require('express-stormpath')
const jade = require('jade')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser') //
const methodOverride = require('method-override') //
const logger = require('morgan') //
const sendgrid = require('sendgrid')(process.env.SENDG_ID)
const app = express()
const compHtml = jade.renderFile('./views/email/email.jade')
/*Routers*/
const routes = require('./index') //
const users = require('./users') //
/*Basic Express config*/
app.set('view engine','jade')
app.set('views','../views')
app.use(express.static('public'))
app.use(logger('dev'))
app.use(bodyParser.json()) //
app.use(bodyParser.urlencoded({ extended: true }))
/*methodOverride*/
app.use(methodOverride(function(req,res){
  if(req.body && typeof req.body === 'object' && '_method' in req.body){
    const method = req.body._method
    delete req.body._method
    return method
  }
}))
app.use(cookieParser()) //
// app.use('/',routes)
// app.use('/users',users)
/*Mistaken Addres*/
app.use(function(req,res,next){
  const error  = new Error('Not found')
  error.status = 404;
  next(error)
})
/*Error Handler - Dev*/
if(app.get('env')==='development'){
  app.use(function(error,req,res,next){
    res.status(error.status||500)
    res.render('error',{
      message: error.message,
      error: error
    })
  })
}
/*Error Handler - Prod*/
app.use(function(error,req,res,next){
  res.status(error||500)
  res.render('error',{
    message: error.message,
    error: {}
  })
})

module.exports = app; // FIXME:
