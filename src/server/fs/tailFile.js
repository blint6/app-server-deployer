let fs = require('fs');
let Promise = require('es6-promise').Promise;

function tailFile(file, n) {
    return new Promise((resolve, reject) => {
        let lineCount = 0,
            bufList = [],
            tailBufs = [];

        function pushLine() {
            lineCount += 1;
            tailBufs.push(Buffer.concat(bufList));
            bufList = [];

            if (tailBufs.length > n)
                tailBufs.shift();
        }

        fs.createReadStream(file)

        .on('data', function(chunk) {
            let lastNewLine = 0;

            for (let i = 0; i < chunk.length; i += 1) {
                // Line Symbol
                if (chunk[i] === 10) {
                    bufList.push(chunk.slice(lastNewLine, i));
                    pushLine();
                    lastNewLine = i + 1;
                }
            }

            // Keep the end of current chunk
            if (lastNewLine < chunk.length) {
                bufList.push(chunk.slice(lastNewLine, chunk.length));
            }
        })

        .on('end', function() {
            // Push the remaining data as a line
            if (bufList.length)
                pushLine();

            let lines = tailBufs.map((buf, i) => ({
                id: lineCount - n + i + 1,
                content: buf.toString('utf8')
            }));

            resolve(lines);
        })

        .on('error', function(err) {
            console.error('Could not tail', n, 'lines for', file, err);
            reject(err);
        });
    });
}

module.exports = tailFile;
