/**
 * mongoose操作类(封装mongodb)
 */

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var logger = require('../utils/plog').dlogger;

var options = {
    //db_user: "rao",
    //db_pwd: "123456",
    db_host: "127.0.0.1",
    db_port: 27017,
    db_name: "mongotest"
};

//var dbURL = "mongodb://" + options.db_user + ":" + options.db_pwd + "@" + options.db_host + ":" + options.db_port + "/" + options.db_name;
var dbURL = "mongodb://" + "@" + options.db_host + ":" + options.db_port + "/" + options.db_name;
//mongoose.connect(dbURL);


mongoose.connection.on('connected', function (err) {
    if (err) logger.error('Database connection failure');
});

mongoose.connection.on('error', function (err) {
    logger.error('Mongoose connected error ' + err);
});

mongoose.connection.on('disconnected', function () {
    logger.error('Mongoose disconnected');
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        logger.info('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

var DB = function () {
    this.mongoClient = {};
    //var filename = path.join(path.dirname(__dirname).replace('app', ''), 'config/table.json');
    var filename = path.join(__dirname, 'table.json');
    logger.info('table json filename -- ', filename);
    this.tabConf = JSON.parse(fs.readFileSync(path.normalize(filename)));
};
DB.prototype.connect = function(callback) {
    mongoose.connect(dbURL, callback);
}
DB.prototype.disconnect = function() {
    mongoose.disconnect(function(){
        logger.info('mongoose disconnect success.');
    })
}
/**
 * 初始化mongoose model
 * @param table_name 表名称(集合名称)
 */
DB.prototype.getModel = function (table_name) {
    if (!table_name) return;
    if (!this.tabConf[table_name]) {
        logger.error('No table structure');
        return false;
    }

    var client = this.mongoClient[table_name];
    if (!client) {
        //构建用户信息表结构
        var nodeSchema = new mongoose.Schema(this.tabConf[table_name]);

        //构建model
        client = mongoose.model(table_name, nodeSchema, table_name);

        this.mongoClient[table_name] = client;
    }
    return client;
};

/**
 * 保存数据
 * @param table_name 表名
 * @param fields 表数据
 * @param callback 回调方法
 */
DB.prototype.save = async function (table_name, fields, callback) {
    if (!fields) {
        return {err: Error('Field is not allowed for null'), data: null};
    }

    var err_num = 0;
    for (var i in fields) {
        if (!this.tabConf[table_name][i]) err_num ++;
    }
    if (err_num > 0) {
        return {err: Error('Wrong field name'), data: null};
    }
    var _data = null, _ret = null;
    try {
        var node_model = this.getModel(table_name);
        var mongooseEntity = new node_model(fields);
        _data = await mongooseEntity.save();
    } catch(e) {
        _ret = e.message || e.stack;
    }
    return {err:_ret, data:_data};
};

/**
 * 更新数据
 * @param table_name 表名
 * @param conditions 更新需要的条件 {_id: id, user_name: name}
 * @param update_fields 要更新的字段 {age: 21, sex: 1}
 * @param callback 回调方法
 */
DB.prototype.update = async function (table_name, conditions, update_fields, callback) {
    if (!update_fields || !conditions) {
        return {err: Error('Parameter error'), data: null};
    }
    var _data = null, _ret = null;
    var node_model = this.getModel(table_name);
    try {
        _data = await node_model.update(conditions, {$set: update_fields}, {multi: true, upsert: true, new: true}).exec();
    } catch(e) {
        _ret = e.message || e.stack;
    }
    return {err:_ret, data:_data};
};

/**
 * 更新数据方法(带操作符的)
 * @param table_name 数据表名
 * @param conditions 更新条件 {_id: id, user_name: name}
 * @param update_fields 更新的操作符 {$set: {id: 123}}
 * @param callback 回调方法
 */
DB.prototype.updateData = async function (table_name, conditions, update_fields, callback) {
    if (!update_fields || !conditions) {
        return {err: Error('Parameter error'), data: null};
    }
    var _data = null, _ret = null;
    var node_model = this.getModel(table_name);
    try {
        _data = await node_model.findOneAndUpdate(conditions, update_fields, {multi: true, upsert: true, new: true}).exec();
    } catch(e) {
        _ret = e.message || e.stack;
    }
    return {err:_ret, data:_data};
};

/**
 * 删除数据
 * @param table_name 表名
 * @param conditions 删除需要的条件 {_id: id}
 * @param callback 回调方法
 */
DB.prototype.remove = async function (table_name, conditions, callback) {
    var node_model = this.getModel(table_name);
    var _ret = null, _data = null;
    try {
        _data = await node_model.remove(conditions).exec();
    } catch(e) {
        _ret = e.message || e.stack;
    };
    return {err: _ret, data: _data};
};

/**
 * 查询数据
 * @param table_name 表名
 * @param conditions 查询条件
 * @param fields 待返回字段
 * @param callback 回调方法
 */
DB.prototype.find = async function (table_name, conditions, fields, callback) {
    var node_model = this.getModel(table_name);
    var _data = null, _ret = null;
    try {
        _data = await node_model.find(conditions, fields || null, {}).exec();
    } catch(e) {
        _ret = e.message || e.stack;
    }
    return {err:_ret, data:_data};
};

/**
 * 查询单条数据
 * @param table_name 表名
 * @param conditions 查询条件
 * @param callback 回调方法
 */
DB.prototype.findOne = async function (table_name, conditions, callback) {
    var node_model = this.getModel(table_name);
    var _data = null, _ret = null;
    try {
        _data = await node_model.findOne(conditions).exec();
    } catch(e) {
        _ret = e.message || e.stack;
    }
    return {err:_ret, data:_data};
};
/**
 * 根据_id查询指定的数据
 * @param table_name 表名
 * @param _id 可以是字符串或 ObjectId 对象。
 * @param callback 回调方法
 */
DB.prototype.findById = async function (table_name, _id, callback) {
    var node_model = this.getModel(table_name);
    var _data = null, _ret = null;
    try {
        _data = await node_model.findById(_id).exec();
    } catch(e) {
        _ret = e.message || e.stack;
    }
    return {err:_ret, data:_data};
};

/**
 * 返回符合条件的文档数
 * @param table_name 表名
 * @param conditions 查询条件
 * @param callback 回调方法
 */
DB.prototype.count = async function (table_name, conditions, callback) {
    var node_model = this.getModel(table_name);
    var _data = null, _ret = null;
    try {
        _data = await node_model.count(conditions).exec();
    } catch(e) {
        _ret = e.message || e.stack;
    }
    return {err:_ret, data:_data};
};

/**
 * 查询符合条件的文档并返回根据键分组的结果
 * @param table_name 表名
 * @param field 待返回的键值
 * @param conditions 查询条件
 * @param callback 回调方法
 */
DB.prototype.distinct = async function (table_name, field, conditions, callback) {
    var node_model = this.getModel(table_name);
    var _data = null, _ret = null;
    try {
        _data = await node_model.distinct(field, conditions).exec();
    } catch(e) {
        _ret = e.message || e.stack;
    }
    return {err:_ret, data:_data};
};

/**
 * 连写查询
 * @param table_name 表名
 * @param conditions 查询条件 {a:1, b:2}
 * @param options 选项：{fields: "a b c", sort: {time: -1}, limit: 10}
 * @param callback 回调方法
 */
DB.prototype.where = async function (table_name, conditions, options, callback) {
    var node_model = this.getModel(table_name);
    var _data = null, _ret = null;
    try {
        _data = await node_model.find(conditions)
        .select(options.fields || '')
        .sort(options.sort || {})
        .limit(options.limit || {})
        .exec();
    } catch(e) {
        _ret = e.message || e.stack;
    }
    return {err:_ret, data:_data};
};

module.exports = new DB();