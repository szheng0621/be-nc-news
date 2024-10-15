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
            expect(body.msg).toBe("article not found")
        })
    });

})