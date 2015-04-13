require('should');

let path = require('path');
let tailFile = require('..');
let dummyLogPath = path.join(__dirname, 'dummy.log');
let notExistsLogPath = path.join(__dirname, 'notExistsLog.log');

describe('tailFile', function () {

    it('should fetch the 3 last lines of the test file', function () {
        return tailFile(dummyLogPath, 3)
            .then(lines => {
                lines.should.instanceOf(Array);
                lines.length.should.be.exactly(3);

                lines[0].should.have.property('id', 4);
                lines[0].should.have.property('content', 'A');

                lines[1].should.have.property('id', 5);
                lines[1].should.have.property('content')
                lines[1].content.should.match(/^Lorem ipsum/);

                lines[2].should.have.property('id', 6);
                lines[2].should.have.property('content', 'EOF');
            });
    });

    it('should fetch 2 lines from line #3', function () {
        return tailFile(dummyLogPath, 3, 2)
            .then(lines => {
                lines.should.instanceOf(Array);
                lines.length.should.be.exactly(2);

                lines[0].should.have.property('id', 2);
                lines[0].should.have.property('content')
                lines[0].content.should.match(/^Vivamus fermentum/);

                lines[1].should.have.property('id', 3);
                lines[1].should.have.property('content', 'Now generating random lines');
            });
    });

    it('should fetch nothing as we are after the log', function () {
        return tailFile(dummyLogPath, 30, 2)
            .then(lines => {
                lines.should.instanceOf(Array);
                lines.length.should.be.exactly(0);
            });
    });

    it('should fetch nothing as we want 0 lines', function () {
        return tailFile(dummyLogPath, 0)
            .then(lines => {
                lines.should.instanceOf(Array);
                lines.length.should.be.exactly(0);
            });
    });

    it('should fetch nothing as we want 0 lines, even from an actual ID', function () {
        return tailFile(dummyLogPath, 2, 0)
            .then(lines => {
                lines.should.instanceOf(Array);
                lines.length.should.be.exactly(0);
            });
    });

    it('should fail on problematic files', function () {
        return tailFile(notExistsLogPath, 3)
            .then(() => {
                throw Error('The file does not exist, we should not have fetch lines!');
            }, () => {
                // Good, failed properly
            });
    });
});
