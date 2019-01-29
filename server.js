var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = 3000;
var app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/myScraper";
mongoose.connect(MONGODB_URI);

// Routes
app.get("/scrape", (req, res) => {

    axios.get("https://www.huffingtonpost.com/topic/dogs").then((response) => {

        var $ = cheerio.load(response.data);

        $("div.zone__content:nth-child(1)").find("div.card__content").each((i, element) => {

            var result = {};

            result.title = $(element).find("div.card__headline__text").text().split("\n")[1];
            result.link = "https://www.huffingtonpost.com/" + $(element).find("a.card__link").attr("href");
            result.image = $(element).find("div.card__image").find("img").attr("src");
            result.description = $(element).find("div.card__description").find("a").text().split("\n")[0];

            console.log(result);

            db.Article.create(result)
            .then((article) => {})
            .catch((err) => {});
        });
        res.send("Articles Scraped");
    });
});

app.get("/articles", (req, res) => {

    db.Article.find({})
    .then((article) => {res.json(article)})
    .catch((err) => {res.json(err)});
});

app.get("/articles/saved", (req, res) => {

    db.Article.find({saved: true})
    .populate("note")
    .then((article) => {res.json(article)})
    .catch((err) => {res.json(err)});
});

app.post("/articles/:id", (req, res) => {

    console.log(req.params.id);
    
    return db.Article.findOneAndUpdate({_id: req.params.id}, {saved: true}, {new: true})
    .then((article) => {
        res.json(article);
    }).catch((err) => {
        res.json(err);
    });
});

app.post("/saved/:id", (req, res) => {

    console.log(req.params.id);
    console.log(req.body);
    
    return db.Article.findOneAndUpdate({_id: req.params.id}, {saved: false}, {new: true})
    .then((article) => {
        res.json(article);
    }).catch((err) => {
        res.json(err);
    });
});

app.get("/note/:id", (req, res) => {

    console.log(req.params.id);

    db.Note.findOne({_id: req.params.id})

    //   .populate("note")
      .then((article) => {res.json(article)})
      .catch(function(err) {res.json(err);
    });
});

app.post("/note/:id", (req, res) => {

    console.log(req.body);
    console.log(req.params.id);
    
    db.Note.create(req.body)
    .then((note) => {return db.Article.findOneAndUpdate({ _id: req.params.id}, {note: note._id}, {new: true})})
    .then((article) => {res.json(article)})
    .catch((err) => {res.json(err)});
});

app.post("/note/update/:id", (req, res) => {

    console.log(req.body);
    console.log(req.params.id);
    
    db.Note.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
    .then((article) => {res.json(article)})
    .catch((err) => {res.json(err)});
});

app.post("/note/delete/:id", (req, res) => {
    
    db.Note.deleteOne({_id: req.params.id}, (err) => {
        if (err) throw err;
    })
    .then(() => {
        db.Article.findOneAndUpdate({note: req.params.id}, {$unset: {note: 1}}, (err) => {
            if (err) throw err;
        })
    })
    .then(() => {
        res.send("Note Deleted");
    });
});

app.get("/articles/clear", (req, res) => {

    db.Article.remove({}, (err) => {
        if (err) {
            console.log(err)
        }
    })
    .then(() => {
        db.Note.remove({}, (err) => {
            if (err) {
                console.log(err)
            } 
            else {
                res.send("Articles Cleared")
            }
        });
    });
});

app.get("/*", (req, res) => {res.redirect("/")});
  
app.listen(PORT, () => {console.log("App is running on port: " + PORT)});