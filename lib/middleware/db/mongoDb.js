var Db = require('./db');
var mongoose = require('mongoose');

module.exports = function (options) {
    this.connect_path = options['path'];

    // If no connection path specified, default top level
    if (!connect_path)
        connect_path = 'mongodb://localhost/minDb';

    mongoose.connect(connect_path);

    return mongoose;
}
