const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const mysql = require('mysql');

const cors = require('cors');

const fs = require('fs');
const path = require('path');

app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let rawData = fs.readFileSync(path.resolve('./assets', 'data.json'));
let operations = JSON.parse(rawData);

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "pwd",
    database: "sms_db",
});

app.post("/create", (req, res) => {
    console.log(req.body)
    const city = req.body.city;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const price = req.body.price;
    const status = req.body.status;
    const color = req.body.color;

    db.query(
        "INSERT INTO operations (city, start_date, end_date, price, status, color) VALUES (?,?,?,?,?,?)",
        [city, start_date, end_date, price, status, color],
        (err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Values Inserted");
            }
        }
    );
});

app.get("/operations", (req, res) => {
    db.query("SELECT * FROM operations", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.put("/update", (req, res) => {
    const element = req.body;
    db.query("UPDATE operations SET city = ?, start_date = ?, end_date = ?, price = ?, status = ?, color = ? WHERE id = ?",
        [element.city, element.start_date, element.end_date, element.price, element.status, element.color, element.id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM operations WHERE id = ?", id, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/insertFromFile', function(req, res) {

    var jsondata = operations;

    for(var i=0; i< jsondata.length; i++)
        db.query("INSERT INTO operations (id, city, start_date, end_date, price, status, color) VALUES (?,?,?,?,?,?,?)", [jsondata[i].id, jsondata[i].city, jsondata[i].start_date, jsondata[i].end_date, jsondata[i].price, jsondata[i].status, jsondata[i].color], function(err,result) {
        if(err) {
            res.send(err);
        }
        else {
            res.send('Success');
        }
    });
});

app.listen(3001, () => {
    console.log("running on port 3001");
});