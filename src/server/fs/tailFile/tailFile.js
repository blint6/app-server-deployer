let fs = require('fs');
let Promise = require('es6-promise').Promise;

function tailFile(file, fromId, nLines) {

    if (arguments.length < 3) {
        nLines = fromId;
        fromId = 0;
    }

    return new Promise((resolve, reject) => {
        let lineId = 0,
            byteArray,
            tailBufs = [],
            isLineToBeTaken = false;

        function pushLine() {
            if (isLineToBeTaken)
                tailBufs.push(new Buffer(byteArray));

            // If there is no fromId, the following slides the lines window
            if (tailBufs.length > nLines)
                tailBufs.shift();

            byteArray = [];
            lineId += 1;

            if (fromId > 0)
                isLineToBeTaken = lineId > fromId - nLines && lineId <= fromId;
            else
                isLineToBeTaken = true;
        }

        pushLine(); // Init
        let readStream = fs.createReadStream(file);

        readStream
            .on('data', function (chunk) {

                if (fromId > 0 && lineId >= fromId)
                    return readStream.unpipe();

                for (let i = 0; i < chunk.length; i += 1) {
                    // \r Symbol to be removed/ignored
                    if (chunk[i] === 13) continue;

                    // \n Symbol
                    if (chunk[i] === 10)
                        pushLine();
                    else if (isLineToBeTaken)
                        byteArray.push(chunk[i]);
                }
            })

            .on('end', function () {
                // Push the remaining data as a line
                if (byteArray.length)
                    pushLine();

                let totalLines = fromId ? fromId : lineId - 1,
                    lines = tailBufs.map((buf, i) => ({
                        id: totalLines - nLines + i + 1,
                        content: buf.toString('utf8')
                    }));

                resolve(lines);
            })

            .on('error', function (err) {
                console.error('Could not tail', nLines, 'lines for', file, err);
                reject(err);
            });
    });
}

module.exports = tailFile;
