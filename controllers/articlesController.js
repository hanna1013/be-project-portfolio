const {selectArticleById, selectCommentByArticleId} = require("../models/articlesModel")

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article })   
    })
    .catch((error) => {
        next(error)
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