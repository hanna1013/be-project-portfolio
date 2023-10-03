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
            console.log(response.body)
            expect(response.body.endpoints).toEqual(endpoints);
        })
    })
})


