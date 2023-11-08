const request = require('supertest')
const app = require('../app.js')
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data/index.js")
const db = require('../db/connection.js')
const endpoints = require("../endpoints.json")


beforeEach(() => seed( data ));
afterAll(() => db.end());

describe("/api/topics", () => {
    test('200: respond with array of topic objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            expect(response.body.topics.length).toBe(3);
           response.body.topics.forEach((topics) => {
                expect(typeof topics.slug).toBe('string');
                expect(typeof topics.description).toBe('string');
            });
        }) 
    })
    test("GET:404 sends 404 and error message when given bad path", () => {
        return request(app)
        .get('/api/toopics')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('path not found')
        })
    })
    
})

describe("/api", () => {
    test("200: respond with all the other endpoints available", () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
            expect(response.body.endpoints).toEqual(endpoints);
        })
    })
})


describe("/api/articles/:article_id", () => {
    test("GET: 200 respond with a single article", () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            expect(response.body.article.article_id).toBe(1)
            expect(response.body.article.title).toBe("Living in the shadow of a great man");
            expect(response.body.article.topic).toBe("mitch");
            expect(response.body.article.author).toBe("butter_bridge");
            expect(response.body.article.body).toBe("I find this existence challenging");
            expect(response.body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
            expect(response.body.article.votes).toBe(100);
            expect(response.body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
            expect(response.body.article.comment_count).toBe("11")
        })
    })
    test("GET: 404 sends 404 and error message when given valid but non-existent id", () => {
        return request(app)
        .get('/api/articles/99999')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('article does not exist');
        })
    })
    test("GET: 400 sends 400 and error message when given invalid id", () => {
        return request(app)
        .get('/api/articles/not-an-id')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid input')
        })
        })
    test("PATCH: 200 responds with updated article", () => {
        const voteUpdate = {
            inc_votes: 1
        }
        return request(app)
        .patch("/api/articles/1")
        .send(voteUpdate)
        .expect(200)
        .then((response) => {
        expect(response.body.article).toMatchObject({
        article_id : 1,
        title: "Living in the shadow of a great man",
         topic: "mitch",
         author: "butter_bridge", 
         body: "I find this existence challenging", 
         created_at: "2020-07-09T20:11:00.000Z",
         votes: 1,
         article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
         });
        });
        })
    test("PATCH: 400 status for invalid inc_votes value", () => {
            const voteUpdate = { inc_votes: ""};
            return request(app)
            .patch('/api/articles/1')
            .send(voteUpdate)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Invalid input')
            })
        })
    test("PATCH: 404 status sends error message when given valid but non-existent id", () => {
        const voteUpdate = { inc_votes: 100 };
        return request(app)
        .patch('/api/articles/99999')
        .send(voteUpdate)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('article does not exist')
        })
    })
    test("PATCH: 400 status sends error message when given invalid id", () => {
        const voteUpdate = { inc_votes: 100 };
        return request(app)
        .patch('/api/articles/not-an-id')
        .send(voteUpdate)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid input')
        })
    })
})



describe("GET/api/articles", () => {
    test("GET: 200 respond with array of article objects", () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            console.log(response)
            expect(response.body.articles.length).toBe(13);  
            response.body.articles.forEach((article) => {
                
                 expect(typeof article.author).toBe('string');
                 expect(typeof article.title).toBe('string');
                 expect(typeof article.article_id).toBe('number');
                 expect(typeof article.topic).toBe('string');
                 expect(article).toHaveProperty("created_at", expect.any(String));
                 expect(typeof article.votes).toBe('number');
                 expect(typeof article.article_img_url).toBe('string');
                 expect(typeof article.comment_count).toBe('string')
            })
        })
    } )
    test("GET: 404 sends 404 and error message when given bad path", () => {
        return request(app)
        .get('/api/articlees')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('path not found')
        })
    })

    test("GET: 200 sort the articles by date in descending order", () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true});
        }) 

    })
    test("GET: 200 and returns articles by topic value", () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then((response) => {
            expect(response.body.articles.length).toBe(12)
        })
    })
    test("GET: 404 status and returns an error message when article by topic value doesn't exist", () => {
        return request(app)
        .get('/api/articles?topic=iDontExist')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('article does not exist')
        })
    })
    // test("GET: 200 status and return an empty array when no articles reference this topic", () => {
    //     return request(app)
    //     .get('/api/articles?topic=paper')
    //     .expect(200)
    //     .then((response) => {
    //         expect(response.body.articles.length).toBe(0)
    //     })
    // })
     test("GET: 200 sort the articles by date in ascending order", () => {
         return request(app)
         .get('/api/articles?order=ASC')
         .expect(200)
         .then(({ body }) => {
             expect(body.articles).toBeSortedBy('created_at', {descending: false});
         }) 

     })
     test("GET: 200 sort the articles by author", () => {
        return request(app)
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('author', {descending: true});
        }) 

    })
    test("GET: 400 sends 400 and error message when given invalid sortby query", () => {
        return request(app)
        .get('/api/articles?sort_by=height')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid input')
        })
    })
    test("GET: 400 sends 400 and error message when given invalid order query", () => {
        return request(app)
        .get('/api/articles?order=height')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid input')
        })
    })
})

