var bciFactory = require('../bci/bciFactory');

var bciControl = function (options) {
    var bci; // BCI interface object

    bci_options = {
        'verbose' : options['verbose'],
        'save_db' : options['save_db'],
    };

    switch ( options['bci'] ) {
        case 'openBCI':
            bci = bciFactory.createOpenBCI(bci_options);
            break;
    }

    this.init = function (cb) {
        bci.init( function (err) { err => {
            // If no board found, try manual connection
            if (err) {
                bci.connect('COM3', function (err) {
                });
            }

            // Return error (null or existent)
            cb(err);
            };
        });
    };

    this.start = function (cb) {
        bci.stream().then( err => {
            cb(null);
        }).catch( err => { cb(err) } );
    };

    this.stop = function (cb) {
        /*
        bci.stop().then( err => {
            cb(null);
        }).catch( err => { cb(err) } );
        */
        bci.stop( err => {
            cb(err);
        });
    };

    this.stop = function (cb) {
        bci.close( err => {
            cb(err);
        });
    };
};
