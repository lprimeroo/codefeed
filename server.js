var express = require('express')
var app = express()
var port = process.env.PORT || 8080
var mongoose = require('mongoose')
var path = require('path')
var passport = require('passport')
var flash = require('connect-flash')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var autoIncrement = require('mongoose-auto-increment')
var arr = require('./compilers')
var sandBox = require('./DockerSandbox')
var configDB = require('./config/database.js')
var Users = require('./app/models/user')
var Problems = require('./app/models/problems')
var Solution = require('./app/models/solution')
var User = require('./app/models/user')
var routes = require('./app/routes.js')
// Database and Auth Initializations go here
mongoose.connect(configDB.url)
require('./config/passport')(passport)

function isLoggedIn (req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    console.log(req.user.username)
  return next()

  // if they aren't redirect them to the home page
  res.redirect('/')
}
// Set up our express application
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()) // get information from html forms

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  next()
})

// Problems.find({}).remove().exec()
// Solution.find({}).remove().exec()
// User.find({}).remove().exec()

/*var problems = new Problems()
problems.save(function (err) {
    // book._id === 100 -> true
    problems.nextCount(function(err, count) {
        // count === 101 -> true
        problems.resetCount(function(err, nextCount) {
            // nextCount === 100 -> true
        })
    })
});*/

function random (size) {
  // returns a crypto-safe random
  return require('crypto').randomBytes(size).toString('hex')
}

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })) // session secret
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.post('/submit', isLoggedIn, function (req, res) {
  var language = req.body.language
  var code = req.body.code
  var probid = req.body.problemid
  var stdin
  Problems.findOne({ 'problemid': probid }, function (err, problem) {
    console.log(problem)
    stdin = problem.problem_input
    console.log('This is stdin' + stdin)

    console.log('inside compile..' + req.user.username)
    var currentuser = req.user.username
    // currentuser.toString()
    console.log('the currentuser is' + currentuser)


    var folder = 'temp/' + random(10) // folder in which the temporary folder will be saved
    var path = __dirname + '/' // current working path
    var vm_name = 'virtual_machine' // name of virtual machine that we want to execute
    var timeout_value = 20; // Timeout Value, In Seconds
    var result
    var statement

    // details of this are present in DockerSandbox.js
    var sandboxType = new sandBox(timeout_value, path, folder, vm_name, arr.compilerArray[language][0], arr.compilerArray[language][1], code, arr.compilerArray[language][2], arr.compilerArray[language][3], arr.compilerArray[language][4], stdin, probid, currentuser)
    // data will contain the output of the compiled/interpreted code
    // the result maybe normal program output, list of error messages or a Timeout error

    sandboxType.run(function (data, exec_time, err) {
      Problems.findOne({ 'problem_output': data, 'problemid': probid }, function (err, problem) {
        if (err) result = err

        console.log(problem)
        // object of the user
        if (problem != null) {
          result = 'success!'
          User.findOneAndUpdate({ 'username': currentuser }, { $inc: { 'solved_count': 1 }}, function (err, found) {
            console.log(found)
          })

          statement = problem.problem_name
          result = 'success!'
          var newSolution = new Solution()
          newSolution.problem_id = probid
          newSolution.code = code
          newSolution.username = currentuser
          newSolution.time = exec_time
          newSolution.soloutput = data
          newSolution._statement = statement
          newSolution.problem_setter = problem.problem_setter
          statement = ''
          newSolution.save(function (err) {
            if (err)
              throw err
          })
        }else {
          result = 'failed'
        }
      })
      function senddata () {
        res.send({output: result, langid: language,code: code, errors: err, time: exec_time})
        console.log('Sent!')
      }
      setTimeout(senddata, 1000)

      // console.log("Data: received: "+ data)

    })
  })
})

app.post('/compile', isLoggedIn, function (req, res) {
  var language = req.body.language
  var code = req.body.code
  var stdin = req.body.stdin
  var probid = req.body.problemid
  console.log('inside compile..' + req.user.username)
  var currentuser = req.user.username
  // currentuser.toString()
  // console.log("the currentuser is"+ currentuser)


  var folder = 'temp/' + random(10) // folder in which the temporary folder will be saved
  var path = __dirname + '/' // current working path
  var vm_name = 'virtual_machine' // name of virtual machine that we want to execute
  var timeout_value = 20; // Timeout Value, In Seconds
  var result
  var statement

  // details of this are present in DockerSandbox.js
  var sandboxType = new sandBox(timeout_value, path, folder, vm_name, arr.compilerArray[language][0], arr.compilerArray[language][1], code, arr.compilerArray[language][2], arr.compilerArray[language][3], arr.compilerArray[language][4], stdin, probid, currentuser)

  // data will contain the output of the compiled/interpreted code
  // the result maybe normal program output, list of error messages or a Timeout error
  sandboxType.run(function (data, exec_time, err) {
    Problems.findOne({ 'problem_output': data, 'problemid': probid }, function (err, problem) {
      if (err) result = err

      console.log(problem)
      // object of the user
      if (problem != null) {
        result = 'success!'
      }else {
        result = 'failed'
      }
    })
    function senddata () {
      res.send({output: result, langid: language,code: code, errors: err, time: exec_time})
      console.log('Sent!')
    }
    setTimeout(senddata, 1000)

    // console.log("Data: received: "+ data)

  })
})

app.post('/saveproblem', isLoggedIn, function (req, res) {
  var problem_name = req.body.problem_name
  var problem_statement = req.body.problem_statement
  var problem_input = req.body.problem_input
  var problem_output = req.body.problem_output

  var newProblem = new Problems()
  newProblem.problem_name = problem_name
  newProblem.problem_statement = problem_statement
  newProblem.problem_input = problem_input
  newProblem.problem_output = problem_output
  newProblem.problem_setter = req.user.username
  newProblem.save(function (err) {
    if (err)
      throw err
    return newProblem
  })
})

app.post('/saveprofile', isLoggedIn, function (req, res) {
  var username = req.body.user_username
  var uname = req.body.user_name
  console.log('received in json:' + username)
  console.log('current fb email is:' + req.user.facebook.email)
  console.log('current local email is:' + req.user.local.email)

  if (req.user.local.email == null) {
    User.findOne({'facebook.email': req.user.facebook.email}, function (err, user) {
      console.log('Match found with email' + req.user.facebook.email)
      user.name = uname
      user.username = username
      user.save()
    })
  }else {
    User.findOne({'local.email': req.user.local.email}, function (err, user) {
      console.log('Match found with email ' + req.user.local.email)
      user.name = uname
      user.username = username
      user.save()
    })
  }
})

// load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, passport)

// Listening
app.listen(port)
console.log('The magic happens on port ' + port)
