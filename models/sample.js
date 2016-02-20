var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sampleSchema = new Schema ({
    number : Number,
    channel : Array,
    aux_x : Number,
    aux_y : Number,
    aux_z : Number,
});
//}, { collection : 'samples' });

module.exports = mongoose.model('sample', sampleSchema);
