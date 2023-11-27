const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(
      (hash) => {
        //console.log('sign up');
        const user = new User({
          email: req.body.email,
          password: hash
        });
        console.log(user);
        user.save().then(
          () => {
            res.status(201).json({ //created
              message: 'User added successfully!'
            });
          }
        ).catch(
          (error) => {
            res.status(500).json({ //500 – Internal Server Error
              error: error
            });
          }
        );
      }
    );
  };

  
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }).then(
      (user) => {
        if (!user) {
          return res.status(401).json({ //401 Unauthorized
            error: new Error('User not found!')
          });
        }
        bcrypt.compare(req.body.password, user.password).then(
          (valid) => {
            if (!valid) {
              return res.status(401).json({ //401 Unauthorized
                error: new Error('Incorrect password!')
              });
            }
            const token = jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' });
            res.status(200).json({ //OK
              userId: user._id,
              token: token
            });
          }
        ).catch(
          (error) => {
            res.status(500).json({ //500 – Internal Server Error
              error: error
            });
          }
        );
      }
    ).catch(
      (error) => {
        res.status(500).json({ //500 – Internal Server Error
          error: error
        });
      }
    );
  }