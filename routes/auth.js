var express = require('express');
var router  = express.Router();
var User = require('../models/user');

//var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy  = require('passport-local').Strategy

module.exports = function (passport) {

        /*** LOGIN ***/
    //passport.use(new LocalStrategy(User.authenticate()));

    router.get('/login', function (req, res) {
        res.render('login');
    });

    router.post('/login',
                 passport.authenticate('local', { successRedirect: '/home',
                                                  failureRedirect: '/',
                                                  failureFlash: false })
    );


        /*** REGISTER ***/
    /*
    passport.use('local-register', new LocalStrategy({ passReqToCallback : true },
        function(username, password, done) {
            User.findOne({ username: username }, function (err, user) {
              if (err) { return done(err); }
              if (!user) { return done(null, false); }
              if (!user.verifyPassword(password)) { return done(null, false); }
              return done(null, user);
            });
        }
    ));
    */

    router.get('/register', function(req, res) {
        res.render('register');
    });

    router.post('/register', function (req, res, next) {
        User.register ( new User ({ username : req.body.username,
                                    firstName : req.body.firstName,
                                    lastName : req.body.lastName,
                                    age : req.body.age,
                                    email : req.body.email }),
                        req.body.password,
                        function (err, user) {
                            if (err) {
                                console.log(err);
                                //res.redirect('/auth/register');
                                return next(err);
                            }

                            // Redirect to home (temporary)
                            res.redirect('/auth/login');
        });
    });


        /*** REGISTER ***/
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    /**************/
    /*** GOOGLE ***/
    /**************/

    /*
    passport.use(new GoogleStrategy({
            // Client ID and secret
            clientID: '43179384685-o0vpi07n2io46a6m98q81qhjb829e4dm.apps.googleusercontent.com',
            clientSecret: 'HPaZpf3lpPBIItjBhxLdF5C0',
            callbackURL: "http://127.0.0.1:3000/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOrCreate({ googleId: profile.id }, function (err, user) {
                return done(err, user);
            });
          }
    ));

    router.get('/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));

    router.get('/google/callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      function(req, res) {
          // Successful authentication, redirect home.
          res.redirect('/home');
    });
    */


    //
    return router;
}
