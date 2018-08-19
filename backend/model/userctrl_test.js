var UserCtrl = require('./userctrl');
var MongoDB = require('./mongodb-async');
var assert = require('assert');
var logger = require('../utils/plog').dlogger;

var user = [{userName:'Alen', passWord:'asdfghjkl'},
{userName:'Bob', passWord:'qwertyui'},
{userName:'Cathy', passWord:'zxcvbnml'},
{userName:'Django', passWord:'lkjhgfds'}];

describe('UserInfo', function() {
    before(function() {
        MongoDB.connect(async function(err) {
            if (err) {
                logger.fatal('mongodb connect failed, err = ', err);
            }else {
                await UserCtrl.init();
            }
        });
    });
    after(function() {
        MongoDB.disconnect();
    });
    it('at first count show be zero', async function() {
        var result = await UserCtrl.getCount();
        logger.info('at first count show be zero, reulst ', result);
        assert.equal(result.err, null);
        assert.equal(result.data, 0);
    });
    it('create a user', async function() {
        var result = await UserCtrl.create(user[0]);
        logger.info('create a user, reulst ', result);
        assert.equal(result,null);
    });
    
    it('create a user alreay exist', async function() {
        var result = await UserCtrl.create(user[0]);
        logger.info('create a user already exist, reulst ', result);
        assert.notEqual(result, null);
    });
    it('update a record with same user', async function() {
        var newuser = {userName:user[0].userName, passWord:user[0].passWord};
        var result = await UserCtrl.update(user[0], newuser);
        logger.info('update a record with same user, reulst ', result);
        assert.notEqual(result, null);
    });
    it('update a record already exist', async function() {
        var newuser = {userName:user[0].userName, passWord:'xxxxxxxx'};
        var result = await UserCtrl.update(user[0], newuser);
        logger.info('update a record exist, reulst ', result);
        assert.equal(result, null);
        user[0].passWord = 'xxxxxxxx';
    });
    it('insert 3 records', async function() {
        for (let i = 1; i < user.length; i++) {
            var result = await UserCtrl.create(user[i]);
            logger.info('insert 3 records, reulst ', result);
            assert.equal(result, null);
        }
    });
    it('get max userid', async function() {
        assert.equal(UserCtrl.generateId, 4);
        var result = await UserCtrl.init();
        assert.equal(result, null);
        assert.equal(UserCtrl.generateId, 4);
    });
    it('remove a user', async function() {
        var result = await UserCtrl.remove(user[0]);
        assert.equal(result,null);
    });
    it('query user count', async function() {
        var result = await UserCtrl.getCount();
        assert.equal(result.err, null);
        assert.equal(result.data, 3);
    });
    it('remove all users', async function() {
        for (let i = 1; i < user.length; i++) {
            var result = await UserCtrl.remove(user[i]);
            logger.info('remove 3 records, reulst ', result);
            assert.equal(result, null);
        }
    });
    it('at last count show be zero', async function() {
        //var userinfo = {};
        var result = await UserCtrl.getCount();
        assert.equal(result.err, null);
        assert.equal(result.data, 0);
    });
});