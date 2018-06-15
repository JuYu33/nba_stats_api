const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_create = (req,res,next) => {
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "email not avaialbe, already exists",
        })
      } else {
        bcrypt.hash(req.body.password, 11, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const newUser = new User({
              _id : new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            newUser.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User Created',
                  email: result.email,
                  password: result.password
                })
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                })
              })
          }
        })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
}

exports.user_login = (req,res,err) => {
  User.findOne({email: req.body.email})
    .exec()
    .then(users => {
      if (users.length < 1) {
        return res.status(401).json({
          message: "Email and/or Password entered incorrectly",
        })
      } else {
        bcrypt.compare(req.body.password, users.password, (err, result) => {
          if (result) {
            const jToken = jwt.sign({
              email: users.email,
              _id: users._id
            }, 
            process.env.MY_JWT_KEY,
            {
              expiresIn: '1h'
            },

          )
            return res.status(200).json({
              message: "Auth successful",
              token: jToken,
              _id: users._id
            })
          } else {
            return res.status(401).json({
              message: "Email and/or Password entered incorrectly",
            })
          }
        })
      }
    })
    .catch(err => {
      console.log(err);
      console.log("Unable to find user");
      res.status(500).json({
        error: err
      })
    });
}

exports.delete_user = (req,res,err) => {
  User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
      res.status(200).json({
        message: `User deleted`,
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
}

exports.find_users = (req,res,next) => {
  User.find()
    .exec()
    .then(data => {
      console.log(data);
      res.status(201).json({
        message: "found: ",
        data: data
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
}