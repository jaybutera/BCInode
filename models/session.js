var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var sessionSchema = new Schema ({
    score : Number,
    done  : Boolean,
    _id   : String,
}, { collection : 'sessions' });

module.exports = mongoose.model('session', sessionSchema);
