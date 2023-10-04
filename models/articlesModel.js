const db = require("../db/connection.js")

exports.selectArticleById = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({ status: 404, msg: "article does not exist"})
        } else {
            return result.rows[0];
        }
    })
}

exports.selectCommentByArticleId = (article_id) => {
    return db.query(
        'SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC;', [article_id]
    )
    .then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({ status: 404, msg: "article does not exist"})
        } else {
        return result.rows;
        }
    })
}