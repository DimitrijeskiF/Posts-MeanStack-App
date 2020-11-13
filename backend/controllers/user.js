const bcrypt = require('bcryptjs');
const jtw = require('jsonwebtoken')

const User = require('../models/user');


exports.crateUser =  (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Invalid authentication credentials!'
        });
      });
  });
}

exports.login = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Filed To authenticate'
        })
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password)

    }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'Filed To authenticate'
      })
    }
    const token = jtw.sign(
      { email: fetchedUser.email, userId: fetchedUser._id },
      process.env.JTW_KEY,
      { expiresIn: '1h' });

    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    })

  }).catch(err => {
    return res.status(500).json({
      message: 'You are not authenticated!'
    })
  })
}
