//var Bci = require('./bci');
var BCI = require('openbci-sdk');
OpenBCISample = BCI.OpenBCISample;

var OpenBCI = function (options) {
    var board = new BCI.OpenBCIBoard();

    //Bci.apply(this, arguments); // Initialize parent members

    // User options
    var verbose = options['verbose']; // Boolean
    var save    = options['save_db'];

    /*
    if (save) {
        var sampDb = new SampDb(250, session);
    }
    */

    // Wraps init()
    this.connect = function (port) {
        return new Promise ( function (fulfill, reject) {
            // If port name is specified, direct initialization
            if (port !== undefined) {
                manualInit(port, err => {
                    if (err) {
                        return reject(err);
                    }
                    return fulfill(null);
                });
            }
            // Otherwise find the port
            else {
                autoInit( function (err) {
                    if (err) {
                        return reject(err);
                    }
                    return fulfill(null);
                });
            }
        });
    }

    this.stream = function () {
        return new Promise ( function (fulfill, reject) {
            board.startStream( function (err) {
                if (err) {
                    return reject(err);
                } else {
                    return fulfill();
                }
            });
        });
    };

    this.stop = function (cb) {
        if (verbose)
            console.log('[Command] Halt streaming and disconnect');
        //board.streamStop().then(board.disconnect());
        board.streamStop()
            .then(cb(null))
            .catch(err => { cb(err) });
    };

    this.close = function (cb) {
        // Check the stream is not running
        board.streamStop()
            .then(function () {
                board.disconnect();
                cb(null);
            })
            .catch(err => {
                board.disconnect()
                cb(err);
            });
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

    var autoConnect = function (cb) {
        board.autoFindOpenBCIBoard().then(portname => {
            if( portname ) {

                if (verbose) {
                    console.log('Board connecting on path: ' + portname);
                }

                board.connect(portname).then( function() {
                    return cb(null);
                }).catch( err => {
                    return cb(err);
                });
            } else {
                var err = new ReferenceError();
                err.message = "Can't find board in options:\n" + portname;
                return cb(err); // Return error with list of portnames on failure
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

    var manualConnect = function (port, cb) {
        board.connect(port, function (err) {
            if (err) {
                return cb(err);
            }
            return cb(null);
        });
    };

    var startStream = function (cb) {
        board.on('ready', function () {
            board.streamStart();

            board.on('sample', function (sample) {
                //if (save) {
                    // Convert channelData object to array
                    /*
                    var channelData = [];
                    //var scaleFac = 0.02235;

                    for (i in sample.channelData) {
                        channelData.push( sample.channelData[i]); // Mult by scale factor
                    }
                    */

                    /*
                    sampDb.push( new Sample({
                        number : sample.sampleNumber,
                        channel : sample.channelData.slice(),
                        aux_x : sample.auxData[0],
                        aux_y : sample.auxData[1],
                        aux_z : sample.auxData[2],
                    }));
                    */
                //}

                if (verbose) {
                    OpenBCISample.debugPrettyPrint(sample);
                }

                // Successful stream start
                cb(null, sample);
            });
        });
    };
};

//OpenBCI.prototype = new Bci(); // set up inheritance relation

/*
module.exports = function (options) {
    return new OpenBCI(options);
}
*/
module.exports = OpenBCI;
