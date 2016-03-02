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
    this.connect = function () {
        return new Promise ( function (fulfill, reject) {
            init( function (err) {
                if (err) {
                    board.connect('COM3', function (err) {
                        if (err) {
                            return reject(err);
                        } else {
                            return fulfill(null);
                        }
                    });
                } else {
                    console.log('Success!');
                    return fulfill(null);
                }
            });
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

    var init = function (cb) {
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
