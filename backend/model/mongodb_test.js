//先包含进来
var MongoDB = require('./mongodb');
var assert = require('assert');
var logger = require('../utils/plog').clogger;

describe('UserInfo', function() {
    before(function() {
        MongoDB.connect(function(err) {
            if (err) {
                logger.fatal('mongodb connect failed, err = ', err);
            }else 
            {
                MongoDB.remove('UserInfo',{}, function(err, res) {
                    if (err) throw err;
                });
            }
        });
    });
    after(function() {
        MongoDB.disconnect();
    });
    it('at first count show be zero', function(done) {
        //var userinfo = {};
        MongoDB.count('UserInfo',{}, function(err, res) {
            if (err) {
                throw err;
            }
            assert.equal(res, 0);
            done();
        })
    });
    it('insert a record and query without err', function(done) {
        var user = {userId: 1, userName:'raozong', passWord:'asdfghjkl'};
        MongoDB.save('UserInfo', user, function(err, res) {
            if (err) throw err;
            MongoDB.find('UserInfo', {userId: 1}, {}, function(err, res) {
                assert.equal(res.length,1);
                assert.equal(res[0].passWord, user.passWord);
                done();
            })
        })
    });
    it('update a record and query without err', function(done) {
        MongoDB.update('UserInfo', {userId: 1}, {passWord: 'zxcvbnm'}, function(err, res) {
            if (err) throw err;
            MongoDB.find('UserInfo', {userId: 1}, {}, function(err, res) {
                assert.equal(res.length,1);
                assert.equal(res[0].passWord, 'zxcvbnm');
                done();
            })
        })
    });
    it('remove a record without err', function(done) {
        MongoDB.remove('UserInfo', {userId: 1}, function(err) {
            if (err) throw err;
            done();
        })
    });
    it('at last count show be zero', function(done) {
        //var userinfo = {};
        MongoDB.count('UserInfo',{}, function(err, res) {
            if (err) throw err;
            assert.equal(res, 0);
            done();
        })
    });
});

describe('Question', function() {
    before(function() {
        MongoDB.connect(function(err) {
            if (err) {
                logger.fatal('mongodb connect failed, err = ', err);
            }else 
            {
                MongoDB.remove('Question',{}, function(err, res) {
                    if (err) throw err;
                });
            }
        });
    });
    after(function() {
        MongoDB.disconnect();
    });
    it('at first count show be zero', function(done) {
        MongoDB.count('Question',{}, function(err, res) {
            if (err) throw err;
            assert.equal(res, 0);
            done();
        })
    });
    it('insert a record and query without err', function(done) {
        var question = {qId: 1, userId:1, qType:'option'};
        question.qTitle = '1 + 1 = ?';
        question.qAnswer = 'B';
        question.qOptions = [
            {name:'A', desc: '1'},
            {name:'B', desc: '2'},
            {name:'C', desc: '3'},
            {name:'D', desc: '4'},
        ];
        MongoDB.save('Question', question, function(err, res) {
            if (err) throw err;
            logger.info('question...', res);
            done();
        })
    });
    it('update a record and query without err', function(done) {
        MongoDB.updateData('Question', {qId: 1}, {$addToSet:{
            "qOptions":{$each:[{name:'E', desc:'5'},{name:'F', desc:'6'}]}
        }}, function(err, res) {
            if (err) throw err;
                assert.equal(res.qOptions.length,6);
                logger.info('title: ', res.qTitle);
                res.qOptions.forEach(element => {
                    logger.info(element.name, ':', element.desc);
                });
                done();
        })
    });
    it('remove a record without err', function(done) {
        MongoDB.remove('Question', {qId: 1}, function(err) {
            if (err) throw err;
            done();
        })
    });
});


describe('Test', function() {
    before(function() {
        MongoDB.connect(function(err) {
            if (err) {
                logger.fatal('mongodb connect failed, err = ', err);
            }else 
            {
                MongoDB.remove('Test',{}, function(err, res) {
                    if (err) throw err;
                });
            }
        });
    });
    after(function() {
        MongoDB.disconnect();
    });
    it('at first count show be zero', function(done) {
        MongoDB.count('Test',{}, function(err, res) {
            if (err) throw err;
            assert.equal(res, 0);
            done();
        })
    });
    it('insert a record and query without err', function(done) {
        var test = {testId:1, userId:1, tType:'test', tCategory:'math'};
        test.qIdList = [1,2,3,4,5,6];

        MongoDB.save('Test', test, function(err, res) {
            if (err) throw err;
            logger.info('test...', res);
            done();
        })
    });
    it('update a record and query without err', function(done) {
        MongoDB.updateData('Test', {testId: 1}, {$set:{qIdList:[1,2,3,4]}}, function(err, res) {
            if (err) throw err;
                assert.equal(res.qIdList.length,4);
                logger.info('test: ', res.tName, 'question list:');
                res.qIdList.forEach(element => {
                    logger.info(element);
                });
                done();
        })
    });
    
    it('remove a record without err', function(done) {
        MongoDB.remove('Test', {testId: 1}, function(err) {
            if (err) throw err;
            done();
        })
    });
});



describe('Task', function() {
    before(function() {
        MongoDB.connect(function(err) {
            if (err) {
                logger.fatal('mongodb connect failed, err = ', err);
            }else 
            {
                MongoDB.remove('Task',{}, function(err, res) {
                    if (err) throw err;
                });
            }
        });
    });
    after(function() {
        MongoDB.disconnect();
    });
    it('at first count show be zero', function(done) {
        MongoDB.count('Task',{}, function(err, res) {
            if (err) throw err;
            assert.equal(res, 0);
            done();
        })
    });
    it('insert a record and query without err', function(done) {
        var task = {taskId:1, userId:1, testId:1, tStatus:'todo'};

        MongoDB.save('Task', task, function(err, res) {
            if (err) throw err;
            logger.info('task...', res);
            done();
        })
    });
    it('update a record and query without err', function(done) {
        MongoDB.updateData('Task', {taskId: 1}, {$set:{tStatus:'completed'}}, function(err, res) {
            if (err) throw err;
            logger.info(res);
            assert.equal(res.tStatus,'completed');
            done();
        })
    });
    
    it('remove a record without err', function(done) {
        MongoDB.remove('Task', {taskId: 1}, function(err) {
            if (err) throw err;
            done();
        })
    });
});