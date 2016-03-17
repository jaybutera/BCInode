var express = require('express');
var router = express.Router();
// FFT
var simple_fft = require('../lib/nodejs-simple-fft/simple-fft');
//var Stft = require('../lib/analysis/stft');
// Matrix module
var math = require('mathjs');
// Models
//var Sample = require('../lib/middleware/db/schemas').sample;
var Session = require('../models/session');
var bci = require('../lib/middleware/bciControl').bci(
        { verbose : false,
          save_db : true,
          bci : 'openBCI',
        });

//var api = new require('../lib/bci')({ verbose : false, save_db : true });;

var fs = require('fs');

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

// Start raw data streaming session
router.get('/:session/start', function (req, res) {
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

router.get('/:session/stop', function (req, res) {
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
