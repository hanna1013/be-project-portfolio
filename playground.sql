\c nc_news_test

SELECT * FROM articles;

 SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count 
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.comment_id
        GROUP BY articles.article_id;

        SELECT * FROM topics;