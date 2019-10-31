const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//Connecting database
mongoose.connect("mongodb://localhost/nodedb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let db = mongoose.connection;
//check connection
db.once("open", () => {
  console.log("Connected to mongo");
});

//check db error
db.on("error", () => {
  console.log(err);
});

//Init app
const app = express();

//Bring in models
let Article = require("./models/article");

//Load View Engine (pug)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Home Route
app.get("/", (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log("Error");
    } else {
      res.render("index", {
        title: "Add Article",
        articles: articles
      });
    }
  });
});

//Get single Article
app.get("/article/:id", (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render("article", {
      article: article
    });
  });
});
//Add Route
app.get("/articles/add", (req, res) => {
  res.render("add_article", {
    title: "Add Article"
  });
});

//Body parser-middleware - parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Set Public folder
app.use(express.static(path.join(__dirname, "public")));



//Add Submit Post Route
app.post("/articles/add", (req, res) => {
  console.log("Submitted");
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(err => {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('sucess','Article Added');
      res.redirect("/");

    }
  });
});


//Load Article
app.get("/article/edit/:id",function(req, res){
  Article.findById(req.params.id,function(err, article){
    res.render("edit_article", {
        title:'Edit Article',
      article: article
    });
  });
});

//Update
app.post("/articles/edit/:id", (req, res) => {
  console.log("Updated");
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
 let query={_id:req.params.id}
  Article.updateOne(query,article,(err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect("/");
    }
  });
});
app.delete("/article/:id",(req,res)=>{
    let query= {_id:req.params.id}
    Article.remove(query,function(err){
        if(err){
            console.log(err);
        }
        res.send('Success');
    }
    )
})


//Start Server
app.listen(3000, () => {
  console.log("Server Started");
});
