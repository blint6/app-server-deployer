require('should');

let path = require('path');
let countLines = require('..');
let dummyLogPath = path.join(__dirname, 'dummy.log');
let notExistsLogPath = path.join(__dirname, 'notExistsLog.log');

describe('countLines', function () {

    it('should count 6 lines', function () {
        return countLines(dummyLogPath)
            .then(nLines => {
                nLines.should.be.exactly(6);
            });
    });

    it('should fail on problematic files', function () {
        return countLines(notExistsLogPath)
            .then(() => {
                throw Error('The file does not exist, we should not have fetch lines!');
            }, () => {
                // Good, failed properly
            });
    });
});
