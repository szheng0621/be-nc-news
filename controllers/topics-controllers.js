const {fetchTopics} = require('../models/topics-models.js')

exports.getTopics = (request, response, next) => {
    return fetchTopics().then((topics) => {
        response.status(200).send({topics})
    }).catch((err) => {
        next(err)
    })
};