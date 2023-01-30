const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const SQL = `
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    RETURNING id, username
    `
    const { rows: [user] } = await client.query(SQL, [username, password]) 
    // console.log('user', user)
    return user;

  } catch (error) {
    console.error(error)
  }
}

async function getUser({ username, password }) {
try {
  const SQL = `
  SELECT id, username FROM users 
  WHERE username =$1
  AND password =$2
  `
const { rows: [user] } = await client.query(SQL, [username, password])
// console.log(user);
if (!user) {
  throw new Error('Could not get user');
}
  
  return user;
} catch (error) {
  console.error(error);
}


}

async function getUserById(userId) {
  try {
    const SQL = `
    SELECT username, id
    FROM users
    WHERE id = $1
    `
    const { rows: [user]} = await client.query(SQL, [userId])

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUserByUsername(userName) {
  try {
    const SQL = `
    SELECT *
    FROM users
    WHERE username = $1
    `
    const { rows: [user]} = await client.query(SQL, [userName])

    return user;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