describe("/api/articles/:article_id/comments", () => {
    test("GET: 200 respond with an array of comments for a single article", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
            expect(response.body.comments.length).toBe(11);
            response.body.comments.forEach((comment) => {
                expect(typeof comment.body).toBe('string');
                expect(typeof comment.votes).toBe('number');
                expect(typeof comment.author).toBe('string');
                expect(comment.article_id).toBe(1);
                expect(typeof comment.created_at).toBe('string')
            })
        })
    })
    test("GET: 200 responds with most recent comments first", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
            expect(response.body.comments).toBeSortedBy('created_at', {
                descending: true
            })
        })
    })
    test("GET: 404 sends 404 and respond with error message when given valid id but non-existent id", () => {
        return request(app)
        .get("/api/articles/1111/comments")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('article does not exist')
        })
    })
    test("GET: 400 send 400 and respond with error message when given invalid id", () => {
        return request(app)
        .get("/api/articles/not-an-id/comments")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid input')
        })
    })
    test("GET: 200 sends 200 and responds with an empty array when an article has no comments", () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((response) => {
            expect(response.body.comments.length).toBe(0)
        })
    })
    test("POST: 201 inserts a new comment for an article and responds with the new comment", () => {
        const newComment = {
            username: "butter_bridge",
            body: "A new comment"
        };
        return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then((response) => {
            expect(response.body.comment.article_id).toBe(1)
            expect(response.body.comment.author).toBe("butter_bridge");
            expect(response.body.comment.body).toBe("A new comment")
        });
    })
    test("POST: 400 status and sends an error message when given incorrect comment e.g. no username", () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            body: "A new comment"
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid input')
        })
    })
   test("POST: 404 status and sends an error message when given a valid but non existent id", () => {
        return request(app)
        .post('/api/articles/1111/comments')
        .send({
            username: "icellusedkars",
            body: "A new comment"
        })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('article does not exist')
        })
    })
    test("POST: 404 status and sends an error message when username is not found", () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            username: "Hanna",
            body: "A new comment"
        })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('username not found')
        })
    })
    test("POST: 400 status and sends an error message when article is invalid", () => {
        return request(app)
        .post('/api/articles/"id-invalid"/comments')
        .send({
            username: "icellusedkars",
            body: "A new comment"
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid input')
        })
    })
})

describe("/api/comments/:comment_id", () => {
    test("DELETE: 204 deletes specific comment and sends no body back", () => {
        return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then((response) => {
            expect(response.body)
        })
    });
    test('DELETE: 404 status and sends an error message when given a non-existent id', () => {
        return request(app)
        .delete('/api/comments/1111')
        .expect(404)
        .then((response) => { expect(response.body.msg).toBe('comment does not exist');
        });
    })
    test('DELETE: 400 status and sends an error message when given an invalid id', () => {
        return request(app)
        .delete('/api/comments/not-an-id')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid input')
        })
    })
})

describe("/api/users", () => {
    test('GET 200: respond with array of user objects', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
            expect(response.body.users.length).toBe(4);
           response.body.users.forEach((users) => {
                expect(typeof users.username).toBe('string');
                expect(typeof users.name).toBe('string');
                expect(typeof users.avatar_url).toBe('string')
            });
        }) 
    })
    test("GET:404 sends 404 and error message when given bad path", () => {
        return request(app)
        .get('/api/ussers')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('path not found')
        })
    })

})
