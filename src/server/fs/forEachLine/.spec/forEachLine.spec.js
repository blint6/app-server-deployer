require('should');

let forEachLine = require('..');

describe('forEachLine', function () {

    let lines = [];
    let handler = forEachLine(line => lines.push(line));

    it('should return a function that reads incoming buffers line by line. No arg for flush', function () {
        handler(new Buffer('Sending some da'));
        handler(new Buffer('ta\nWith\r\nmultiple\nnewlines'));
        handler(new Buffer('.\r\n'));
        handler(new Buffer('\n'));
        handler(new Buffer('That\'s all folks!'));
        handler();

        lines.should.eql(['Sending some data', 'With', 'multiple', 'newlines.', '', 'That\'s all folks!']);
    });

    it('should throw an error while reading data whereas the handler is already closed', function () {
        handler.bind(null, new Buffer('unexpected')).should.throwError();
    });
});
