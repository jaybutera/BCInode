var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var planSchema = new Schema ({
    date      : Date,
    interval  : Number, // Measured in hours
    level     : Number, // 1 being easiest 10 being hardest
    sess_time : Number, // Measured in minutes
    sess_num  : Number, // Total number of session in plan (0 is infinite)
    name      : String,
    description : String,
});

module.exports = mongoose.model('plan', planSchema);
