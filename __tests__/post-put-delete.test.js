require('dotenv').config();
const { execSync } = require('child_process');
const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const { getCategoryIdByName } = require('../lib/utils.js');

describe('post, put and delete routes', () => {
  describe('routes', () => {
    let token;
    let categories;

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

      const categoryData = await fakeRequest(app).get('/categories');
      categories = categoryData.body;
      return done();
    });

    afterAll(done => {
      return client.end(done);
    });

    test('/POST ducks creates a single duck', async() => {
      const categoryId = getCategoryIdByName(categories, 'compact');
      const data = await fakeRequest(app)
        .post('/ducks')
        .send({
          name: 'new duck',
          mass_oz: 15,
          category_id: categoryId,
          feet_color: 'orange'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const dataDucks = await fakeRequest(app)
        .get('/ducks')
        .expect('Content-Type', /json/)
        .expect(200);

      const newDuck = {
        name: 'new duck',
        mass_oz: 15,
        id: 9,
        feet_color: 'orange',
        category_id: 'new duck',
        owner_id: 1
      };

      const postedNewDuck = {
        name: 'new duck',
        mass_oz: 15,
        id: 9,
        feet_color: 'orange',
        category_id: categoryId,
        owner_id: 1
      };

      expect(data.body).toEqual(postedNewDuck);
      const matchingDuck = dataDucks.body.find(duck =>{
        return duck.feet_color === 'orange';
      });
      expect(matchingDuck).toEqual(newDuck);
    });

    test('/PUT ducks updates a single duck', async() => {
      const categoryId = getCategoryIdByName(categories, 'compact');
      const data = await fakeRequest(app)
        .put('/ducks/5')
        .send({
          name: 'updated duck',
          mass_oz: 5,
          category_id: categoryId,
          feet_color: 'yellow'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const dataDucks = await fakeRequest(app)
        .get('/ducks')
        .expect('Content-Type', /json/)
        .expect(200);

      const newDuck = {
        name: 'updated duck',
        mass_oz: 5,
        id: 5,
        feet_color: 'yellow',
        category_id: 'updated duck',
        owner_id: 1
      };

      const putNewDuck = {
        name: 'updated duck',
        mass_oz: 5,
        id: 5,
        feet_color: 'yellow',
        category_id: categoryId,
        owner_id: 1
      };

      expect(data.body).toEqual(putNewDuck);
      const matchingDuck = dataDucks.body.find(duck =>{
        return duck.feet_color === 'yellow';
      });
      expect(matchingDuck).toEqual(newDuck);
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
        name: 'updated Duck',
        mass_oz: 5,
        id: 6,
        feet_color: 'yellow',
        category_id: 2,
        owner_id: 1
      };

      expect(dataDucks.body).not.toContainEqual(newDuck);
    });
  });
});
