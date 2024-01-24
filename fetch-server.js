const express = require("express");
const cors = require("cors");
const path = require("path");

let app = express();
app.set('json spaces', 3);

app.use(cors());


let propertiesReader = require("properties-reader");

let propertiesPath = path.resolve(__dirname, "conf/db.properties");
let properties = propertiesReader(propertiesPath);

console.log("db.prefix:", properties.get("db.prefix"));
console.log("db.user:", properties.get("db.user"));
console.log("db.pwd:", properties.get("db.pwd"));
console.log("dbName:", properties.get("db.dbName"));
console.log("db.dbUrl:", properties.get("db.dbUrl"));
console.log("db.params:", properties.get("db.params"));

let dbPprefix = properties.get("db.prefix");
let dbUsername = encodeURIComponent(properties.get("db.user"));
let dbPwd = encodeURIComponent(properties.get("db.pwd"));
let dbName = properties.get("db.dbName");
let dbUrl = properties.get("db.dbUrl");
let dbParams = properties.get("db.params");

const uri = `${dbPprefix}${dbUsername}:${dbPwd}${dbUrl}/${dbName}${dbParams}`;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
let db = client.db(dbName);

// middleware
app.use(express.json());

app.param('collectionName', function (req, res, next, collectionName) {
  req.collection = db.collection(collectionName);
  return next();
});

app.get('/', function (req, res, next) {
  res.send('Select a collection, e.g., /collection/lessons')
});

app.get('/collections/:collectionName', function (req, res, next) {
  req.collection.find({}).toArray(function (err, results) {
    if (err) {
      return next(err);
    }
    res.send(results);
  });
});

app.post('/collections/:collectionName', function (req, res, next) {
  req.collection.insertOne(req.body, function (err, results) {
    if (err) {
      return next(err);
    }
    res.send(results);
  });
});

app.delete('/collections/:collectionName/:id', function (req, res, next) {
  req.collection.deleteOne(
    { _id: new ObjectId(req.params.id) }, function (err, result) {
      if (err) {
        return next(err);
      } else {
        res.send((result.deletedCount === 1) ? { msg: "success" } : { msg: "error" });
      }
    }
  );
});

app.put('/collections/:collectionName/:id', function (req, res, next) {
  req.collection.updateOne({ _id: new ObjectId(req.params.id) },
    { $set: req.body },
    { safe: true, multi: false }, function (err, result) {
      if (err) {
        return next(err);
      } else {
        res.send((result.matchedCount === 1) ? { msg: "success" } : { msg: "error" });
      }
    }
  );
});



// app.use(function(req, res, next) {
//   console.log("Incoming request: " + req.url);
//   next();
// });

// app.get("/", function(req, res) {
//   res.send("Welcome to our webpage")
// });

// app.get("/collections/lessons", function(req, res) {
//   // res.send("Service has been called correctly and it is working")
//   // res.json({result: "OK"});
//   let lessons = [
//     {
//       "id": 1001,
//       "subject": "Maths",
//       "location": "Room: 1",
//       "price": 15.99,
//       "image": "images/maths.png",
//       "inventory": 5,
//     },
  
//     {
//       "id": 1002,
//       "subject": "Art",
//       "location": "Room: 2",
//       "price": 9.99,
//       "image": "images/art.png",
//       "inventory": 5,
//     },
  
//     {
//       "id": 1003,
//       "subject": "Computing",
//       "location": "Room: 3",
//       "price": 12.99,
//       "image": "images/computing.png",
//       "inventory": 5,
//     },
  
//     {
//       "id": 1004,
//       "subject": "Economics",
//       "location": "Room: 4",
//       "price": 13.99,
//       "image": "images/economics.png",
//       "inventory": 5,
//     },
  
//     {
//       "id": 1005,
//       "subject": "Geography",
//       "location": "Room: 5",
//       "price": 11.99,
//       "image": "images/geography.png",
//       "inventory": 5,
//     },
  
//     {
//       "id": 1006,
//       "subject": "History",
//       "location": "Room: 6",
//       "price": 8.99,
//       "image": "images/history.png",
//       "inventory": 5,
//     },
  
//     {
//       "id": 1007,
//       "subject": "Languages",
//       "location": "Room: 7",
//       "price": 10.99,
//       "image": "images/languages.png",
//       "inventory": 5,
//     },
  
//     {
//       "id": 1008,
//       "subject": "Photography",
//       "location": "Room: 8",
//       "price": 10.99,
//       "image": "images/photography.png",
//       "inventory": 5,
//     },
  
//     {
//       "id": 1009,
//       "subject": "Reading",
//       "location": "Room: 9",
//       "price": 12.99,
//       "image": "images/reading.png",
//       "inventory": 5,
//     },
  
//     {
//       "id": 1010,
//       "subject": "Science",
//       "location": "Room: 10",
//       "price": 15.99,
//       "image": "images/science.png",
//       "inventory": 5,
//     }
//   ];

//   res.json(lessons);
// });

// app.post("/", function(req, res) {
//   res.send("a POST request? Let’s create a new element");
// });

// app.put("/", function(req, res) {
//   res.send("Ok, let’s change an element");
// });

// app.delete("/", function(req, res) {
//   res.send("Are you sure??? Ok, let’s delete a record");
// });

// app.use(function(req, res) {
//   res.status(404).send("Resource not found.");ß
// });

app.listen(3000, function() {
  console.log("App started on port 3000");
});