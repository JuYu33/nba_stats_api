const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const google = require('googleapis');

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

exports.user_sendmail = (req,res,next) => {
  const TOKEN_PATH = require("../../../gmailtest");
  console.log("Request: ", req.body);
  const oAuth2Client = new google.auth.OAuth2(
    process.env.G_CID, 
    process.env.G_SEC, 
    process.env.G_RED
  );

  fs.readFile(TOKEN_PATH, (err, token) => {
    oAuth2Client.setCredentials(JSON.parse(token));
    console.log(JSON.parse(token));
    sendmail(oAuth2Client);
  });

  async function sendmail(auth) {
    // console.log("Where is auth coming from?: ", auth);
    const gmail = google.gmail({version: 'v1', auth});
  
  
    const subject = 'New Message TESTING 135790';


    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      'From: Adam Inn <paerotest@google.com>',
      'To: Adam Inn <paerotest@gmail.com>',
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      'This IS A TEST. Ignore I guess',
      'So... <b>Hello! WHY AM I BOLDING SOME THINGS HERE?!?!</b> '
    ];
    const message = messageParts.join('\n');
  
    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

      console.log("AUTH IS: ", auth);
    // const res = await gmail.users.messages.send({
    //   userId: 'me',
    //   requestBody: {
    //     raw: encodedMessage
    //   }
    // });
    // console.log(res.data);

    return 1;
  }
}