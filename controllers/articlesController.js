const {selectArticleById, selectArticle, selectCommentByArticleId} = require("../models/articlesModel")

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article })   
    })
    .catch((error) => {
        next(error)
    })
}

exports.getArticles = (req, res, next) => {
    selectArticle().then((articles) => {
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    selectCommentByArticleId(article_id).then((comments) => {
        res.status(200).send({ comments });
    })
    .catch((error) => {
        next(error)
    })
}


    