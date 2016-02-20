var shortTimeFT = require('stft');
var Fft = require('../../models/fft');

function freqMag (re, im) {
    /*
    console.log('Real : ' + re);
    console.log('Imag : ' + im);
    */

    psd = [];
    for (i in re)
        psd.push( (re[i]*re[i] + im[i]*im[i]) / this.frame );

    fft_doc = new Fft ({
        psd : psd.slice(),
    });

    fft_doc.save( function(err) {
        if (err) throw err;
    });
}

function stft (frame_size) {
    this.frame = frame_size;

    return shortTimeFT(1, frame_size, freqMag);
}

module.exports = stft;
