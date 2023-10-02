const express = require("express");
const app = express()
const {getTopics} = require("./controllers/topicsControllers.js")


app.get("/api/topics", getTopics)



// error handling middleware
app.all("/*", (req, res, next) => {
    res.status(404).send({msg: 'path not found'})
})


app.use((err, req, res, next) => {
    res.status(500).send({msg: 'internal server error'})
})


module.exports = app;