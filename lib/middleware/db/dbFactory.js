var mongoDb = require('./mongoDb');
var sample = require('../../../models/sample');

var dbFactory = function () {
    var createMongoDb = function (options) {
        return mongoDb(options);
    }

    var getSample = function () {
        return sample();
    }
};
