const client = require("./client");
const bcrypt = require("bcrypt")

const saltRounds = 10;

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)  
    console.log(hashedPassword);

    const SQL = `
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    RETURNING id, username
    `
    const { rows: [user] } = await client.query(SQL, [username, hashedPassword]) 
    // console.log('user', user)
    return user;

  } catch (error) {
    console.error(error)
  }
}

async function getUser({ username, password }) {
try {
  const SQL = `
  SELECT * 
  FROM users 
  WHERE username =$1
  `
const { rows: [user] } = await client.query(SQL, [username])
// console.log(user);
if (!user) {
  throw new Error('Could not get user');
}
  const hashedPassword = user.password;
  const match = await bcrypt.compare(password, hashedPassword)

  if (match) {
    delete user.password;
    return user;
  }  

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
