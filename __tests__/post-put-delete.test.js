require('dotenv').config();
const { execSync } = require('child_process');
const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('post, put and delete routes', () => {
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

    test('/POST ducks creates a single duck', async() => {

      const data = await fakeRequest(app)
        .post('/ducks')
        .send({
          name: 'new duck',
          mass_oz: 15,
          body_size: 'compact',
          feet_color: 'orange',
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const dataDucks = await fakeRequest(app)
        .get('/ducks')
        .expect('Content-Type', /json/)
        .expect(200);

      const newDuck = {
        'name': 'new Duck',
        'mass_oz': 15,
        'id': 6,
        'feet_color': 'orange',
        'body_size': 'compact',
        'owner_id': 1,
      };

      expect(data.body).toEqual(newDuck);
      expect(dataDucks.body).toContainEqual(newDuck);
    });

    test('/PUT ducks updates a single duck', async() => {

      const data = await fakeRequest(app)
        .put('/ducks/5')
        .send({
          name: 'updated duck',
          mass_oz: 5,
          body_size: 'compact',
          feet_color: 'yellow',
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const dataDucks = await fakeRequest(app)
        .get('/ducks')
        .expect('Content-Type', /json/)
        .expect(200);

      const newDuck = {
        'name': 'updated Duck',
        'mass_oz': 5,
        'id': 6,
        'feet_color': 'yellow',
        'body_size': 'compact',
        'owner_id': 1,
      };

      expect(data.body).toEqual(newDuck);
      expect(dataDucks.body).toContainEqual(newDuck);
    });

    test('/DELETE ducks deletes a single duck', async() => {

      await fakeRequest(app)
        .delete('/ducks/6')
        .expect('Content-Type', /json/)
        .expect(200);

      const dataDucks = await fakeRequest(app)
        .get('/ducks')
        .expect('Content-Type', /json/)
        .expect(200);

      const newDuck = {
        'name': 'updated Duck',
        'mass_oz': 5,
        'id': 6,
        'feet_color': 'yellow',
        'body_size': 'compact',
        'owner_id': 1,
      };

      expect(dataDucks.body).not.toContainEqual(newDuck);
    });
  });
});
