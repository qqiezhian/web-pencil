var MongoDB = require('./mongodb-async');
var logger = require('../utils/plog').dlogger;
const USER_INFO_TBL = require('./const').USER_INFO_TBL;

/*
@ 判断型接口返回bool值
@ Get接口返回{err,data}对象，通过err判断是否正确，通过data获取数据
@ 其它Operation接口返回err
*/ 

var UserCtrl = function() {
    this.generateId = 0;
    this.inited = false;
};
UserCtrl.prototype.init = async function() {
    if (this.init) return null;
    var count = await this.getCount();
    if (count == 0) {
        return null;
    }
    var result = await MongoDB.where(USER_INFO_TBL,{}, {fields:'userId',sort: {userId: -1}, limit: 1});
    if (result.err) {
        logger.error(USER_INFO_TBL, ' get max userId failed, err: ',result.err);
    } else {
        this.generateId = result.data.userId;
        this.init = true;
    }
    return result.err;
};
/*************************BEGIN get接口 *************************/
UserCtrl.prototype.getCount = async function() {
    var result = await MongoDB.count(USER_INFO_TBL,{});
    return result;
};

/**
 * 创建用户并保存
 * @param user  {username, password}
 */
UserCtrl.prototype.getId = async function(user) {
    var rightful = await this.validate(user);
    if (!rightful)
        return Error('user not exist');
    var result = await MongoDB.find(USER_INFO_TBL,{userName:user.userName});
    if (result.err) {
        logger.error(USER_INFO_TBL, ' get userid failed, err: ',
            result.err, 'username: ', newuser.userName);
    }
    return result;
};
/*************************BEGIN 判断接口 *************************/

/**
 * 用户名是否已经存在
 * @param username
 */
UserCtrl.prototype.exist = async function(username){
    var exist = false;
    var result = await MongoDB.findOne(USER_INFO_TBL, {userName:username});
    if (result.data) exist = true;
    return exist;
};
/**
 * 验证用户信息
 * @param user  {username, password}
 */
UserCtrl.prototype.validate = async function(user) {
    var rightful = false;
    var result = await MongoDB.findOne(USER_INFO_TBL, {userName:user.userName});
    if (result && result.data.userName == user.userName 
        && result.data.passWord == user.passWord) {
            rightful = true;
        }
    return rightful;
};
/*************************BEGIN oper接口 *************************/
/**
 * 更新密码，只能更新密码，不允许更新用户名
 * @param user  {username, password}
 * @return errcode
 */
UserCtrl.prototype.update = async function(olduser, newuser) {
    if (!olduser || !newuser) 
        return Error('input invalid');
    if (olduser.userName != newuser.userName)
        return Error('username must be same');
    if (olduser.passWord == newuser.passWord) 
        return Error('password must be different');
    var rightful = await this.validate(olduser);
    if (!rightful) 
        return Error('old user info not correct');
    var result = await MongoDB.update(USER_INFO_TBL, 
        {userName:olduser.userName}, {passWord:newuser.passWord});
    logger.info('UserCtrl inner log, update result ',result);
    if (result.err) {
        logger.error(USER_INFO_TBL, ' update failed, err: ',
            result.err, 'username: ', olduser.userName);
    }
    return result.err;
};
/**
 * 创建用户并保存
 * @param user  {username, password}
 */
UserCtrl.prototype.create = async function(user) {
    var exist = await this.exist(user.userName);
    if (exist == true)
        return Error('user already exist');
    newUser = {userId:++this.generateId, 
        userName:user.userName, passWord:user.passWord};
    var result = await MongoDB.save(USER_INFO_TBL,newUser);
    if (result.err) {
        logger.error(USER_INFO_TBL, ' create new user failed, err: ',
            result.err, 'username: ', newuser.userName);
    }
    return result.err;
};

/**
 * 创建用户并保存
 * @param user  {username, password}
 */
UserCtrl.prototype.remove = async function(user) {
    var rightful = await this.validate(user);
    if (!rightful)
        return Error('user not exist');
    var result = await MongoDB.remove(USER_INFO_TBL,{userName:user.userName});
    if (result.err) {
        logger.error(USER_INFO_TBL, ' create new user failed, err: ',
            result.err, 'username: ', newuser.userName);
    }
    return result.err;
};


module.exports = new UserCtrl();