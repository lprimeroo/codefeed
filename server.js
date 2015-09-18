
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var autoIncrement = require('mongoose-auto-increment');
var arr = require('./compilers');
var sandBox = require('./DockerSandbox');
var configDB = require('./config/database.js');
var Problems = require('./app/models/problems')
var Solution = require('./app/models/solution')
var User=require('./app/models/user')

// Database and Auth Initializations go here
mongoose.connect(configDB.url); 
require('./config/passport')(passport); 

// Set up our express application
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); 
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next)  {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

function random(size) {
    //returns a crypto-safe random
    return require("crypto").randomBytes(size).toString('hex');

}

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



app.post('/compile',function(req, res)  {
    var language = req.body.language;
    var code = req.body.code;
    var stdin = req.body.stdin;
   
    var folder= 'temp/' + random(10); //folder in which the temporary folder will be saved
    var path=__dirname + "/"; //current working path
    var vm_name='virtual_machine'; //name of virtual machine that we want to execute
    var timeout_value=20;//Timeout Value, In Seconds
    var result;
    var datastring;
           
    //details of this are present in DockerSandbox.js
    var sandboxType = new sandBox(timeout_value,path,folder,vm_name,arr.compilerArray[language][0],arr.compilerArray[language][1],code,arr.compilerArray[language][2],arr.compilerArray[language][3],arr.compilerArray[language][4],stdin);


    //data will contain the output of the compiled/interpreted code
    //the result maybe normal program output, list of error messages or a Timeout error
    sandboxType.run(function(data,exec_time,err) {
        datastring=data.toString(); //regardless we are converting it to a string
                        Problems.find( {}, function(err, data3){  
                if(err) {
                       throw err;
                    }
                else {
                    if(data3.length==0) {
                        console.log("fail")
                        console.log(data3.length)
                        result="incorrect!"
                    }
                    else {
                        console.log("success!")
                        console.log(datastring)
                        console.log(data3.length)
                         result=datastring;
                    }
                    
                }
            });
   
    function senddata(){
        res.send({output:result, langid: language,code:code, errors:err, time:exec_time});
        console.log("Sent!")
    }
        //console.log("Data: received: "+ data)
        setTimeout(senddata, 2000);
    });


});


app.post('/saveproblem',function(req, res)  {

    var problem_name = req.body.problem_name; 
    var problem_statement = req.body.problem_statement;
    var problem_input = req.body.problem_input;
    var problem_output = req.body.problem_output;
    
     var newProblem = new Problems();
            newProblem.problem_name=problem_name;
            newProblem.problem_statement=problem_statement;
            newProblem.problem_input=problem_input;
            newProblem.problem_output=problem_output;
            newProblem.save(function(err){
                if(err)
                    throw err;
                return newProblem;
            })
});

       
//load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, passport);

//Listening
app.listen(port);
console.log('The magic happens on port ' + port);