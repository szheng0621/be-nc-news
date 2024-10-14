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