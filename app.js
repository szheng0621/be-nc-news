const express = require("express");
const app = express();
const {getTopics, getArticlesById, getArticles, getCommentsByArticleId, postComments, patchArticlesById, deleteCommentById, getUsers} = require('./controllers/topics-controllers')
const endpoints = require('./endpoints.json');
const cors = require('cors');

app.use(express.json());

app.use(cors());

app.get('/api', (request, response) => {    
    response.status(200).send({endpoints: endpoints})
})

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postComments);

app.patch('/api/articles/:article_id', patchArticlesById);

app.delete('/api/comments/:comment_id', deleteCommentById);

app.get('/api/users', getUsers);

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