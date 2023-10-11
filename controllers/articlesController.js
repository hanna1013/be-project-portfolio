const {selectArticleById, selectArticle, selectCommentByArticleId, insertComment} = require("../models/articlesModel")

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


exports.postComment = (req, res, next) => {
    const {article_id} = req.params;
    const newComment = req.body;

    insertComment(newComment.username, newComment.body, article_id).then((comment) => {
        res.status(201).send({ comment })
    })
    .catch((error) => {
        if(error.detail.includes('users')){
            next({status:404, msg:'username does not exist'})
        }
        console.log(error)
        next(error)
        
    })

    //check if theres no username or body, respond with 400
}