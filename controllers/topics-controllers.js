const {fetchTopics} = require('../models/topics-models.js')
const {fetchArticlesById, fetchArticles, fetchCommentsByArticleId, fetchPostCommentByArticleId, fetchAllUsers, fetchUpdatedArticle, removeCommentById, fetchUsers} = require('../models/artcles-models.js')

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
    const {sort_by, order, topic} = request.query;
    fetchTopics().then((topics) => {
        const validTopics = topics.map(topic => topic.slug);
            if (topic && !validTopics.includes(topic)) {
                return Promise.reject({ status: 404, msg: "not found" });
            }
        return fetchArticles(sort_by, order, topic);
    })
    .then((articles) => {
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
};

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
    });
};

exports.deleteCommentById = (request, response, next) => {
    const { comment_id } = request.params;
    removeCommentById(comment_id)
    .then((result) => {
        if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
        }
        response.status(204).send();
    }).catch((err) => {
        next(err)
    });
};

exports.getUsers = (request, response, next) => {
    return fetchUsers().then((users) => {
        response.status(200).send({users})
    }).catch((err) => {
        next(err)
    })
}