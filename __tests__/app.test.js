require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

const ducks = [
  {
    _id: '5ff4fb7cd89993a89cc6544f',
    body_size: 'compact',
    feet_color: 'orange',
    id: 1,
    mass_oz: 14,
    name: 'Bufflehead Duck',
    owner_id: 1,
    url_image: 'https://res.cloudinary.com/dozx3wxth/image/upload/v1623790612/bufflehead_ulksab.jpg',
  },
  {
    _id: '5ff4fb7cd89993a89cc65444',
    body_size: 'medium',
    feet_color: 'brown',
    id: 2,
    mass_oz: 20,
    name: 'Harlequin Duck',
    owner_id: 1,
    url_image: 'https://res.cloudinary.com/dozx3wxth/image/upload/v1623790612/harlequin_nojjzi.jpg',
  },
  {
    _id: '5ff4fb7cd89993a89cc65454',
    body_size: 'large',
    feet_color: 'orange',
    id: 3,
    mass_oz: 50,
    name: 'Mallard Duck',
    owner_id: 1,
    url_image: 'https://res.cloudinary.com/dozx3wxth/image/upload/v1623790611/mallard_oukwib.jpg"',
  },
  {
    _id: '5ff4fb7cd89993a89cc6545d',
    body_size: 'medium',
    feet_color: 'brown',
    id: 4,
    mass_oz: 25,
    name: 'Hooded Merganser Duck',
    owner_id: 1,
    url_image: 'https://res.cloudinary.com/dozx3wxth/image/upload/v1623790612/merg_gflumv.jpg',
  },
  {
    _id: '5ff4fb7cd89993a89cc6545e',
    body_size: 'giant',
    feet_color: 'yellow',
    id: 5,
    mass_oz: 180,
    name: 'Muscovy Duck',
    owner_id: 1,
    url_image: 'https://res.cloudinary.com/dozx3wxth/image/upload/v1623790611/muscovy_dh4avw.jpg',
  },
  {
    _id: '5ff4fb7cd89993a89cc6546a',
    body_size: 'medium',
    feet_color: 'brown',
    id: 6,
    mass_oz: 35,
    name: 'Redhead Duck',
    owner_id: 1,
    url_image: 'https://res.cloudinary.com/dozx3wxth/image/upload/v1623790612/redhead_wkjbzw.jpg',
  },
  {
    _id: '5ff4fb7cd89993a89cc6546e',
    body_size: 'compact',
    feet_color: 'yellow',
    id: 7,
    mass_oz: 15,
    name: 'Wood Duck',
    owner_id: 1,
    url_image: 'https://res.cloudinary.com/dozx3wxth/image/upload/v1623790612/wood_k9g6zv.jpg',
  },
  {
    _id: '5ff4fb7c83d793a89cc68392',
    body_size: 'medium',
    feet_color: 'brown',
    id: 8,
    mass_oz: 25,
    name: 'Mandarin Duck',
    owner_id: 1,
    url_image: 'https://res.cloudinary.com/dozx3wxth/image/upload/v1623888673/mandarin_gqo1zn.jpg',
  },
];

describe('app routes', () => {
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

    test('/GET duck/1 returns a single duck', async() => {

      const expectation = {
        _id: '5ff4fb7cd89993a89cc6544f',
        body_size: 'compact',
        feet_color: 'orange',
        id: 1,
        mass_oz: 14,
        name: 'Bufflehead Duck',
        owner_id: 1,
        url_image: 'https://res.cloudinary.com/dozx3wxth/image/upload/v1623790612/bufflehead_ulksab.jpg',
      };

      const data = await fakeRequest(app)
        .get('/ducks/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
