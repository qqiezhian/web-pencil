var TestCtrl = require('./testctrl');
var MongoDB = require('./mongodb-async');
var assert = require('assert');
var logger = require('../utils/plog').dlogger;

var testpaper = [{userId:2, tType:'bank', tCategory:'history',tName:'the second world war',qIdList:[1,3,5,7]}];


describe('TestPaper', function() {
    before(function() {
        MongoDB.connect(async function(err) {
            if (err) {
                logger.fatal('mongodb connect failed, err = ', err);
            }else {
                await TestCtrl.init();
            }
        });
    });
    after(function() {
        MongoDB.disconnect();
    });
    it('at first count show be zero', async function() {
        var result = await TestCtrl.getCount({});
        logger.info('at first count show be zero, result ', result);
        assert.equal(result.err, null);
        assert.equal(result.data, 0);
    });
    it('create a record', async function() {
        var result = await TestCtrl.create(testpaper[0]);
        logger.info('create a record, result ', result);
        assert.equal(result,null);
    });
    
    it('create a record alreay exist', async function() {
        var result = await TestCtrl.create(testpaper[0]);
        logger.info('create a record already exist, result ', result);
        assert.notEqual(result, null);
    });
    it('add question list', async function() {
        var condition = TestCtrl.getCondition(testpaper[0]);
        var newlist = [4,6];
        var result = await TestCtrl.addQuestions(condition, newlist);
        logger.info('update question list, result ', result);
        assert.equal(result, null);
    });
    it('query question list', async function() {
        var condition = TestCtrl.getCondition(testpaper[0]);
        var result = await TestCtrl.getTestList(condition);
        logger.info('update question list, result ', result);
        assert.equal(result.err, null);
        assert.equal(result.data[0].qIdList.length, 6);
    });
    it('delete question list', async function() {
        var condition = TestCtrl.getCondition(testpaper[0]);
        var dellist = [3,4,5];
        var result = await TestCtrl.delQuestions(condition, dellist);
        logger.info('delete question list, result ', result);
        assert.equal(result, null);
    });
    it('query question list', async function() {
        var condition = TestCtrl.getCondition(testpaper[0]);
        var result = await TestCtrl.getTestList(condition);
        logger.info('update question list, result ', result);
        logger.info('update question list, list ', result.data[0].qIdList);
        assert.equal(result.err, null);
        assert.equal(result.data[0].qIdList.length, 3);
    });
    it('modify category', async function() {
        var condition = {userId: testpaper[0].userId, tCategory:testpaper[0].tCategory};
        var result = await TestCtrl.modifyCategory(condition,'language');
        assert.equal(result, null);
    });
    it('modify type', async function() {
        var condition = {userId: testpaper[0].userId, tName:testpaper[0].tName};
        var result = await TestCtrl.modifyType(condition,'test');
        assert.equal(result, null);
    });
    it('modify name', async function() {
        var condition = {userId: testpaper[0].userId, tName:testpaper[0].tName};
        var result = await TestCtrl.modifyName(condition,'the first world war');
        assert.equal(result, null);
    });
    it('query record info', async function() {
        var condition = {userId: testpaper[0].userId};
        var result = await TestCtrl.getTestList(condition);
        assert.equal(result.err, null);
        assert.equal(result.data[0].qIdList.length, 3);
        assert.equal(result.data[0].tName, 'the first world war');
        assert.equal(result.data[0].tType, 'test');
        assert.equal(result.data[0].tCategory, 'language');
    });
    it('get max testid', async function() {
        assert.equal(TestCtrl.generateId, 1);
        var result = await TestCtrl.init();
        assert.equal(result, null);
        assert.equal(TestCtrl.generateId, 1);
    });
    it('remove a user', async function() {
        var condition = {userId: testpaper[0].userId, tName:'the first world war'};
        var result = await TestCtrl.remove(condition);
        assert.equal(result,null);
    });
    it('at last count show be zero', async function() {
        var result = await TestCtrl.getCount({});
        assert.equal(result.err, null);
        assert.equal(result.data, 0);
    });
});