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
  "application":{
    href: 'https://api.stormpath.com/v1/applications/5w4nszwSJf0wElIB8AAnGq'
  },
  "web":{
    "oauth2":{
      "enabled":true,
      "uri":"/oauth/token",
      "client_credentials":{
        "enabled":true,
        "accessToken":{
          "ttl":3600}
        },
          "password":{
            "enabled":true,
            "validationStrategy":"stormpath"
          }
    },
        "accessTokenCookie":{
          "name":"access_token",
          "httpOnly":true,
          "secure":null,
          "path":"/",
          "domain":null
        },
        "refreshTokenCookie":{
          "name":"refresh_token",
          "httpOnly":true,
          "secure":null,
          "path":"/",
          "domain":null
        },
        "register":{
          "enabled":true,
          "uri":"/register",
          "nextUri":"/verifyEmail",
          "autoLogin":false,
          "fields":{
            "givenName":{
              "enabled":true,
              "label":"First Name",
              "name":"givenName",
              "placeholder":"Nombre",
              "required":true,
              "type":"text"
            },
            "middleName":{
              "enabled":false,
              "label":"Middle Name",
              "name":"middleName",
              "placeholder":"Middle Name",
              "required":true,
              "type":"text"
            },
            "surname":{
              "enabled":true,
              "label":"Last Name",
              "name":"surname",
              "placeholder":"Apellido(s)",
              "required":true,
              "type":"text"
            },
            "username":{
              "enabled":false,
              "label":"Username",
              "name":"username",
              "placeholder":"Username",
              "required":true,
              "type":"text"
            },
            "email":{
              "enabled":true,
              "label":"Email",
              "name":"email",
              "placeholder":"Email",
              "required":true,
              "type":"email"
            },
            "password":{
              "enabled":true,
              "label":"Password",
              "name":"password",
              "placeholder":"Password",
              "required":true,
              "type":"password"
            }
          },
          "fieldOrder":[
            "username",
            "givenName",
            "middleName",
            "surname",
            "email",
            "password"
          ],
          "view":__dirname + '/views/Stormpath/register.jade'
        },
        "verifyEmail":{
          "uri":"/verify",
          "nextUri":"/",
          "view":__dirname + '/views/Stormpath/verify.jade'
        },
        "login":{
          "enabled":false,
          "uri":"/login",
          "nextUri":"/home",
           "view": __dirname + '/views/Stormpath/login.jade'
        },
        "logout":{
          "enabled":false,
          "uri":"/logout",
          "nextUri":"/"
        },
        "forgotPassword":{
          "enabled":false,
          "uri":"/forgot",
          "view":__dirname + '/views/Stormpath/forgot-password.jade',
          "nextUri":"/login?status=forgot"
        },
        "changePassword":{
            "enabled":false,
            "autoLogin":false,
            "uri":"/change",
            "nextUri":"/login?status=reset",
            "view":__dirname + '/views/Stormpath/change-password.jade',
            "errorUri":"/forgot?status=invalid_sptoken"
          },
        "idSite":{
          "enabled":false,
          "uri":"/idSiteResult",
          "nextUri":"/",
          "loginUri":"",
          "forgotUri":"/#/forgot",
          "registerUri":"/#/register"
        },
        "me":{
          "enabled":false,
          "uri":"/me"
        }
    },
  website: true
}))
/*Routes for WebPlatform GETS*/
app.get('/',function(req,res){
  res.render('home/index')
})
app.get('/register',function(req,res){
  res.render('Stormpath/register')
})
/*Routes for WebPlatform POSTS*/
app.post('/register',function(req,res){
  sendgrid.send({
  to:       req.body.email,
  from:     'no-reply@closerapp.mx',
  subject:  'Registro exitoso',
  html:     compHtml
  }, function(err, json) {
  if (err) { return console.error(err); }
  console.log(json);
  })
})
/*Server listening*/
app.on('stormpath.ready',function(){
  app.listen(port)
  console.log('App listening on %s', port)
})
