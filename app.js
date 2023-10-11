const express = require("express");
const app = express();
const {getTopics} = require("./controllers/topicsControllers.js");
const endpoints = require("./endpoints.json");
const {getArticleById, getArticles, getCommentsByArticleId, postComment} = require("./controllers/articlesController.js");


app.use(express.json());

app.get("/api/topics", getTopics)

app.get("/api", (req, res) => {
    res.status(200).send({endpoints})
})

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postComment)


// error handling middleware
app.all("/*", (req, res, next) => {
    res.status(404).send({msg: 'path not found'})
})

app.use((err, req, res, next) => {
    if(err.code === '22P02' || err.code === '23502')
    res.status(400).send({ msg: "Invalid input"})
    else if(err.code === '23503'){
        res.status(404).send({msg:'article does not exist' })
       
    }
    next(err)
})
//handle custom error
app.use((err, req, res, next) => {
    if(err.status) {
        res.status(err.status).send({ msg: err.msg })
    }
    next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'internal server error'})
})


module.exports = app;