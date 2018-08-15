var express = require('express');
var querystring = require('querystring');
var router = express.Router();
var clogger = require('../utils/plog').clogger;

var userlist = [
    {username: 'Adele',password: '123456',userid:1},
    {username: 'Bob',password: '123456',userid:2},
    {username: 'cathy', password: '123456', userid:3}
  ];

function isUserExist(user) {
  for (let i = 0; i < userlist.length; i++) {
    if (user.username == userlist[i].username &&
      user.password == userlist[i].password) {
        return true;
      }
    }
  return false;
}
router.post('/', function(req, res, next) {
    var _data;
    if(req.user) {
      console.log(req.user);
    }
    
    if (!req.body) {
      return res.sendStatus(400);
    }else {
      _data = req.body;
      //校验session
      if (req.session.user) {
        let user = req.session.user;
        if (user.username != _data.username ||
            user.password != _data.password) {
              clogger.error('user info conflict with session info...');
              return res.sendStatus(404);
          }
        if (!isUserExist(_user)) {
          clogger.error('user not exist...');
          return res.sendStatus(404);
        }
      }else {
        if (!isUserExist(_data)) {
          clogger.error('user not exist...');
          return res.sendStatus(404);
        }
        req.session.user = _data;
      }
      return res.sendStatus(200);
    }
  });

  module.exports = router;
