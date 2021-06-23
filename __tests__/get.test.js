require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');


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

      const expectation = [
        {
          id: 7,
          name: 'Wood Duck',
          feet_color: 'yellow',
          mass_oz: 15,
          category_id: 'Wood Duck',
          owner_id: 1
        },
        {
          id: 1,
          name: 'Bufflehead Duck',
          feet_color: 'orange',
          mass_oz: 14,
          category_id: 'Bufflehead Duck',
          owner_id: 1
        },
        {
          id: 8,
          name: 'Mandarin Duck',
          feet_color: 'brown',
          mass_oz: 25,
          category_id: 'Mandarin Duck',
          owner_id: 1
        },
        {
          id: 6,
          name: 'Redhead Duck',
          feet_color: 'brown',
          mass_oz: 35,
          category_id: 'Redhead Duck',
          owner_id: 1
        },
        {
          id: 4,
          name: 'Hooded Merganser Duck',
          feet_color: 'brown',
          mass_oz: 25,
          category_id: 'Hooded Merganser Duck',
          owner_id: 1
        },
        {
          id: 2,
          name: 'Harlequin Duck',
          feet_color: 'brown',
          mass_oz: 20,
          category_id: 'Harlequin Duck',
          owner_id: 1
        },
        {
          id: 3,
          name: 'Mallard Duck',
          feet_color: 'orange',
          mass_oz: 50,
          category_id: 'Mallard Duck',
          owner_id: 1
        },
        {
          id: 5,
          name: 'Muscovy Duck',
          feet_color: 'yellow',
          mass_oz: 180,
          category_id: 'Muscovy Duck',
          owner_id: 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/ducks')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('/GET ducks/1 returns a single duck', async() => {

      const expectation = {
        category_id: 'Bufflehead Duck',
        feet_color: 'orange',
        id: 1,
        mass_oz: 14,
        name: 'Bufflehead Duck',
        owner_id: 1
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
