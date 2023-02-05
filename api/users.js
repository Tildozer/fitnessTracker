/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { createUser, getUser } = require("../db");
const jwt = require("jsonwebtoken");
const {
  UserDoesNotExistError,
  UserTakenError,
  PasswordTooShortError,
} = require("../errors.js");

// POST /api/users/register
router.post("/register", async (req, res, next) => {
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
      { id: id, username, password },
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
router.post("/login", async(req, res, next) => {
    
})

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
