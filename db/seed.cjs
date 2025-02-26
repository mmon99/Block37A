require('dotenv').config({path:__dirname+'/../.env'});

const client = require('./client.cjs');
const { createUser } = require('./users.cjs');
const { createItem } = require('./items.cjs');
const { createReview } = require('./reviews.cjs');

const dropTables = async() => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS items;
      DROP TABLE IF EXISTS users;
    `);
  } catch(err) {
    console.log(err);
  }
}

const createTables = async() => {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) NOT NULL UNIQUE,
        password VARCHAR(60) NOT NULL
      );

      CREATE TABLE items (
        id SERIAL PRIMARY KEY,
        productname VARCHAR(30) NOT NULL UNIQUE,
        category VARCHAR(60) NOT NULL
      );

      CREATE TABLE reviews (
        rating INT CHECK (rating >= 1 AND rating <= 5),
        user_id INT REFERENCES users(id),
        item_id INT REFERENCES items(id)
      );
    `)

  } catch(err) {
    console.log(err);
  }
}

const syncAndSeed = async() => {
  await client.connect();

  await dropTables();

  await createTables();

  await createUser('Aaron', '1aaron');
  await createUser('Betty', '2betty');
  await createUser('Cindy', '3cindy');
  await createUser('David', '4david');
  await createUser('Eddy', '5eddy');

  await createItem('Apple', 'Fruit');
  await createItem('Book', 'Education');
  await createItem('Computer', 'Technology');
  await createItem('Desk', 'Home');
  await createItem('Earphone', 'Electric');

  await createReview(4, 1, 3);
  await createReview(5, 2, 1);
  await createReview(4, 3, 2);
  await createReview(3, 4, 4);
  await createReview(4, 1, 5);

  await client.end();
}

syncAndSeed();