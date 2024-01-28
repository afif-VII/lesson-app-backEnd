const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

let app = express();
app.set('json spaces', 3);

app.use(cors());


let propertiesReader = require("properties-reader");

let propertiesPath = path.resolve(__dirname, "conf/db.properties");
let properties = propertiesReader(propertiesPath);

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

const imagesPath = path.join(__dirname, '../lesson-booking-app/images');

app.use("/images", (req, res, next) => {
  const imagePath = path.join(imagesPath, req.path);
  
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send('Image not found');
    } else {
      res.sendFile(imagePath);
    }
  });
}); 

app.use(express.json());

app.use(morgan('dev'));

app.param('collectionName', function (req, res, next, collectionName) {
  req.collection = db.collection(collectionName);
  return next();
});

app.get('/', function (req, res, next) {
  res.send('Select a collection, e.g., /collections/lessons');
});

app.get('/search', function (req, res, next) {
  let searchTerm = req.query.q; 
  let regex = new RegExp(searchTerm, 'i'); 

  req.collection.find({
    $or: [
      { subject: regex },
      { location: regex },
    ],
  }).toArray(function (err, results) {
    if (err) {
      return next(err);
    }
    res.send(results);
  });
});

app.get('/collections/:collectionName', function (req, res, next) {
  req.collection.find({}).toArray(function (err, results) {
    if (err) {
      return next(err);
    }
    res.send(results);
  });
});

app.get('/collections/:collectionName', function (req, res, next) {
  req.collection.find({}, { limit: 3, sort: [["price", -1]] }).toArray(function (err, results) {
    if (err) {
      return next(err);
    }
    res.send(results);
  });
});

app.get('/collections/:collectionName/:max/:sortAspect/:sortAscDesc', function (req, res, next) {

  var max = parseInt(req.params.max, 10); 
  let sortDirection = 1;
  if (req.params.sortAscDesc === "desc") {
    sortDirection = -1;
  }
  req.collection.find({}, {
    limit: max, sort: [[req.params.sortAspect,
      sortDirection]]
  }).toArray(function (err, results) {
    if (err) {
      return next(err);
    }
    res.send(results);
  });
});

app.get('/collections/:collectionName/:id', function (req, res, next) {
  req.collection.findOne({ _id: new ObjectId(req.params.id) }, function (err, results) {
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

app.post('/collections/:orders', function (req, res, next) {
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

app.use(function(req, res) {
  res.status(404).send("Resource not found");
});

app.use('/images', (req, res, next) => {
  res.status(404).send('Image not found');
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("App started on port: " + port);
});