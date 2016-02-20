var fft = require('fft-js').fft;
var fftUtil = require('fft-js').util;

// Computes (freq, mag) tuple for one bin
function fftTupleBin (bin) {
    var phasors= fft(bin);

    var frequencies = fftUtil.fftFreq(phasors, 8000), // Sample rate and coef is just used for length, and frequency step
        magnitudes  = fftUtil.fftMag(phasors);

    freqs.map( function (f, ix) {
        return {frequency: f, magnitude: magnitudes[ix]};
    });
});

module.exports = {
    fftTuple : function (signal, bin) {
                   if (bin == undefined || bin == null)
                       bin = 
               },
}
