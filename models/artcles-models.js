const db = require('../db/connection');

exports.fetchArticlesById = (article_id) => {
    return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
      if (result.rows.length === 0){
        return Promise.reject({status: 404, msg: "article not found"})
      }
      return result.rows[0];
    })
};