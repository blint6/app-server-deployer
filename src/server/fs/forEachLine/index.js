module.exports = function forEachLine(cb) {

    let byteArray = [];
    let finished = false;

    return function (chunk) {
        if (finished) throw Error('Already closed');

        if (arguments.length === 0) {
            cb(new Buffer(byteArray).toString());
            finished = true;
        } else {
            for (let i = 0; i < chunk.length; i += 1) {
                // \r symbol to be removed/ignored
                if (chunk[i] === 13) continue;

                // \n Symbol
                if (chunk[i] === 10) {
                    cb(new Buffer(byteArray).toString());
                    byteArray = [];
                }
                else
                    byteArray.push(chunk[i]);
            }
        }
    };
};
