var Sample = require('../models/sample');
var SampDb = require('./samp_db');
var BCI = require('openbci-sdk');
OpenBCISample = BCI.OpenBCISample;

var BCIBoard = function (options) {
    var board = new BCI.OpenBCIBoard();

    //var session = session; // String
    // User options
    var verbose = options['verbose']; // Boolean
    var save    = options['save_db'];

    if (save) {
        var sampDb = new SampDb(250, session);
    }

    this.init = function (cb) {
        board.autoFindOpenBCIBoard().then(portname => {
            if( portname ) {

                if (verbose) {
                    console.log('Board connecting on path: ' + portname);
                }

                cb(null); // Callback null error

                return board.connect(portname);
            } else {
                var err = new ReferenceError();
                err.message = "Can't find board in options:\n" + portname;
                cb(err); // Return error with list of portnames on failure
            }
        }).catch( function (err) {
                if (verbose) {
                    board.listPorts().then(ports => {
                        console.log(ports);
                    });
                }

                return cb(err);
        });
    };

    this.connect = function (portname, cb) {
        board.connect(portname).then(err => {
            return cb(err);
        });
    };

    this.start = function (session, cb) {
        startStream(session, cb);
    };

    this.stop = function () {
        if (verbose)
            console.log('[Command] Halt streaming and disconnect');
        board.streamStop().then(board.disconnect());
    };

    this.close = function () {
        board.streamStop().then(board.disconnect());
    };

    this.testImped = function (test_prof, cb) {
        startStream();

        chan_num = 8; // Number of channels

        // Operational error handling
        if (test_prof.length != chan_num) {
            err = new TypeError();
            err.message = 'Test configuration array is length ' + test_prof + ', not ' + chan_num;

            return cb(err, null);
        }

        board.once('impedanceArray', impedanceArray => {
            return cb(null, impedanceArray);
        });

        console.log('Testing impedance w/ profile: ' + test_prof);
        board.impedanceTestChannels(test_prof);
        //board.impedanceTestChannel(1)
            /*
            .then(impedObj => {
                console.log('Done processing: ' + impedObj);

                //return cb(null, impedObj);
            }).catch(err => { return cb(err, null) });
            */
    };

    // PRIVATE

    var startStream = function (session, cb) {
        board.on('ready', function () {
            board.streamStart();

            board.on('sample', function (sample) {
                if (save) {
                    // Convert channelData object to array
                    /*
                    var channelData = [];
                    //var scaleFac = 0.02235;

                    for (i in sample.channelData) {
                        channelData.push( sample.channelData[i]); // Mult by scale factor
                    }
                    */

                    if (!session) {
                    }

                    sampDb.push( new Sample({
                        number : sample.sampleNumber,
                        channel : sample.channelData.slice(),
                        aux_x : sample.auxData[0],
                        aux_y : sample.auxData[1],
                        aux_z : sample.auxData[2],
                    }));
                }

                if (verbose) {
                    OpenBCISample.debugPrettyPrint(sample);
                }
            });

            // Successful stream start
            cb(null);
        });
    };
};

module.exports = BCIBoard;
