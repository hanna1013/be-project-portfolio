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
            //console.log(response.body)
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
            console.log(response.body)
            expect(response.body.article.article_id).toBe(1)
            expect(response.body.article.title).toBe("Living in the shadow of a great man");
            expect(response.body.article.topic).toBe("mitch");
            expect(response.body.article.author).toBe("butter_bridge");
            expect(response.body.article.body).toBe("I find this existence challenging");
            expect(response.body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
            expect(response.body.article.votes).toBe(100);
            expect(response.body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
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
})