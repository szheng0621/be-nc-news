const express = require("express");
const app = express();
const {getTopics, getArticlesById, getArticles} = require('./controllers/topics-controllers')
const endpoints = require('./endpoints.json');

app.get('/api', (request, response) => {    
    response.status(200).send({endpoints: endpoints})
})

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/articles', getArticles);

app.all('*', (request, response, next) => {
    response.status(404).send({msg: "path not found"})
})

app.use((err, request, response, next) => {
    if (err.code === '22P02') {
      response.status(400).send({msg: 'bad request'})
    }
    next(err)
  })

app.use((err, request, response, next) => {
    if(err.status && err.msg) {
      response.status(err.status).send({msg: err.msg})
    } else {
      next(err)
    }
  })

app.use((err, request, response, next) => {
    response.status(500).send({msg: 'Internal server Error'}) 
  })

module.exports = app;