const db = require("../db/connection.js")


exports.selectArticleById = (article_id) => {
    return db.query('SELECT articles.author, articles.body, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.body) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;'
    , [article_id])
    .then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({ status: 404, msg: "article does not exist"})
        } else {
            return result.rows[0];
        }
    })
}
    
    
exports.selectArticle = (topic, sort_by = "created_at", order = "DESC") => {
    const queryValues = []
    const validSortBy = [
        "article_id",
        "author",
        "title",
        "topic",
        "created_at",
        "votes",
        "article_img_url",
        "comment_count"
    ]

    const validOrder = ["ASC", "DESC"]
   
   let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.body) AS comment_count 
   FROM articles
   LEFT JOIN comments ON articles.article_id = comments.article_id ` 
  if(topic){
    queryValues.push(topic)
    queryStr += `WHERE articles.topic = $1`
  }
  if(!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid input"})
   }
  if(sort_by) {
    queryStr +=
    ` GROUP BY articles.article_id
     ORDER BY ${sort_by} ${order};`
  }
  
        return db.query(queryStr,
             queryValues)
            .then((result) => {
                if(result.rows.length === 0)
                { return Promise.reject({status:404, msg: 'article does not exist'})
                }
             return result.rows
             })
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

