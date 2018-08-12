var express = require('express');
var querystring = require('querystring');
var router = express.Router();
var jwt = require('jsonwebtoken');

var userlist = [
    {username: 'Adele',password: '123456',userid:1},
    {username: 'Bob',password: '123456',userid:2},
    {username: 'cathy', password: '123456', userid:3}
  ];

router.post('/', function(req, res, next) {
    var _data;
    if(req.user) {
      console.log(req.user);
    }
    
    if (!req.body) {
      return res.sendStatus(400);
    }else {
      _data = req.body;
      for (let i = 0; i < userlist.length; i++) {
          if (_data.username == userlist[i].username &&
        _data.password == userlist[i].password) {
            var authToken = jwt.sign({username: _data.username}, "secret");
            return res.json({token: authToken});
        }
      }
      return res.sendStatus(404);
    }
  });

  module.exports = router;
