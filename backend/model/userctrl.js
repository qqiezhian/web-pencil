var MongoDB = require('./mongodb');
var userInfoTbl = require('./const').USER_INFO_TBL;
var logger = require('../utils/plog').clogger;

var UserCtrl = function() {
    this.generateId = 0;

};

UserCtrl.prototype.isExist = function(username){
    var exist = false;
    MongoDB.findOne(userInfoTbl,{userName:username}, function(err, res) {
        if (err) {
            logger.info('mongodb findone failed, err: ', err,'username: ', username);
        }else {
            if (res) {
                exist = true;
            }
        }
    })
};

UserCtrl.prototype.validate = function(username, password) {

};
/**
 * 更新密码
 * @param user  {username, password}
 */
UserCtrl.prototype.update = function(user) {

};
/**
 * 创建用户并保存
 * @param user  {username, password}
 */
UserCtrl.prototype.create = function(user) {

};

module.exports = new UserCtrl();