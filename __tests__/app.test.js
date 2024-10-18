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

describe('POST /api/articles/:article_id/comments', () => {
    test('201 - responds with the posted comment', () => {
        const postedComment = {
            username: 'butter_bridge',
            body: 'I like the article'
        }
        return request(app)
            .post('/api/articles/5/comments')
            .send(postedComment) 
            .expect(201)
            .then(({body}) => {
                expect(body.comment.author).toBe('butter_bridge')
                expect(body.comment.body).toBe('I like the article')
                })
            })
        test('GET - 400 responds with an appropriate error message when given an invalid id', () => {
            const postedComment = {
                username: 'butter_bridge',
                body: 'I like the article'
            }
                return request(app)
                  .post('/api/articles/not-an-id/comments')
                  .send(postedComment) 
                  .expect(400)
                  .then(({body}) => {
                    expect(body.msg).toBe("bad request")
                  });
              });
        test('404 - responds with comment not found by article id which does not exist in the list', () => {
            const postedComment = {
                username: 'butter_bridge',
                body: 'I like the article'
            }
                return request(app)
                .post('/api/articles/99/comments')
                .send(postedComment)
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("not found")
                })
            });
        test('404 - responds with an error when username is invalid', () => {
                const postedComment = {
                    username: 'new user',
                    body: 'I like the article'
                }
                    return request(app)
                    .post('/api/articles/1/comments')
                    .send(postedComment)
                    .expect(404)
                    .then(({body}) => {
                        expect(body.msg).toBe("not found")
                    })
                });
        test('400 - responds with an error when no body content is provided', () =>{
            const postedComment = {
                username: 'butter_bridge',
                body: ''
            };
            return request(app)
            .post('/api/articles/1/comments')
            .send(postedComment)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("body content is required")
            })
        });      
    })

describe('PATCH /api/articles/:article_id', () => {
    test('200 - responds with the updated article which has incremented vote', () => {
        const newVote = { inc_votes: 1 };
        return request(app)
            .patch('/api/articles/1')
            .send(newVote)
            .expect(200)
            .then(({body}) => {
                expect(body.article.article_id).toBe(1)
                expect(body.article.votes).toBe(101)
            }) 
    });
    test('200 - responds with the updated article which has decremented vote but set to default 0 if vote becomes lower than 0', () => {
        const newVote = { inc_votes: -10 };
        return request(app)
            .patch('/api/articles/5')
            .send(newVote)
            .expect(200)
            .then(({body}) => {
                expect(body.article.article_id).toBe(5)
                expect(body.article.votes).toBe(0)
            }) 
    });
    test('400 - responds with bad request when inc_votes is not a number', () => {
        const invalidVote = { inc_votes: 'not-a-number' };
        return request(app)
            .patch('/api/articles/1')
            .send(invalidVote)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('bad request');
            });
    });
    test('400 - responds with bad request when inc_votes is not provided and it is empty', () => {
        const invalidVote = { inc_votes: '' };
        return request(app)
            .patch('/api/articles/1')
            .send(invalidVote)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('bad request');
            });
    });
    test('404 - responds with an error when the article can not be found and vote can not be updated ', () => {
        const newVote = { inc_votes: 1 };
        return request(app)
            .patch('/api/articles/99')
            .send(newVote)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('not found');
            });
    });
    test('204 - responds with no updates in votes and empty body', () => {
        const newVote = { inc_votes: 0 };
        return request(app)
            .patch('/api/articles/9')
            .send(newVote)
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({});
            });
    });
})

describe('/api/comments/:comment_id', () =>{
    test('DELETE: 204 - deletes the specified comment and responds with empty body ', () => {
        return request(app)
            .delete('/api/comments/5')
            .expect(204)
    });
    test('DELETE:400 responds with bad request error message when given an invalid id', () => {
        return request(app)
        .delete('/api/comments/not-a-number')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request');
      });
    });
    test('DELETE:404 responds with an error message when given a non-existent id', () => {
        return request(app)
          .delete('/api/comments/999')
          .expect(404)
          .then(({body}) => {
            expect(body.msg).toBe('not found');
          });
      });
    test('DELETE:404 responds with an error message when remove a comment that has been deleted previously', () => {
        return request(app)
        .delete('/api/comments/5')
        .expect(204)
        .then(() => {
            return request(app)
            .delete('/api/comments/5')
            .expect(404)
            .then(({body}) => {
            expect(body.msg).toBe('not found');
          });
        })
        
      });
})

describe('/api/users', () => {
    test('GET - 200 responds an array of objects which contains all users data', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) =>{
            expect(body.users).toBeInstanceOf(Array);
            expect(body.users.length).toBe(4);
            body.users.forEach((user) => {
                expect(user).toHaveProperty('username');
                expect(user).toHaveProperty('name');
                expect(user).toHaveProperty('avatar_url');
            })
         })
    })
})

describe('/api/articles - featured sorts articles by any valid column in a specified order', () => {
    test('GET-200, a query sorted by title and order by acsending', () => {
        return request(app)
        .get('/api/articles?sort_by=title&order=asc')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('title',{
                ascending: true })
            });
        });
    test('GET-200, a query sorted by comment count and order by descending', () => {
        return request(app)
        .get('/api/articles?sort_by=comment_count&order=desc')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('comment_count',{descending: true, coerce: true, })
                });
            });
    test('GET-400, responds with an error for invalid column sort by query', () => {
        return request(app)
        .get('/api/articles?sort_by=invalid_column')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('bad request');
            });
        });
    test('GET-400, responds with an error for invalid order query', () => {
        return request(app)
        .get('/api/articles?sort_by=created_at&order=invalid_order')
        .expect(400)
        .then(({ body }) => {
             expect(body.msg).toBe('bad request');
                });
        });
    })

describe('/api/articles - topic query', () => {
    test('GET - 200 takes a topic query and responds with all articles which are filtered out by a specified value - cats', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBe(1);
            body.articles.forEach((article) => {
                expect(article.topic).toBe('cats');         
            })
        })
    });
    test('GET - 200 responds with all articles which are filtered out by a specified value - mitch', () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBe(12);
            body.articles.forEach((article) => {
                expect(article.topic).toBe('mitch');         
            })
        })
    });
    test('GET - 400, responds with an error when topic has empty value', () => {
        return request(app)
        .get('/api/articles?topic=')
        .expect(400)
        .then(({ body }) => {
             expect(body.msg).toBe('bad request');
        });
    }); 
    test('GET - 404, responds with an error when topic value does not exist', () => {
        return request(app)
        .get('/api/articles?topic=dogs')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('not found');
        });
    });            
});

describe('/api/articles/:article_id - comment_count', () => {
    test('200 respond with an article with the count of all the comments with the article_id', () => {
        return request(app)
        .get('/api/articles/1?comment_count')
        .expect(200)
        .then(({ body }) => {
            expect(body.article.article_id).toBe(1);
            expect(body.article.comment_count).toBe("11");   

        });
    });
    test('400 responds with an error when invalid id type provided', () => {
        return request(app)
            .get('/api/articles/not-a-number?comment_count') 
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('bad request');
            });
    });
    test('404 responds with an error when the article id does not exist', () => {
        return request(app)
            .get('/api/articles/99?comment_count')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('not found');
            });
    });
    test('200 - responds with 0 count for the valid article_id but has no associated comment count', () => {
        return request(app)
        .get('/api/articles/8?comment_count')
        .expect(200)
        .then(({ body }) => {
            expect(body.article.article_id).toBe(8);
            expect(body.article.comment_count).toBe("0");   

        });
    });
})
