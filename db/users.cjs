const client = require('./client.cjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async(newUsername, newPassword) => {
  try {
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    await client.query(`
      INSERT INTO users (username, password)
      VALUES ('${newUsername}', '${encryptedPassword}');
    `);
  } catch(err) {
    console.log(err);
  }
}

const getUser = async(inputUsername, inputPassword) => {
  const { rows } = await client.query(`
    SELECT * FROM users
    WHERE username='${inputUsername}';
  `);

  const user = rows[0];

  if(!user) {
    throw Error('Errors in Username and password');
  } else {
    const hashedPassword = user.password;

    const isPasswordMatch = await bcrypt.compare(inputPassword, hashedPassword);
    
    if(isPasswordMatch) {
      const assignedToken = await jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      return assignedToken;
    } else {
      throw Error('Errors in Username and password');
    }
  }
}

const getUserByToken = async(token) => {
  const { userId } = await jwt.verify(token, process.env.JWT_SECRET);
  
  const { rows } = await client.query(`
    SELECT id, username FROM users WHERE id=${userId};
  `);

  const user = rows[0];
  return user;
}

module.exports = {
  createUser,
  getUser,
  getUserByToken
}