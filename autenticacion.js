function setupAuth(User, app){
  const passport = require('passport')
  const Facebook = require('passport-facebook').Strategy


  passport.seralizeUser(function(user, done){
    done(null, user._id)
  })

  passport.deserializeUser(function(id, done){
    User.findOne({ _id : id }).exec(done)
  })

  passport.use(new Facebook(
  {
    clientID: process.env.FB_ID //Necesitas tu FB developer ID
    clientSecret: process.env.FB_SEC //Necistas tu FB developer Secret
    callbackURL: 'http:localhost:12000/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, done){
    if (!profile.emails || !profile.emails.length) return done('Pa ke kieres entrar eso jajaja saludos')

    User.findOneAndUpdate(
      { 'data.oauth': profile.id },
      {
        $set: {
          'profile.username': profile.emails[0].value,
          'profile.picture': 'http://graph.facebook.com/' +
            profile.id.toString() + '/picture?type=large'
        }
      },
      { 'new' : true, upsert: true, runValidators: true },
      function(error,user){
        done(error,user)
      })
  }))

  app.use(require('express-session')({
    secret: 'esto es un secret'
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.get('/auth/facebook', passport.authenticate('facebook',{ scope: ['email'] }))
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook',{ failureRedirect: '/fail' }),
    function(req,res){
      res.send('Bienvenido, ' + req.user.profile.username)
    })
}

module.exports = setupAuth
