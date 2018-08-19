var MongoDB = require('./mongodb-async');
var logger = require('../utils/plog').dlogger;
const QUESTION_TBL = require('./const').QUESTION_TBL;


/*
Question key有以下几种：
主key: qId
辅key: userId + qTitle
"Question": {
        "qId": "Number",        //question id
        "userId": "Number",     //创建者id
        "qType": "String",      //题目类型  'option' 
        "qTitle": "String",     //题目
        "qAnswer": "String",    //题目答案
        "qOptions": "Object"    //题目选项
    }
*/

/*
@ 判断型接口返回bool值
@ Get接口返回{err,data}对象，通过err判断是否正确，通过data获取数据
@ 其它Operation接口返回err
*/ 
var QuesCtrl = function() {
    this.generateId = 0;
    this.inited = false;
};

QuesCtrl.prototype.init = async function() {
    if (this.init) return null;
    var count = await this.getCount();
    if (count == 0) {
        return null;
    }
    var result = await MongoDB.where(QUESTION_TBL,{}, {fields:'qId',sort: {qId: -1}, limit: 1});
    if (result.err) {
        logger.error(QUESTION_TBL, ' get max testid failed, err: ',result.err);
    } else {
        this.generateId = result.data.qId;
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
QuesCtrl.prototype.getCount = async function(condition) {
    var result = await MongoDB.count(QUESTION_TBL,condition);
    return result;
};

/**
 * 获取满足条件的testpaper 列表
 * @param condition example {qId:5}
 * @return {err, data: testpaper list}
 */
QuesCtrl.prototype.getQuestion = async function(condition) {
    var result = await MongoDB.find(QUESTION_TBL, condition);
    return result;
}

/*************************BEGIN 判断接口 *************************/
QuesCtrl.prototype.exist = async function(question) {
    var exist = false;
    var condition = {userId: question.userId, qTitle: question.qTitle};
    var result = await MongoDB.findOne(QUESTION_TBL, condition);
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
 * @param question 
 * 必选参数: {userId:5, qType:'option',qTitle:'1 + 1 = ？', qAnswer:'B', 
 * qOptions:[
            {name:'A', desc: '1'},
            {name:'B', desc: '2'},
            {name:'C', desc: '3'},
            {name:'D', desc: '4'},
        ];
 * @return {err}
 */
QuesCtrl.prototype.create = async function(question) {
    if (!question.userId || !question.qType || !question.qTitle 
        || !question.qAnswer || !question.qOptions)
    {
        logger.error('question field not completed ', question);
        return Error('question field not completed');
    }
    var isexist = await this.exist(question);
    if (isexist) {
        return Error('question already exist');
    }
    var ques = question;
    ques.qId = ++this.generateId;
    var result = await MongoDB.save(QUESTION_TBL, ques);
    if (result.err) {
        logger.error('test2create save failed，err ', result.err);
    }
    return result.err;
}

/**
 * 删除一个题目
 * @param condition 
 * 必选参数: {userId:5, qTitle:'1 + 1 = ?'} 或 {qId: 3}
 * @return {err}
 */
QuesCtrl.prototype.remove = async function(condition) {
    //这两个参数可以唯一确定一个题目
    if ((!condition.userId || !condition.qTitle) && (!condition.qId))
    {
        logger.error('condition field not completed ', condition);
        return Error('condition field not completed');
    }
    
    var result = await MongoDB.remove(QUESTION_TBL, condition);
    if (result.err) {
        logger.error('TestPaper remove failed, err ', result.err, 'condition ',condition);
    }
    return result.err;
}



module.exports = new QuesCtrl();