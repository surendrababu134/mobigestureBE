var express = require("express");
const fs = require('fs');
var cors = require('cors')
const sqlite3 = require('sqlite3').verbose();
var app = express();
const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
  };

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

const dbpath = './data.db';
// Delete existing db
try {
    if (fs.existsSync(dbpath)) {
        //file exists
        fs.unlinkSync(dbpath)
        //file removed
    }
  } catch(err) {
    console.error(err)
}

let db = new sqlite3.Database(dbpath, createTable)

function createTable() {
    db.run('CREATE TABLE countries(name text)', insertData);
}

function insertData() {
    let countries = ['India', 'Australia', 'Japan', 'Canada', 'Germany'];
    let placeholders = countries.map((country) => '(?)').join(',');
    let sql = 'INSERT INTO countries(name) VALUES ' + placeholders;
    db.run(sql, countries, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Rows inserted ${this.changes}`);
    });
}

app.get("/listcountries", (req, res, next) => {
    let sql = "SELECT * FROM countries";
    let clist = []
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        });
    });
});




app.post("/add", (req, res, next) => {
    var data = {
        name: req.body.name
    };
    var sql ='INSERT INTO countries (name) VALUES (?)';
    var params = [data.name];
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data
        })
    });
});


