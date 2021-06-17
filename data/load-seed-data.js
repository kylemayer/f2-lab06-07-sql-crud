const client = require('../lib/client');
// import our seed data:
const ducks = require('./ducks.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );

    const user = users[0].rows[0];

    await Promise.all(
      ducks.map(duck => {
        return client.query(`
                    INSERT INTO ducks (name, mass_oz, body_size, feet_color, owner_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [duck.name, duck.mass_oz, duck.body_size, duck.feet_color, user.id]);
      })
    );


    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}
