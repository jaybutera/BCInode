var BCIstreamer = require('./openBCI');
var streamer;

var BCI = function bci (options) {
    //var BCIstreamer = require('../../lib/openBCI');
    //this.streamer = new BCIstreamer(session, options);

    //this.streamer = strmr;
    this.streamer = new BCIstreamer(options);
}

BCI.prototype.init = function () {
    var strmr = this.streamer;

    return new Promise ( function (fulfill, reject) {
        console.log(this.streamer);
        strmr.init( function (err) {
            if (err) {
                strmr.connect('COM3', function (err) {
                    if (err) {
                        return reject(err);
                    } else {
                        return fulfill();
                    }
                });
            } else {
                console.log('Success!');
                return fulfill();
            }
        });
    });
};

BCI.prototype.stream = function () {
    var strmr = this.streamer;

    return new Promise ( function (fulfill, reject) {
        strmr.start( function (err) {
            if (err) {
                return reject(err);
            } else {
                return fulfill();
            }
        });
    });
};

BCI.prototype.start = function (cb) {
    var status = {'initialized' : false, 'streaming' : false};

    console.log('Initializing...');
    this.init().then( err => {
        /*if (err) {
            console.log(err);
            return cb(err, status);
        } else {*/
            console.log('Initialized!');
            // Successful initialization of BCI board
            status['initialized'] = true;

            // Attempt to stream
            this.stream().then( () => {
                // Stream initialization successful
                status['streaming'] = true;

                return cb(null, status);
            }).catch( err => {
                return cb(err, status);
            });
    }).catch( err => {
        return cb(err, status);
    });
};

module.exports = BCI;
