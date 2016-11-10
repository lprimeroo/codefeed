module.exports = function (app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function (req, res) {
    res.render('home.ejs'); // load the home.ejs file
  })

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function (req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') })
  })

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/checkprofile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }))

  // app.post('/login', do all our passport stuff here)

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function (req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') })
  })

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/checkprofile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }))
  // app.post('/signup', do all our passport stuff here)

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)

  app.get('/add', isLoggedIn, function (req, res) {
    res.render('add.ejs', {
      user: req.user // get the user out of session and pass to template
    })
  })

  app.post('/checkSolution', isLoggedIn, function (req, res) {
    var Problem = require('../app/models/problems')
    var data = req.body.output
    var name = req.body.problem_name
    Problem.find({problem_name: name}, function (err, docs) {
      if (!err) {
        if (data == docs.problem_output) {
          res.send('../views/success.ejs') // success file
        }
        else
          res.send('../views/failure.ejs') // failure file
      }
    })
  })

  app.get('/viewproblem', isLoggedIn, function (req, res) {
    var mymodule = require('../views/viewproblem')
    var mongoose = require('mongoose')
    var Problems = require('../app/models/problems')
    var selectedid = req.body.problem_id
    console.log(selectedid)
    Problems.find({problem_id: selectedid }, function (err, docs) {if (docs) {
        res.render('../views/viewproblem.ejs', {data: docs})
      }
    })
  })

  app.get('/loggedinhome', function (req, res) {
    var mongoose = require('mongoose')
    var problems = require('../app/models/problems')
    problems.find({}, function (err, docs) {
      if (!err) {
        console.log(docs)
        res.render('../views/loggedinhome.ejs', {
          documents: docs
        })
      }
    })
  })

  app.get('/feed', function (req, res) {
    var mongoose = require('mongoose')
    var solution = require('../app/models/solution')
    solution.find().sort('-date_added').find(function (err, docs) {
      if (!err) {
        console.log(docs)
        res.render('../views/feed.ejs', {documents: docs})
      }
    })
  })

  app.get('/viewproblist', isLoggedIn, function (req, res) {
    var mongoose = require('mongoose')
    var solution = require('../app/models/solution')
    var currentuser = req.user.username
    solution.find({'username': currentuser}, function (err, docs) {
      if (!err) {
        console.log(docs)
        res.render('../views/viewproblem.ejs', {documents: docs})
      }})
  })




  app.get('/showprofile', isLoggedIn, function (req, res) {
    var mongoose = require('mongoose')
    var User = require('../app/models/user')
    var Solution = require('../app/models/solution')

    User.find({'username': req.user.username}, function (err, docs) {
      if (!err) {
        Solution.find({'username': req.user.username}, function (error, docs2) {
          if (!error) {
            res.render('../views/profile.ejs', {
              documents: docs,
              documents2: docs2
            })
          }
        })
      }
    })
  })

  app.get('/showprofile/:username', isLoggedIn, function (req, res) {
    var User = require('../app/models/user')
    var Solution = require('../app/models/solution')
    User.find({'username': req.params.username}, function (err, docs) {
      if (!err) {
        Solution.find({'username': req.params.username}, function (error, docs2) {
          if (!error) {
            res.render('../views/profile.ejs', {
              documents: docs,
              documents2: docs2
            })
          }
        })
      }
    })
  })

  app.get('/solve/:problemid', isLoggedIn, function (req, res) {
    res.render('../views/solve.ejs', {
      probid: req.params.problemid // get the user out of session and pass to template
    })
  })

  app.get('/rankings', isLoggedIn, function (req, res) {
    var mongoose = require('mongoose')
    var User = require('../app/models/user')

    User.find().sort({ solved_count: 'descending' }).exec(function (err, ranks) {
      if (!err) {
        console.log(ranks)
        res.render('../views/rankings.ejs', {
          documents: ranks
        }); }})
  })




  app.get('/checkprofile', isLoggedIn, function (req, res) {
    var mongoose = require('mongoose')
    var User = require('../app/models/user')
    console.log('Current username is: ' + req.user.username)
    if ((req.user.username == null) || (req.user.name == null)) {
      res.redirect('/updateprofile')
    }else {
      res.redirect('/feed')
    }
  })


  app.get('/updateprofile', function (req, res) {
    res.render('../views/signupprofile.ejs', {
      user: req.user // get the user out of session and pass to template
    })
    res.render('../views/signupprofile.ejs'), {
      user: req.user // get the user out of session and pass to template
    }
  })

  app.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
  })

  app.get('/settersolutions', isLoggedIn, function (req, res) {
    var mongoose = require('mongoose')
    var Solution = require('../app/models/solution')

    Solution.find({'problem_setter': req.user.username}, function (err, docs) {
      if (!err) {
        console.log(docs)
        res.render('../views/myproblems.ejs', {
          documents: docs
        })
      }
    })
  })
  // =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facsuccessRedirect : '/loggedinhome',

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email'], failureRedirect: '/login' }, function (req, res) {}))

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/checkprofile',
      failureRedirect: '/'
    }))

  // route for logging out
  app.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
  })
}
// route middlewa

// route middleware to make sure a user is logged in
function isLoggedIn (req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next()

  // if they aren't redirect them to the home page
  res.redirect('/')
}
