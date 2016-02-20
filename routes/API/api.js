var express = require('express');
var router = express.Router();
//var Sample = require('../../models/sample');
var stft = require('../../lib/analysis/stft');
var nd_fft = require('../../lib/analysis/nd_fft');
var simple_fft = require('../../lib/nodejs-simple-fft/simple-fft');
var math = require('mathjs');
var BCIstreamer = require('../../lib/openBCI');
var streamer;

router.get('/init', function (req, res) {
    streamer = new BCIstreamer(req.params.session, { verbose : false, save_db : false });
    //streamer.init( function (err) { err ? console.log(err) : console.log('Initialized board.') });

    // TODO: Should probably clean this up...
    streamer.init( function (err) { err
                                        ? streamer.connect('COM3', function (err) { err
                                                                                        ? console.log(err)
                                                                                        : console.log('Connected to COM3.') })
                                        : console.log('Initialized board.')});
    
    // Temp
    streamer.start( function (err) { err ? console.log(err) : console.log('Stream started.') });
});

router.get('/colors', function (req, res) {
    /*
    streamer.init(function (succ) {
        console.log('Init status: ' + succ);
    });
    */

    /*
    setTimeout (function () {
        streamer.start();
    }, 2000);
    */

    //streamer.run();
});

router.get('/done', function (req, res) {
    streamer.stop();
});

router.post('/test/impedance', function (req, res) {
    var test_prof = req.body['channels'];
    streamer.testImped(test_prof, function (err, impedObj) {
        var impeds = [];

        impeds = impedObj.map( function(elem) {
            var chan = {};
            return chan[elem['channel']] = elem['N']['average'];
        });

        res.json(impedObj);
    });
});

router.get('/fft', function (req, res) {
    var bin = 128;

    //Sample.find().sort('-date').limit(bin);
    /*
    Sample.find().sort( { $natural : -1 } ).limit(bin).exec( function (err, samples) {
        var channs = samples.map( function (samp) { return samp.channel } );
        var samp_mat = math.transpose( math.matrix(channs) );

        for (electrode in samp_mat._data) {
            //console.log(samp_mat._data[electrode]);
            console.log('Electrode: ' + electrode);
            console.log(simple_fft(samp_mat._data[electrode]));
            //console.log( new Float32Array(samp_mat[electrode
            //stft.stft( new Float32Array(samp_mat._data[electrode]) );
            //nd_fft(samp_mat._data[electrode]);
            //console.log(samp_mat._data[electrode]);
        }
    });
    */
    /*
    Sample.find( {session_id : } ).sort('-date').limit(bin).exec( function (err, samples) {
    });
    */
});

module.exports = router;
