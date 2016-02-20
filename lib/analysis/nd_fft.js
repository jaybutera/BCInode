var fft = require('ndarray-fft');
var ndarray = require('ndarray');
var zeros = require('zeros');

module.exports = function (signal) {
    fft(1, ndarray( new Float32Array(signal) ), zeros(signal.length));
};
