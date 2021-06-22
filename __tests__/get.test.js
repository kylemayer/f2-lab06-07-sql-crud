require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const ducks = require('../data/ducks.js');

describe('get routes', () => {
  describe('routes', () => {
    let token;

    beforeAll(async done => {
      execSync('npm run setup-db');

      client.connect();

      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });

      token = signInData.body.token; // eslint-disable-line

      return done();
    });

    afterAll(done => {
      return client.end(done);
    });

    test('/GET ducks returns all the ducks', async() => {

      const expectation = ducks;

      const data = await fakeRequest(app)
        .get('/ducks')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('/GET ducks/1 returns a single duck', async() => {

      const expectation = {
        category: 'compact',
        feet_color: 'orange',
        id: 1,
        mass_oz: 14,
        name: 'Bufflehead Duck',
        owner_id: 1,
      };

      const data = await fakeRequest(app)
        .get('/ducks/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('/GET categories returns all duck categories', async() => {

      const data = await fakeRequest(app)
        .get('/categories')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body.length).toBeGreaterThan(0);
    });

  });
});
