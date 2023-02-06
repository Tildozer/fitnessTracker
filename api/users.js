/* eslint-disable no-useless-catch */
const express = require("express");
const UserRouter = express.Router();
const { createUser, getUser, getUserByUsername, } = require("../db");
const jwt = require("jsonwebtoken");
const {
  UnauthorizedError,
  UserDoesNotExistError,
  UserTakenError,
  PasswordTooShortError,
} = require("../errors.js");
const id = require("faker/lib/locales/id_ID");
const { token } = require("morgan");

// POST /api/users/register
UserRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (password.length <= 7) {
      res.send({
        error: "Short Password",
        message: PasswordTooShortError(),
        name: username,
      });
    }
    const newUser = await createUser(req.body);

    if (!newUser) {
      res.send({
        error: "Taken Username",
        message: UserTakenError(username),
        name: username,
      });
    }

    const { id } = newUser;
    const token = jwt.sign(
      { id: id, username },
      process.env.JWT_SECRET
    );

    res.send({
      message: "You have successfully registered!",
      token: token,
      user: {
        id: id,
        username: username,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/users/login
UserRouter.post("/login", async(req, res, next) => {
  const {username, password} = req.body;


  
  if (!username || !password) {
    next({
      name: "Missing Credentials Error",
      message: "User not found"
    });
  }

  try {
    const user = await getUser({username, password});
    
    console.log(user)
    if (username == username) {
  
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET
      );

      res.send({ 
        message: "you're logged in!",
        token: token,
        user: user,
    })
    } else {

      next ({
        name: "Incorrect Credetials Error",
        message: "Username or password is incorrect"
      })
    }

  } catch (error) {
    next(error);
  }

})

// GET /api/users/me

UserRouter.get('/me', async (req, res, next) => {

  const token = req.header('Authorization')
  
  
try {
  

  if (!token) {
    res.status(401).send({
      message: UnauthorizedError(),
      error: 'No token found',
      name: 'name'
    })
  }

  const headerToken = req.header('Authorization').slice(7);
  const userInfo = jwt.verify(headerToken, process.env.JWT_SECRET)
  const user = await getUserByUsername(userInfo.username)

  if (user) {
    console.log('beans')
    res.send({
      id: user.id, 
      username: user.username
    });
  }
  else {
      console.log('BEANS')
      res.send('User unavailable');
    
  }
} catch (error) {
  next(error);
}

})

// GET /api/users/:username/routines

module.exports = UserRouter;
