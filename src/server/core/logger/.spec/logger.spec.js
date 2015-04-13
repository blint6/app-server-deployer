require('should');

let winston = require('winston');
let Logger = winston.Logger;
let log = require('..');

describe('spec logger', function () {

    it('should have console log when in specs mode', function () {
        log.debug.should.be.instanceOf(Function);
        log.info.should.be.instanceOf(Function);
        log.warn.should.be.instanceOf(Function);
        log.error.should.be.instanceOf(Function);
    });

    it('should not break on empty args', function () {
        log.debug();
        log.info();
        log.warn();
        log.error();
    });
});

describe('prod logger', function () {

    it('production logger should be a winston Logger', function () {
        log.getProdLogger().should.be.instanceOf(Logger);
    });
});
