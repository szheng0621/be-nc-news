const app = require ('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');
const endpoints = require('../endpoints.json');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api', () => {
    test('GET: 200 - responds with an object detailing all available endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            
            expect(body.endpoints).toEqual(endpoints)
        })
    })
})

describe('/api/topics', () => {
    test('GET 200 - Responds with an array of objects which has two properties slug and decscription', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body.topics.length).toBe(3);
            body.topics.forEach((topic) => {
              expect(typeof topic.slug).toBe('string');
              expect(typeof topic.description).toBe('string');
            });
          });
    })
})

describe('*', () => {
    test('ALL - 404 responds with an arror message when a request is made to a path which does not exist ', () => {
        return request(app)
        .get('/api/topicals')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("path not found")
        })
    })
})

describe('/api/articles/:article_id', () => {
    test('GET-200 responds with an article object',() => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body.article.article_id).toBe(1);
            expect(body.article.author).toEqual(expect.any(String));
            expect(body.article.title).toEqual(expect.any(String));
            expect(body.article.body).toEqual(expect.any(String));
            expect(body.article.topic).toEqual(expect.any(String));
            expect(body.article.created_at).toEqual(expect.any(String));
            expect(body.article.votes).toEqual(expect.any(Number));
            expect(body.article.article_img_url).toEqual(expect.any(String));
        })
    });

    test('400 - responds with bad request ', () => {
        return request(app)
        .get('/api/articles/not_a_number')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("bad request")
        })
    });

    test('404 - responds with article not found ', () => {
        return request(app)
        .get('/api/articles/88')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("not found")
        })
    });

})

describe('/api/articles', () => {
    test('GET - 200 responds an articles array of article objects', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) =>{
            expect(body.articles).toBeInstanceOf(Array);
            expect(body.articles.length).toBe(13);
            body.articles.forEach((article) => {
                expect(article).toHaveProperty('author');
                expect(article).toHaveProperty('title');
                expect(article).toHaveProperty('article_id');
                expect(article).toHaveProperty('topic');
                expect(article).toHaveProperty('created_at');
                expect(article).toHaveProperty('votes');
                expect(article).toHaveProperty('article_img_url');
                expect(article).toHaveProperty('comment_count');
            });
        });
    });

    test('GET- 200 articles are ordered by sorted by date in descending order', () =>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('created_at', {
                descending: true});
        });
    })

    test('GET 404 responds with an arror message when a request is made to the path which does not exist ', () => {
        return request(app)
        .get('/api/artcles')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("path not found")
        })
    })
})

describe('/api/articles/:article_id/comments', () => {
    test('GET - 200 responds an array ofcomments for the given article_id', () =>{
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) =>{
            expect(body.comments).toBeInstanceOf(Array);
            expect(body.comments.length).toBe(11);
            body.comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id');
                expect(comment).toHaveProperty('votes');
                expect(comment).toHaveProperty('created_at');
                expect(comment).toHaveProperty('author');
                expect(comment).toHaveProperty('body');
                expect(comment.article_id).toBe(1);
            });
        });
    });
    test('GET- 200 comments are served with the most recent comments first', () =>{
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toBeSortedBy('created_at', {
                descending: true});
        });
    });
    test('GET - 400 responds with an appropriate error message when given an invalid id', () => {
        return request(app)
          .get('/api/articles/not-an-id/comments')
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe("bad request")
          });
      });
    test('404 - responds with comment not found by searching article id which does not exist in the list', () => {
        return request(app)
        .get('/api/articles/99/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("not found")
        })
    });
    test('200 - responds with empty array for the given article_id that is present but has no associated comments', () => {
        return request(app)
        .get('/api/articles/11/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toBeInstanceOf(Array);
            expect(body.comments).toHaveLength(0);
        })
    })


})
