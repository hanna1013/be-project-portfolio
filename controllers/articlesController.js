const {selectArticleById, selectArticle, selectCommentByArticleId, insertComment, updateArticle, removeCommentById} = require("../models/articlesModel")

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
    const {topic} = req.query;
    selectArticle(topic).then((articles) => {
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
        if(error.constraint === 'comments_author_fkey')
        {res.status(404).send({msg: "username not found"})}
        next(error)
        
    })
}

exports.patchArticle = (req, res, next) => {
    const {article_id} = req.params;
    const inc_votes = req.body.inc_votes;

    updateArticle(article_id, inc_votes).then(article => {
        res.status(200).send({ article })
    })
    .catch((error) => {
        next(error)
    })
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    removeCommentById(comment_id).then(() => {
        res.status(204).send();
    })
    .catch((error) => {
        next(error)
    })
};