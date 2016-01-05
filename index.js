const express = require('express')
const stormpath = require('express-stormpath')
const sqlite = require('sqlite3').verbose() //email,username,password,Bday
const db = new sqlite.Database('emailsdb')
const app = express()
const router = express.Router()
const port = process.env.PORT || 12000
// const UserModel = require('../models/users')
app.set('view engine','jade')
app.use(express.static('public'))
/*Db parameters*/
db.serialize(function(){
  db.run('CREATE TABLE IF NOT EXISTS emails (key TEXT, email VARCHAR(255), userame')
})
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
app.get('/user/:id',function(req,res){
  const id = req.body.id
  if (!isNaN(id)) {
    UserModel.getUser(id,function(error,data){
      if (typeof data !=='undefined' && data.length>0) {
        res.render('update')
        }
        else res.json(404,{"msg":"notExist"})
      })
    }
  else res.json(500,{"msg":"The id must be numeric"})
})
app.get('/users',function(req,res){
  UserModel.getUsers(function(error,data){
    if (typeof data!=='undefined') res.render('show')
    else res.json(404,{"msg":"notExist"})
  })
})
/*Routes for WebPlatform POSTS*/
app.post('/register',function(req,res){
  const userData = {
    id: null,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    birthday: req.body.birth,
    created_at: null
  }
  UserModel.insertUser(userData,function(error,data){
    if (data && data.insertId) res.redirect("/user" + data.insertId)
    else res.json(500,{"msg":"Error"})
  })
  // sendgrid.send({
  // to:       req.body.email,
  // from:     'no-reply@closerapp.mx',
  // subject:  'Registro exitoso',
  // html:     compHtml
  // }, function(err, json) {
  // if (err) { return console.error(err); }
  // console.log(json);
  // })
})
app.post('/',function(req,res){

})
/*Routes for WebPlatform PUTS*/
app.put('/user',function(req,res){
  const userData = {
    id:req.param('id'),
    username:req.param('username'),
    email:req.param('email')
  }
  UserModel.updateUser(userData,function(error,data){
    if (data && data.msg) res.redirect('/user'+req.param('id'))
    else res.json(500,{"msg":"Error"})
  })
})
/*Routes for WebPlatform Delete*/
app.delete('/user',function(req,res){
  const id = req.param('id')
  UserModel.deleteUser(id,function(error,data){
    if(data && data.msg=== 'deleted'||data.msg==="notExist") res.redirect('/users')
    else res.json(500,{"msg":"Error"})
  })
})
/*Server listening*/
app.on('stormpath.ready',function(){
  app.listen(port)
  console.log('App listening on %s', port)
})

module.export = app;
