//****************************************************//
// Implements wrappers for base functionality of bci
// hardware interfacing classes. Allows user to use
// methods independent of hardware option.
//****************************************************//


var bciFactory = require('../bci/bciFactory');

var BciControl = function (options) {
    var bci; // BCI interface object

    var bci_options = {
        'verbose' : options['verbose'],
        'save_db' : options['save_db'],
    };

    switch ( options['bci'] ) {
        case 'openBCI':
            bci = bciFactory.createOpenBCI(bci_options);
            break;
    }

    // Initialize board to be ready to stream raw data
    this.init = function (port, cb) {
        return new Promise ( function (fulfill, reject) {
            bci.connect(port)
               .then( function () { return fulfill(); })
               .catch( err => { return reject(err); });
        });
    };

    // Stream raw data indefinitely
    this.stream = function (cb) {
        return new Promise ( function (fulfill, reject) {
            bci.startStream()
               .then( function () { return fulfill(); })
               .catch( err => { return reject(errr); });
        });
    };

    // Stop streaming raw data
    this.stop = function (cb) {
        return new Promise ( function (fulfill, reject) {
            bci.stopStream( err => {
                if (err) {
                    return reject(err);
                }
                fulfill();
            });
        });
    };
};

exports.bci = function (options) {
    return new BciControl(options);
};
