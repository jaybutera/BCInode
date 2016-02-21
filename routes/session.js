var express = require('express');
var router = express.Router();
// FFT
var simple_fft = require('../lib/nodejs-simple-fft/simple-fft');
//var Stft = require('../lib/analysis/stft');
// OpenBCI serial module
var BCIstreamer = require('../lib/openBCI');
var streamer;
// Matrix module
var math = require('mathjs');
// Models
var Sample = require('../models/sample');
var Session = require('../models/session');

var a = require('./API/bci');

var fs = require('fs');

//var st = require('stacktrace-js');

/*
router.get('/new', function (req, res) {
    new_sess = new Session({
        done : false,
        _id  :

    new_sess.save( function (err) {
        if (err) throw err;
    });

});
*/

router.get('/:session/start', function (req, res) {
    streamer = new BCIstreamer(req.params.session, { verbose : false, save_db : true });
    // TODO: Should probably clean this up...
    /*
    streamer.init( function (err) { err
                                        ? streamer.connect('COM3', function (err) { err
                                                                                        ? console.log('chode')
                                                                                        : initialized = true })
                                        : initialized = true });
    */
    /*
    streamer.init( function (err) {
        if (err) {
            streamer.connect('COM3', function (err) {
                if (err) {
                    console.log('chode')
                } else {
                    initialized = true;
                    console.log('Initialized : ' + initialized);
                }
            });
        } else
            initialized = true;
    });

    // Temp
    streamer.start( function (err) { err ? console.log(err) : streaming = true });
    */

    var api = new a(streamer);

    console.log('Calling start');

    api.start(function(err, status) {
        if (err) {
            console.log(err);
        }
        //st.fromError(err).then( sf => { console.log(sf); });
        res.json(status);
    });
});

router.get('/:session/stop', function (req, res) {
    streamer.stop();
});

router.get('/:session/new_fft', function (req, res) {
});

router.get('/:session/fft', function (req, res) {
    var chunkNum = 4;

    Sample.find( { session_id : req.params.session } ).sort('-date').limit(chunkNum).exec( function (err, chunks) {
        if (typeof chunks == 'undefined' || chunks.length == 0) {
            console.log('Error: No sample chunks found with session id - ' + req.params.session);
            res.json( {fft:[]} );
            return;
        }

        var channs = [];
        //console.log(chunks[0].toObject().values[0].channel);

        // For each chunk
        for (chunk in chunks) {
            var chunk_obj = chunks[chunk].toObject();

            // For each data point in the chunk
            for (samp in chunk_obj.values) {
                var sample = chunk_obj.values[samp];

                channs.push( sample.channel.slice() );
            }
        }
        var samp_mat = math.transpose( math.matrix(channs) );

        //console.log(samp_mat._data[6]);
        sfft = simple_fft(samp_mat._data[0]);
        //console.log(sfft);

        res.json( { fft : sfft } );
    });
});

module.exports = router;
