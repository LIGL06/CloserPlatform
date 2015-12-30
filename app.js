'use strict'
/*Main Dependencies*/
const express = require('express')
const stormpath = require('express-stormpath')
const jade = require('jade')
const fs = require('fs')
const bodyParser = require('body-parser')
const sendgrid = require('sendgrid')(process.env.SENDG_ID)
const app = express()
const compHtml = jade.renderFile('./views/email/email.jade')
const port = process.env.PORT || 12000
/*Basic Express config*/
app.set('view engine','jade')
app.set('views','./views')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
/*Stormpath Middleware*/
app.use(stormpath.init(app,{
  website: true
}))
/*Routes for WebPlatform*/
app.get('/',function(req,res){
  res.render('home/index')
})
/*Server listening*/
// app.on('stormpath.ready',function(){
//   app.listen(port)
//   console.log('App listening on %s', port)
// })
app.listen(port)
