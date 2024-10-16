const {fetchTopics} = require('../models/topics-models.js')
const {fetchArticlesById, fetchArticles} = require('../models/artcles-models.js')

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
    const {sort_by, order = 'desc'} = request.query;
    return fetchArticles(sort_by, order).then((articles) => {
        response.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
};

