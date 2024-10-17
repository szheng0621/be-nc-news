const {fetchTopics} = require('../models/topics-models.js')
const {fetchArticlesById, fetchArticles, fetchCommentsByArticleId, fetchPostCommentByArticleId, fetchAllUsers, fetchUpdatedArticle} = require('../models/artcles-models.js')

exports.getTopics = (request, response, next) => {
    return fetchTopics().then((topics) => {
        response.status(200).send({topics})
    }).catch((err) => {
        next(err)
    })
};

exports.getArticlesById = (request, response, next) => {
    const {article_id} = request.params;
    return fetchArticlesById(article_id).then((article) => {
        response.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
};

exports.getArticles = (request, response, next) => {
    const {sort_by, order } = request.query;
    return fetchArticles(sort_by, order).then((articles) => {
        response.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
};

exports.getCommentsByArticleId = (request, response, next) => {
    const {article_id} = request.params;
    fetchArticlesById(article_id)
        .then(() => {
            return fetchCommentsByArticleId(article_id);
        })
        .then((comments) => {
    response.status(200).send({ comments });
    }).catch((err) => {
        next(err)
    });
  };

exports.postComments = (request, response, next) => {
    const {article_id} = request.params;
    const { username, body } = request.body;
    if(!body || body.length === 0) {
        return response.status(400).send({ msg: "body content is required" });
    }
    return fetchAllUsers(username)
    .then(() => {      
        return fetchArticlesById(article_id);
    })
    .then(() => {
        return fetchPostCommentByArticleId(article_id, username, body);
    })
    .then((newComment) => {
        response.status(201).send({ comment: newComment });
    })
    .catch((err) => {
        next(err);
    });
}

exports.patchArticlesById = (request, response, next) => {
    const {article_id} = request.params;
    const { inc_votes } = request.body;
    if (inc_votes === 0) {
        return response.status(204).send({})
    }
    return fetchUpdatedArticle(article_id, inc_votes).then((article) => {
        response.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}
