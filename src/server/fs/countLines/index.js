let fs = require('fs');
let Promise = require('es6-promise').Promise;

function countLines(file) {
    return new Promise((resolve, reject) => {
        let count = 1;

        fs.createReadStream(file)

        .on('data', function(chunk) {
            for (let i = 0; i < chunk.length; i += 1)
                if (chunk[i] === 10) count += 1;
        })

        .on('end', function() {
            resolve(count);
        })

        .on('error', function(err) {
            console.error('Could not count lines of', file, err);
            reject(err);
        });
    });
}

module.exports = countLines;
