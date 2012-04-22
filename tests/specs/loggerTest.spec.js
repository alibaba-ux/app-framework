// Load the file to test here.
//
// classTest:
importJS("lib/core.js");
importJS("lib/unitest/loggerTest.js");

var log1=new test.logger1();

describe("logger instance inject test", function () {
    it("check the logger name spance", function () {
        expect(log1.getLoggerInstance().name()).toEqual('test.logger1');
    });

    it('have log method',function() {
    	expect(typeof log1.getLoggerInstance().log).toEqual('function');
    });

    it('have info method',function() {
    	expect(typeof log1.getLoggerInstance().info).toEqual('function');
    });

    it('have debug method',function() {
    	expect(typeof log1.getLoggerInstance().debug).toEqual('function');
    });

    it('have warn method',function() {
    	expect(typeof log1.getLoggerInstance().warn).toEqual('function');
    });

    it('have error method',function() {
    	expect(typeof log1.getLoggerInstance().error).toEqual('function');
    });
});

describe("logger static instance inject test", function () {
	it("check the static logger name space", function () {
        expect(test.logger2.logger.name()).toEqual('test.logger2');
    });
});