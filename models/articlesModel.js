const db = require("../db/connection.js")


exports.selectArticleById = (article_id) => {
    return db.query('SELECT articles.author, articles.body, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.comment_id WHERE articles.article_id = $1 GROUP BY articles.article_id;'
    , [article_id])
    .then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({ status: 404, msg: "article does not exist"})
        } else {
            return result.rows[0];
        }
    })
}
    
    
exports.selectArticle = (topic) => {
    const queryValues = []
    let queryStr = `WHERE articles.topic = $1`
    if(topic){
        queryValues.push(topic)
        return db.query(
            `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count 
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.comment_id
            ${queryStr}
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;`, [topic]
            ).then((result) => {
            return result.rows
        })
    } else {
    return db.query(
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count 
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.comment_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`, 
        ).then((result) => {
        return result.rows
    })
}
}

exports.selectCommentByArticleId = (article_id) => {
    
    return db.query(
      'SELECT * FROM articles WHERE articles.article_id = $1;', [article_id]

  ) .then(({rows}) => {
      if(rows.length === 0) {
          return Promise.reject({ status: 404, msg: 'article does not exist'})

      }
      return db.query(
          'SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC;', [article_id]
      )
  })
 
  .then((result) => {
      
      return result.rows;
      }
  )}

  exports.insertComment = ( author, body, article_id ) => {
    return db.query(
        'INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;',
        [author, body, article_id]
    )
    .then((result) => {
        return result.rows[0]
    })
  }

  exports.updateArticle = (article_id, inc_votes) => {
    return db.query(
        `UPDATE articles
        SET votes = $1
        WHERE article_id = $2
        RETURNING *;
        `,
        [article_id, inc_votes])
    .then((result) => {

       if(result.rows.length === 0){
            return Promise.reject({ status: 404, msg: 'article does not exist'})
        } else {
            return result.rows[0];
        }  
    })
  }

  exports.removeCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 
    RETURNING *;`, [comment_id])
    .then((result) => {
       if(result.rows.length === 0){
        return Promise.reject({ status: 404, msg: 'comment does not exist'})
       } else {
        return result.rows[0];
       }
            
    })
  }

