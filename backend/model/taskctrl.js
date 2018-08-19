var MongoDB = require('./mongodb-async');
var logger = require('../utils/plog').dlogger;
const TASK_TBL = require('./const').TASK_TBL;


/*
Question key有以下几种：
主key: taskId
辅key: userId + testId
"Tasks": {
        "taskId": "Number",   //task id
        "userId": "Number",   //创建者id
        "testId": "Number",   //测试id
        "tStatus": "String"   //是否完成
    }
*/

/*
@ 判断型接口返回bool值
@ Get接口返回{err,data}对象，通过err判断是否正确，通过data获取数据
@ 其它Operation接口返回err
*/ 
var TaskCtrl = function() {
    this.generateId = 0;
    this.inited = false;
};

TaskCtrl.prototype.init = async function() {
    if (this.init) return null;
    var count = await this.getCount();
    if (count == 0) {
        return null;
    }
    var result = await MongoDB.where(TASK_TBL,{}, {fields:'taskId',sort: {taskId: -1}, limit: 1});
    if (result.err) {
        logger.error(TASK_TBL, ' get max taskid failed, err: ',result.err);
    } else {
        this.generateId = result.data.taskId;
        this.init = true;
    }
    return result.err;
};

/*************************BEGIN get接口 *************************/
/**
 * 获取某个user的testpaper个数
 * @param condition {userId:5}
 * @return {err, data:count}
 */
TaskCtrl.prototype.getCount = async function(condition) {
    var result = await MongoDB.count(TASK_TBL,condition);
    return result;
};

/**
 * 获取满足条件的testpaper 列表
 * @param condition example {qId:5}
 * @return {err, data: testpaper list}
 */
TaskCtrl.prototype.getTask = async function(condition) {
    var result = await MongoDB.find(TASK_TBL, condition);
    return result;
}

/*************************BEGIN 判断接口 *************************/
TaskCtrl.prototype.exist = async function(task) {
    var exist = false;
    var condition = {userId: task.userId, testId: task.testId};
    var result = await MongoDB.findOne(TASK_TBL, condition);
    if (result.err) {
        logger.error('find record failed, err ', result.err, 'condition ', condition);
    } else if (result.data) {
        exist = true;
    }
    return exist;
}

/*************************BEGIN oper接口 *************************/
/**
 * 创建一个新的题目
 * @param task 
 * 必选参数: {userId:5, testId:4, tStatus:'todo'}
 * @return {err}
 */
TaskCtrl.prototype.create = async function(task) {
    if (!task.userId || !task.testId || !task.tStatus)
    {
        logger.error('question field not completed ', question);
        return Error('question field not completed');
    }
    var isexist = await this.exist(task);
    if (isexist) {
        return Error('task already exist');
    }
    var task2 = task;
    task2.taskId = ++this.generateId;
    var result = await MongoDB.save(TASK_TBL, task2);
    if (result.err) {
        logger.error('test2create save failed，err ', result.err);
    }
    return result.err;
}

/**
 * 删除一个题目
 * @param condition 
 * 必选参数: {userId:5, testId:4} 或 {taskId: 3}
 * @return {err}
 */
TaskCtrl.prototype.remove = async function(condition) {
    //这两个参数可以唯一确定一个题目
    if ((!condition.userId || !condition.testId) && (!condition.taskId))
    {
        logger.error('condition field not completed ', condition);
        return Error('condition field not completed');
    }
    
    var result = await MongoDB.remove(TASK_TBL, condition);
    if (result.err) {
        logger.error('TestPaper remove failed, err ', result.err, 'condition ',condition);
    }
    return result.err;
}



module.exports = new TaskCtrl();