const db = require('../db/connection');

exports.fetchArticlesById = (article_id) => {
    return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
      if (result.rows.length === 0){
        return Promise.reject({status: 404, msg: "not found"})
      }
      return result.rows[0];
    })
};

exports.fetchArticles = (sort_by = 'created_at', order = 'desc') => {
    return db.query(`
   SELECT 
    articles.author,    
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
FROM 
    articles
LEFT JOIN 
    comments ON comments.article_id = articles.article_id
GROUP BY 
    articles.article_id
ORDER BY ${sort_by} ${order} ;
`)
.then((result) => {
  return result.rows;
});
};

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(`SELECT * 
        FROM 
        comments 
        WHERE comments.article_id = $1
        ORDER BY created_at DESC;`, [article_id])
    .then((result) => {  

        return result.rows;
    })
};

exports.fetchPostCommentByArticleId = (article_id, username, body) => {
    return db.query(`
        INSERT INTO comments (body, author, article_id)
        VALUES ($1, $2, $3) 
        RETURNING * ;`, [body, username, article_id])
        .then((result) => {

            return result.rows[0];
        })
};

exports.fetchAllUsers = (username) => {
    return db.query('SELECT username FROM users;')
    .then((result) => {
        const validUserNames = result.rows.map((user) => user.username);
        if (!validUserNames.includes(username)) {
            return Promise.reject({ status: 404, msg: "not found" });
        }
        return validUserNames;
    })
};

exports.fetchUpdatedArticle = (article_id, inc_votes) => {
        return db.query(`
        UPDATE articles 
        SET votes = GREATEST(votes + $1, 0)
        WHERE article_id = $2
        RETURNING *;`, [inc_votes, article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "not found" });
        }
        return result.rows[0]
    })
};

exports.removeCommentById = (comment_id) => {
    return db.query('DELETE FROM comments WHERE comment_id = $1;', [comment_id])

};