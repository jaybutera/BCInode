var openBCI = require('./openBCI');

module.exports = {
    createOpenBCI : function (options) {
                        return new openBCI(options);
                    }
}
