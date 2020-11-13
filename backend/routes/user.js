const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jtw = require('jsonwebtoken')

const User = require('../models/user');
const user = require('../models/user');

const UserController = require('../controllers/user');


router.post("/signup", UserController.crateUser);

router.post('/login', UserController.login);

module.exports = router
