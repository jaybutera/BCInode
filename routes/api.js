var express = require('express');
var router = express.Router();
//var Sample = require('../../models/sample');
var stft = require('../lib/analysis/stft');
var nd_fft = require('../lib/analysis/nd_fft');
var simple_fft = require('../lib/nodejs-simple-fft/simple-fft');
var math = require('mathjs');
var bci = require('../lib/middleware/bciControl').bci(
        { verbose : false,
          save_db : false,
          bci : 'openBCI',
        });

// Initialize bci board
router.get('/init', function (req, res) {
    var stat = {
        'initialized' : false,
        'error' : null,
    };

    bci.init()
        .then( function () {
            stat['initialized'] = true;
            return res.json(stat);
        })
        .catch( err => {
            stat['error'] = err;
            return res.json(stat);
        });
});

// Stream raw data from bci board
router.get('/start', function (req, res) {
    var stat = {
        'streaming' : false,
        'error' : null,
    };

    bci.stream()
        .then( function () {
            stat['streaming'] = true;
            return res.json(stat);
        })
        .catch( err => {
            stat['error'] = err;
            return res.json(stat);
        });
});

// Stop bci raw data stream
router.get('/stop', function (req, res) {
    var stat = {
        'stopped' : false,
        'error' : null,
    };

    bci.stop()
        .then( function () {
            stat['stopped'] = true;
            return res.json(stat);
        })
        .catch( err => {
            stat['error'] = err;
            return res.json(stat);
        });
});

// Close serial connection to bci board
router.get('/close', function (req, res) {
    bci.close();
});

// Test electrode impedance on bci given channel specification array.
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
