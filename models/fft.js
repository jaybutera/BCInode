var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fftSchema = new Schema ({
    date : Date,
    magnitude : Array,
}, { collection : 'fft' } );

module.exports = mongoose.model('fft', fftSchema);
