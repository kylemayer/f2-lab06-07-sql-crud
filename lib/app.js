const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route.
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/categories', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT    id, name
    FROM      categories
    `);

    res.json(data.rows);
  } catch(e) {

    res.status(500).json({ error: e.message });
  }
});

app.get('/ducks', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT 	d.id, d.name, d.feet_color, d.mass_oz, c.name as category_id, d.owner_id
    FROM    ducks as d
    JOIN 	  categories as c
    ON 	 	  d.category_id = c.id
  `);

    res.json(data.rows);
  } catch(e) {

    res.status(500).json({ error: e.message });
  }
});

app.get('/ducks/:id', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT 	d.id, d.name, d.feet_color, d.mass_oz, c.name as category_id, d.owner_id
    FROM    ducks as d
    JOIN 	  categories as c
    ON 	 	  d.category_id = c.id
    WHERE   d.id = $1;
  `, [req.params.id]);

    res.json(data.rows[0]);
  } catch(e) {

    res.status(500).json({ error: e.message });
  }
});

app.post('/ducks', async(req, res) => {
  try {
    const data = await client.query(`
    INSERT INTO ducks (name, mass_oz, category_id, feet_color, owner_id)
    VALUES ($1, $2, $3, $4, 1)
    RETURNING *`, [req.body.name, req.body.mass_oz, req.body.category_id, req.body.feet_color]);

    res.json(data.rows[0]);
  } catch(e) {

    res.status(500).json({ error: e.message });
  }
});

app.put('/ducks/:id', async(req, res) => {
  try {
    const data = await client.query(`
    UPDATE ducks
    SET
      name=$1,
      mass_oz=$2,
      category_id=$3,
      feet_color=$4
    WHERE id=$5
    RETURNING *
    `, [req.body.name, req.body.mass_oz, req.body.category_id, req.body.feet_color, req.params.id]);

    res.json(data.rows[0]);
  } catch(e) {

    res.status(500).json({ error: e.message });
  }
});

app.delete('/ducks/:id', async(req, res) => {
  try {
    // the SQL query is DELETE
    const data = await client.query('DELETE FROM ducks WHERE id=$1', [req.params.id]);

    res.json(data.rows[0]);
  } catch(e) {

    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
