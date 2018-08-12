var express = require('express');
var querystring = require('querystring');
var router = express.Router();

var userlist = [
  {username: 'Adele',password: '123456',userid:1},
  {username: 'Bob',password: '123456',userid:2},
  {username: 'cathy', password: '123456', userid:3}
];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(userlist);
});

router.post('/', function(req, res, next) {
  var _data;
  
  if (!req.body) {
    return res.sendStatus(400)
  }else {
    _data = req.body;
    userlist = userlist.concat(_data);
    res.json(_data);
  }
});
module.exports = router;
