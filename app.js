const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/collectDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

///resquesting all articles//////
app.route("/articles")
 
.get(function(req, res) {
    Article.find()
      .then(foundArticles => {
        res.send(foundArticles);
      
      })
      .catch(err => {
        console.log(err);
        res.status(500).send("Error retrieving articles");
      });
  })

  .post(function(req, res)
  {
       console.log(req.body.title);
       console.log(req.body.content);
  
       const newarticle = new Article({
            title:req.body.title,
            content:req.body.content
       });
       newarticle.save()
       .then(() => {
         res.send("Successfully added data");
       })
       .catch(err => {
         res.send(err);
       });
  })

  .delete(function(req, res)
  {
      Article.deleteMany()
       .then(() => {
         res.send("Successfully deleted data");
       })
       .catch(err => {
         res.send(err);
       });
  
  })

////new requesting particular article/////
app.route("/articles/:articletitle")
.get(function(req, res) {
    Article.findOne({ title: req.params.articletitle })
    .then(foundArticle => {
        res.send(foundArticle);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Error retrieving article");
    });
})
.put(function(req, res) {
    Article.updateOne(
        { title: req.params.articletitle },
        { title: req.body.title, content: req.body.content }
    )
    .then(() => {
        res.send("Successfully updated");
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Error updating article");
    });
})
.patch(function(req, res)
{
    Article.updateOne(
        { title: req.params.articletitle },
        {$set:req.body}
    )
    .then(() => {
        res.send("Successfully updated");
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Error updating article");
    });

})
.delete(function(req, res)
{
    Article.deleteOne({ title: req.params.articletitle})
       .then(() => {
         res.send("Successfully deleted one data");
       })
       .catch(err => {
         res.send(err);
       });

})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
