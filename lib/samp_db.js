var SampleChunk = require('../models/sampleChunk');

module.exports = function (size, sess) {
    this.session = sess;

    // Private
    var buff = [];
    var frame_size = frameSize(size);

    this.push = function (sample) {
        buff.push(sample);

        // When buffer is filled, save to chunk and flush buffer
        if (buff.length == frame_size) {
            saveChunk(buff.slice() );
            buff = [];
        }
    };

    this.create = function *(size, sess) {
        for (i = 0; i < size; i++) {
            yield (sample) => {
            };
        }
    };

    var saveChunk = function (samples) {
        sampChunk_doc = new SampleChunk ({
            session_id : session,
            values : samples,
        });

        sampChunk_doc.save( function(err) {
            if (err) throw err;
        });
    };

    function frameSize (size) {
        // If frame size is a power of 2
        if (size % 2 == 0) {
            return size;
        } else {
            // Shift to nearest next power of 2
            size--;
            size |= size >> 1;
            size |= size >> 2;
            size |= size >> 4;
            size |= size >> 8;
            size |= size >> 16;
            size++;

            return size;
        }
    };
};
