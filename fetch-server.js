const express = require("express");
const cors = require("cors");

let app = express();
app.set('json spaces', 3);

app.use(cors());

app.use(function(req, res, next) {
  console.log("Incoming request: " + req.url);
  next();
});

app.get("/", function(req, res) {
  res.send("Welcome to our webpage")
});

app.get("/collections/lessons", function(req, res) {
  // res.send("Service has been called correctly and it is working")
  // res.json({result: "OK"});
  let lessons = [
    {
      "id": 1001,
      "subject": "Maths",
      "location": "Room: 1",
      "price": 15.99,
      "image": "images/maths.png",
      "inventory": 5,
    },
  
    {
      "id": 1002,
      "subject": "Art",
      "location": "Room: 2",
      "price": 9.99,
      "image": "images/art.png",
      "inventory": 5,
    },
  
    {
      "id": 1003,
      "subject": "Computing",
      "location": "Room: 3",
      "price": 12.99,
      "image": "images/computing.png",
      "inventory": 5,
    },
  
    {
      "id": 1004,
      "subject": "Economics",
      "location": "Room: 4",
      "price": 13.99,
      "image": "images/economics.png",
      "inventory": 5,
    },
  
    {
      "id": 1005,
      "subject": "Geography",
      "location": "Room: 5",
      "price": 11.99,
      "image": "images/geography.png",
      "inventory": 5,
    },
  
    {
      "id": 1006,
      "subject": "History",
      "location": "Room: 6",
      "price": 8.99,
      "image": "images/history.png",
      "inventory": 5,
    },
  
    {
      "id": 1007,
      "subject": "Languages",
      "location": "Room: 7",
      "price": 10.99,
      "image": "images/languages.png",
      "inventory": 5,
    },
  
    {
      "id": 1008,
      "subject": "Photography",
      "location": "Room: 8",
      "price": 10.99,
      "image": "images/photography.png",
      "inventory": 5,
    },
  
    {
      "id": 1009,
      "subject": "Reading",
      "location": "Room: 9",
      "price": 12.99,
      "image": "images/reading.png",
      "inventory": 5,
    },
  
    {
      "id": 1010,
      "subject": "Science",
      "location": "Room: 10",
      "price": 15.99,
      "image": "images/science.png",
      "inventory": 5,
    }
  ];

  res.json(lessons);
});

app.post("/", function(req, res) {
  res.send("a POST request? Let’s create a new element");
});

app.put("/", function(req, res) {
  res.send("Ok, let’s change an element");
});

app.delete("/", function(req, res) {
  res.send("Are you sure??? Ok, let’s delete a record");
});

app.use(function(req, res) {
  res.status(404).send("Resource not found.");ß
});

app.listen(3000, function() {
  console.log("App started on port 3000");
});