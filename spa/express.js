var express = require('express'),
    app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var runs = require('./Model/runs.js');
var employees = require('./Model/employees.js');

console.log(__dirname + '/public');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'Ralph The Turtle', 
    resave: true,
    saveUninitialized: true,
}));
app.get("/runs", function(req,res) {
    runs.get(function(err,rows) {
        res.send(rows);
    })
})
.post("/runs", function(req, res) {
    runs.post(req.start,req.end,function(err,rows) {
        res.send(rows);
    })
})
.get("/employees", function(req,res) {
    employees.get(function(err,rows){
        res.send(rows);
    })
})
app.listen(process.env.PORT);