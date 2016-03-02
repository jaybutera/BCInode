/**
 *  @abstract
 */

function Bci (options) {
    // Bci is an abstract base class
    if (this.constructor === Bci) {
        throw new Error("Can't instantiate abstract class bci!");
    }

    this.verbose = options['verbose']; // Boolean
    this.save    = options['save_db'];

    this.connect = function () {
        throw new Error('Abstract method!');
    };

    this.stream = function () {
        throw new Error('Abstract method!');
    };

    this.stop = function () {
        throw new Error('Abstract method!');
    };

    this.disconnect = function () {
        throw new Error('Abstract method!');
    };

    this.createBCI = function (options) {
        throw new Error('Abstract method!');
    };
}

module.exports = Bci;
