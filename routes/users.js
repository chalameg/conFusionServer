const express = require('express');
const bodyParser = require('body-parser')

const User = require('../models/user');
const passport = require('passport');

const router = express.Router();

router.use(bodyParser.json())

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
;
      if(err){
        res.statusCode = 500;
        res.header("Content-Type", "Application/json");
        res.json({err: err});
      }
      else{
      
        passport.authenticate('local')(req, res, () => {
          console.log(user);
          res.statusCode = 200;
          res.header("Content-Type", "Application/json");
          res.json({success: true, status: "Registration Successfull!"});
        });
      }
  });
});

router.post("/login", passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.header("Content-Type", "Application/json");
  res.json({success: true, status: "You are logged in Successfully!"});
});

router.get("/logout", (req, res) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }else{
    var err = new Error("You are not logged in.");
    err.status = 403;
    next(err);
  }
});

module.exports = router;
