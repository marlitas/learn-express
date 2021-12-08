//test.js
process.env.Node_ENV = 'test';

const mongoose = require('mongoose');
const app = require('../app.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
let Job = require('./models/jobs');

let job1 = {
    "title": "Node Developer",
     "description": "Must be a full-stack developer, able to implement everything in a MEAN or MERN stack paradigm (MongoDB, Express, Angular and/or React, and Node.js).",
     "email": "employeer1@gmail.com",
     "address": "651 Rr 2, Oquawka, IL, 61469",
     "company": "Knack Ltd",
     "industry": [
         "Information Technology"
     ],
     "jobType": "Permanent",
     "minEducation": "Bachelors",
     "positions": 2,
     "experience": "No Experience",
     "salary": "155000"
}
//Configure Chair
chai.use(chaiHttp);
chai.should();

describe('Job Endpoints', () => {
    beforeEach((done) => {
        Job.remove({}, (err) => {
            done();
        });
    });
    describe('GET /', () => {
        it('should Get all the jobs', (done) => {
            chai.request(app)
                .get('/book')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.length.should.be.eql(2);
                done();

                });
        });
    });
    describe('POST /', () => {
        it('should create a new job', (done) => {
            chai.request(app)
            .post('/api/v1/jobs/new')
            .send(JSON.stringify(job1))
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
    });
});