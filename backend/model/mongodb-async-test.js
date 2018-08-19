var MongoDB = require('./mongodb-async');
var assert = require('assert');
var logger = require('../utils/plog').dlogger;
var tableName = require('./const');

describe(tableName.USER_INFO_TBL, function() {
    before(function() {
        MongoDB.connect(function(err) {
            if (err) {
                logger.fatal('mongodb connect failed, err = ', err);
            }
        });
    });
    after(function() {
        MongoDB.disconnect();
    });
    it('at first count show be zero', async function() {
        //var userinfo = {};
        var result = await MongoDB.count(tableName.USER_INFO_TBL,{});
        logger.info('at first count show be zero, reulst ', result);
        assert.equal(result.err,null);
        assert.equal(result.data, 0);
    });
    it('insert a record', async function() {
        var user = {userId: 1, userName:'raozong', passWord:'asdfghjkl'};
        var result = await MongoDB.save(tableName.USER_INFO_TBL, user);
        logger.info('insert a record and query without err, reulst ', result);
        assert.equal(result.err,null);
        assert.equal(result.data.passWord, user.passWord);
    });
    
    it('async query', async function() {
        var result = await MongoDB.findOne(tableName.USER_INFO_TBL,{userId:1});
        logger.info('async query without err, result ', result);
        assert.equal(result.err,null);
        assert.equal(result.data.passWord, 'asdfghjkl');
    });
    it('update a record', async function() {
        var result = await MongoDB.update(tableName.USER_INFO_TBL, {userId: 1}, {passWord: 'zxcvbnm'});
        logger.info('update a record and query without err, result ', result);
        assert.equal(result.err,null);
        assert.equal(result.data.nModified, 1);
    });
    it('async query', async function() {
        var result = await MongoDB.findOne(tableName.USER_INFO_TBL,{userId:1});
        logger.info('async query without err, result ', result);
        assert.equal(result.err,null);
        assert.equal(result.data.passWord, 'zxcvbnm');
    });
    
    it('remove a record', async function() {
        var result = await MongoDB.remove(tableName.USER_INFO_TBL, {userId: 1});
        assert.equal(result.err,null);
    });
    it('query record not exist', async function() {
        var result = await MongoDB.findOne(tableName.USER_INFO_TBL,{userId:1});
        logger.info('query record not exist, result ', result);
        assert.equal(result.err,null);
        assert.equal(result.data,null);
    });
    it('at last count show be zero', async function() {
        //var userinfo = {};
        var result = await MongoDB.count(tableName.USER_INFO_TBL,{});
        assert.equal(result.err,null);
        assert.equal(result.data, 0);
    });
});


describe(tableName.QUESTION_TBL, function() {
    before(function() {
        MongoDB.connect(async function(err) {
            if (err) {
                logger.fatal('mongodb connect failed, err = ', err);
            }else 
            {
                await MongoDB.remove(tableName.QUESTION_TBL,{});
            }
        });
    });
    after(function() {
        MongoDB.disconnect();
    });
    it('at first count show be zero', async function() {
        var result = await MongoDB.count(tableName.QUESTION_TBL,{});
        assert.equal(result.err, null);
        assert.equal(result.data, 0);
    });
    it('insert a record', async function() {
        var question = {qId: 1, userId:1, qType:'option'};
        question.qTitle = '1 + 1 = ?';
        question.qAnswer = 'B';
        question.qOptions = [
            {name:'A', desc: '1'},
            {name:'B', desc: '2'},
            {name:'C', desc: '3'},
            {name:'D', desc: '4'},
        ];
        var result = await MongoDB.save(tableName.QUESTION_TBL, question);
        assert.equal(result.err,null);
        assert.equal(result.data.qId, question.qId);
    });
    it('update a record', async function() {
        var result = await MongoDB.updateData(tableName.QUESTION_TBL, {qId: 1}, {$addToSet:{
            "qOptions":{$each:[{name:'E', desc:'5'},{name:'F', desc:'6'}]}}});
        //logger.info(result);
        assert.equal(result.data.qType, 'option');
        assert.equal(result.data.qOptions.length,6);
    });
    it('remove a record', async function() {
        var result = await MongoDB.remove(tableName.QUESTION_TBL, {qId: 1});
        assert.equal(result.err, null);
    });
});


describe(tableName.TEST_TBL, function() {
    before(function() {
        MongoDB.connect(async function(err) {
            if (err) {
                logger.fatal('mongodb connect failed, err = ', err);
            }else 
            {
                await MongoDB.remove(tableName.TEST_TBL,{});
            }
        });
    });
    after(function() {
        MongoDB.disconnect();
    });
    it('at first count show be zero', async function() {
        var result = await MongoDB.count(tableName.TEST_TBL,{});
        assert.equal(result.err, null);
        assert.equal(result.data, 0);
    });
    it('insert a record and query without err', async function() {
        var test = {testId:1, userId:1, tType:tableName.TEST_TBL, tCategory:'math'};
        test.qIdList = [1,2,3,4,5,6];

        var result = await MongoDB.save(tableName.TEST_TBL, test);
        assert.equal(result.err,null);
        assert.equal(result.data.testId,test.testId);
    })
    it('update a record', async function() {
        var result = await MongoDB.updateData(tableName.TEST_TBL, {testId: 1}, {$set:{qIdList:[1,2,3,4]}});
        assert.equal(result.err, null);
        assert.equal(result.data.qIdList.length, 4);
    });
    
    it('remove a record', async function() {
        var result = await MongoDB.remove(tableName.TEST_TBL, {testId: 1});
        assert.equal(result.err, null);
    });
});



describe(tableName.TASK_TBL, function() {
    before(function() {
        MongoDB.connect(async function(err) {
            if (err) {
                logger.fatal('mongodb connect failed, err = ', err);
            }else 
            {
                await MongoDB.remove(tableName.TASK_TBL,{});
            }
        });
    });
    after(function() {
        MongoDB.disconnect();
    });
    it('at first count show be zero', async function() {
        var result = await MongoDB.count(tableName.TASK_TBL,{});
        assert.equal(result.err, null);
        assert.equal(result.data, 0);
    });
    it('insert a record and query without err', async function() {
        var task = {taskId:1, userId:1, testId:1, tStatus:'todo'};
        var result = await MongoDB.save(tableName.TASK_TBL, task);
        assert.equal(result.err,null);
        assert.equal(result.data.taskId, task.taskId);
    });
    it('update a record and query without err', async function() {
        var result = await MongoDB.updateData(tableName.TASK_TBL, {taskId: 1}, {$set:{tStatus:'completed'}});
        assert.equal(result.err, null);
        assert.equal(result.data.tStatus, 'completed');
    });
    
    it('remove a record without err', async function() {
        var result = await MongoDB.remove(tableName.TASK_TBL, {taskId: 1});
        assert.equal(result.err, null);
    });
});