const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;

//notice that both get and listen are methods of express

// This deprecated block just serves text
/*
app.get("/", (req, res) => {
  res.send("Master is calling......");
});
*/

// Note the 2nd argument in the mongo-client connection method - gets rid of the deprecation warning
//Unified topology gets rid of deprecation warnings.  That's what it does.

// this version uses promises!!!!
// db is set up here - and we name the db here.  In this case  -star wars quotes!!!
// Note - we can put all the handlers inside the Mongo connect method - and it works!!!!!
MongoClient.connect(
  "mongodb+srv://hyperkarma:mibapab23@cluster0.yiebf.mongodb.net/star-wars?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
)
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("star-wars-quotes");
    // db ie database is like a room
    const quotesCollection = db.collection("quotes");
    // a collection is like a box in that room!!!!!

    //this block serves html
    //send file method sends it!!!!!
    //the get/post/put patch methods on app are known as 'Handlers'

    // ====================>
    // this middleware tells us we're using a templating engine
    // it has to come before the other handlers and middleware!!!
    app.set("view engine", "ejs");

    // the middleware has to be before the handlers
    // the handlers correspond to the HTML methods
    // bodyparser gives us the capability to get info from forms
    app.use(bodyParser.urlencoded({ extended: true }));

    // ========== deprecated ===========>
    /*
    app.get("/", (req, res) => {
      res.sendFile(__dirname + "/index.html");
      // Note: __dirname is the current directory you're in. Try logging it and see what you get!
    });
    */
    // ===============================>

    //find method is used to get quotes from database
    //toArray turns the find method into an array
    //res.render - renders from a template engine!!!
    app.get("/", (req, res) => {
      db.collection("quotes")
        .find()
        .toArray()
        .then((results) => {
          res.render("index.ejs", { quotes: results });
        })
        .catch(/* ... */);
    });

    // app.post corresponds to the form action in the HTML
    //insertOne is a mongo-method that adds a record to the collection!!!!
    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          // res-redirect redirects to server if successful!!!
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    app.listen(3000, function () {
      console.log("the portal is open on 3000");
    });
  })
  .catch((error) => console.error(error));

// the depricated version uses callbacks!!!
/*
  MongoClient.connect(
  "mongodb+srv://hyperkarma:mibapab23@cluster0.yiebf.mongodb.net/star-wars?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
    console.log("Connected to Database");
  }
);
*/
