require('should');

let path = require('path');
let countLines = require('..');

describe('countLines', function () {

    it('should count 6 lines', function () {
        return countLines(path.join(__dirname, 'dummy.log'))
            .then(nLines => {
                nLines.should.be.exactly(6);
            });
    });
});
