var mongoDb = require('./mongoDb');
var dbFactory = function () {
    var createMongoDb = function (options) {
        return mongoDb(options);
    }
};
