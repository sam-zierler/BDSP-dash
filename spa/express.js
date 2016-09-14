var express = require('express'),
    app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var runs = require('./Model/runs.js');
var assignments = require('./Model/assignments.js');
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
.get("/runs/change/:id", function(req, res) {
    runs.change(req.params.id, function(err, status) {
        res.send(status);
    })
})
.get("/employees", function(req,res) {
    employees.get(function(err,rows){
        res.send(rows);
    })
})
.get("/assignments", function(req,res) {
    assignments.get(null, function(err,rows){
        res.send(rows);
    })
})
.get("/assignments/:run_id", function(req,res) {
   assignments.get(req.params.run_id, function(err, rows){
    res.send(rows);
  })
})
.post("/assignments", function(req, res) {
    assignments.save(req.body, function(err, row) {
        res.send(row);
    })
})
.post("/assignments/delete", function(req, res) {
    assignments.delete(req.body, function(err, row){
        res.send(row);
    });
})
app.listen(process.env.PORT);