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
    console.log(user)
    return user;

  } catch (error) {
    console.error(error)
  }

  // delete user.password
}

async function getUser({ username, password }) {

try {
  const SQL = `
  SELECT id, username FROM users 
  WHERE password = $1
  `
const { rows: [user] } = await client.query(SQL, [password])
console.log(user);
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
  
  } catch (error) {
    console.error(error);
  }
}

async function getUserByUsername(userName) {
 
  try {
  
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
