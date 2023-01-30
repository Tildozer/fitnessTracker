const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const SQL = `
    INSERT INTO "users"(username, password)
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

}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
