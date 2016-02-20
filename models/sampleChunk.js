var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Sample = require('./sample');

var sampleChunkSchema = new Schema ({
    date : { type : Date, default : Date.now },
    //date : Date,
    session_id : String,
    //values : [ Sample ],
    values : [ {
        number : Number,
        channel : Array,
        aux_x : Number,
        aux_y : Number,
        aux_z : Number,
    } ] ,
}, { collection : 'samples' });

module.exports = mongoose.model('sampleChunk', sampleChunkSchema);
