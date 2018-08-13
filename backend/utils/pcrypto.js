var crypto = require("crypto");


exports.sha256 = function(data) {
    var sha256 = crypto.createHash('sha256');
    return sha256.update(data).digest('hex');
}
