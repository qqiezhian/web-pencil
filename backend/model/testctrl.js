var MongoDB = require('./mongodb-async');
var logger = require('../utils/plog').dlogger;
const TEST_TBL = require('./const').TEST_TBL;

/*
TestPaper是题库或者测试，由tType决定。
key有以下几种：
主key: testId
辅key: userId + tName
"TestPaper": {
        "testId": "Number",         //该test的唯一标识
        "userId": "Number",         //创建者唯一标识
        "tType": "String",          //'bank'--题库   'paper'--试卷
        "tName": "String",          //名字
        "tCategory": "String",      //类型
        "qIdList": "Object"         //包含的题目ID列表
    },
*/
/*
@ 判断型接口返回bool值
@ Get接口返回{err,data}对象，通过err判断是否正确，通过data获取数据
@ 其它Operation接口返回err
*/ 

var TestCtrl = function() {
    this.generateId = 0;
    this.inited = false;
};

TestCtrl.prototype.init = async function() {
    if (this.init) return null;
    var count = await this.getCount();
    if (count == 0) {
        return null;
    }
    var result = await MongoDB.where(TEST_TBL,{}, {fields:'testId',sort: {testId: -1}, limit: 1});
    if (result.err) {
        logger.error(TEST_TBL, ' get max testid failed, err: ',result.err);
    } else {
        this.generateId = result.data.testId;
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
TestCtrl.prototype.getCount = async function(condition) {
    var result = await MongoDB.count(TEST_TBL,condition);
    return result;
};
/**
 * 获取满足条件的testpaper 列表
 * @param condition example {userId:5, tCategory:'history'}
 * @return {err, data: testpaper list}
 */
TestCtrl.prototype.getTestList = async function(condition) {
    var result = await MongoDB.find(TEST_TBL, condition);
    return result;
}
/**
 * 提取key，主要是两个key {userId:5, tName:'the second world war'}
 * @param test {userId:5, tCategory:'history'}
 * @return {err, data: testpaper list}
 */
TestCtrl.prototype.getCondition = function(test) {
    return {userId: test.userId, tName: test.tName};
}
/*************************BEGIN 判断接口 *************************/
TestCtrl.prototype.exist = async function(test2create) {
    var exist = false;
    var condition = this.getCondition(test2create);

    var result = await MongoDB.findOne(TEST_TBL, condition);
    logger.error('exist?result ', result);
    if (result.err) {
        logger.error('find record failed, err ', result.err, 'condition ', condition);
    } else if (result.data) {
        exist = true;
    }
    return exist;
}



/*************************BEGIN oper接口 *************************/
/**
 * 创建一个新的题库
 * @param test2create 
 * 必选参数: {userId:5, tCategory:'history',tName:'the second world war', tType:'bank'} 
 * 可选参数: {qIdList:[1,2,3,4,5]}
 * @return {err}
 */
TestCtrl.prototype.create = async function(test2create) {
    if (!test2create.userId || !test2create.tCategory 
        || !test2create.tName || !test2create.tType)
    {
        logger.error('test2create field not completed ', test2create);
        return Error('test2create field not completed');
    }
    var isexist = await this.exist(test2create);
    if (isexist) {
        return Error('test2create already exist');
    }
    var test = test2create;
    test.testId = ++this.generateId;
    var result = await MongoDB.save(TEST_TBL, test);
    if (result.err) {
        logger.error('test2create save failed，err ', result.err);
    }
    return result.err;
}

/**
 * 删除一个题库
 * @param condition 
 * 必选参数: {userId:5, tName:'the second world war'}
 * @return {err}
 */
TestCtrl.prototype.remove = async function(condition) {
    //这两个参数可以唯一确定一个题库
    if (!condition.userId || !condition.tName)
    {
        logger.error('condition field not completed ', condition);
        return Error('condition field not completed');
    }
    
    var result = await MongoDB.remove(TEST_TBL, condition);
    if (result.err) {
        logger.error('TestPaper remove failed, err ', result.err, 'condition ',condition);
    }
    return result.err;
}

/**
 * 修改category
 * @param condition 
 * 必选参数: {userId:5, tCategory:'history'}，可以修改所有这个category的记录
 * 可选参数：可选参数用于更精准的定位需要修改的记录，可自行添加。如只要修改一个记录，就提供{tName:'the second world war'}
 * @param category string 'history'  -->  'math'
 * @return {err}
 */
TestCtrl.prototype.modifyCategory = async function(condition, category) {
    //userId and category 用来定位一个类别
    if (!condition.userId || !condition.tCategory)
    {
        logger.error('condition field not completed ', condition);
        return Error('condition field not completed');
    }
    var result = await MongoDB.update(TEST_TBL, condition,{tCategory:category});
    if (result.err) {
        logger.error('TestPaper remove failed, err ', result.err, 'condition ',condition);
    }
    return result.err;
}
/**
 * 修改name
 * @param condition 
 * 必选参数: {userId:5, tName:'the second world war'}，可以修改所有这个记录的name
 * @param name string 'second world war'  -->  'first world war'
 * @return {err}
 */
TestCtrl.prototype.modifyName = async function(condition, name) {
    //userId and category 用来定位一个类别
    if (!condition.userId || !condition.tName)
    {
        logger.error('condition field not completed ', condition);
        return Error('condition field not completed');
    }
    var result = await MongoDB.update(TEST_TBL, condition,{tName:name});
    if (result.err) {
        logger.error('TestPaper remove failed, err ', result.err, 'condition ',condition);
    }
    return result.err;
}

/**
 * 修改某个记录的type，比如从'bank' 修改到'test'
 * @param condition 
 * 必选参数: {userId:5, tName:'the second world war'}，可以修改所有这个记录的type
 * @param type string 'bank' --> 'test'
 * @return {err}
 */
TestCtrl.prototype.modifyType = async function(condition, type) {
    //userId and category 用来定位一个类别
    if (!condition.userId || !condition.tName)
    {
        logger.error('condition field not completed ', condition);
        return Error('condition field not completed');
    }
    var result = await MongoDB.update(TEST_TBL, condition,{tType:type});
    if (result.err) {
        logger.error('TestPaper remove failed, err ', result.err, 'condition ',condition);
    }
    return result.err;
}


/**
 * 向题库中添加题目列表
 * @param condition {userId:5, tCategory:'history',tName:'the second world war', tType:'bank'} 
 * @param addlist [1,3,4,7]
 * @return {err}
 */
TestCtrl.prototype.addQuestions = async function(condition, addlist) {
    var result = await MongoDB.updateData(TEST_TBL, condition, 
                    {$addToSet:{"qIdList":{$each:addlist}}});
    if (result.err) {
        logger.error('TestPaper record not exist, condition: ', condition);
    }
    return result.err;
}
function inarray(x, array) {
    for (let i = 0; i < array.length; i++) {
        if (x == array[i]) return true;
    }
    return false;
}

/**
 * 向题库中删除题目列表
 * @param condition {userId:5, tCategory:'history',tName:'the second world war', tType:'bank'} 
 * @param dellist [1,3,4,7]
 * @return {err}
 */
TestCtrl.prototype.delQuestions = async function(condition, dellist) {
    if (0 == dellist.length) {
        return Error('TestPaper delquestion input err, dellist ', dellist);
    }
    var result = await MongoDB.find(TEST_TBL, condition);
    if (result.err) {
        logger.error('TestPaper find failed, condition: ', condition);
        return result.err;
    }else if (!result.data) {
        logger.error('TestPaper record not exist, condition: ', condition);
        return Error('record not exist');
    }
    
    var oldlist = result.data[0].qIdList;
    if (0 == oldlist.length) {
        return Error('TestPaper qIdList is empty');
    }
    var newlist = [];
    oldlist.forEach(element => {
        if (!inarray(element, dellist)) newlist.push(element);
    });

    result = await MongoDB.updateData(TEST_TBL, condition, 
                    {$set:{"qIdList":newlist}});
    if (result.err) {
        logger.error('TestPaper record not exist, condition: ', condition);
    }
    return result.err;
}



module.exports = new TestCtrl();