const express = require("express");
const app = express()
const {getTopics} = require("./controllers/topicsControllers.js")
const endpoints = require("./endpoints.json")
const {getArticleById, getArticles} = require("./controllers/articlesController.js")



app.get("/api/topics", getTopics)

app.get("/api", (req, res) => {
    res.status(200).send({endpoints})
})

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

// error handling middleware
app.all("/*", (req, res, next) => {
    res.status(404).send({msg: 'path not found'})
})

app.use((err, req, res, next) => {
    if(err.code === '22P02')
    res.status(400).send({ msg: "Invalid input"})
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