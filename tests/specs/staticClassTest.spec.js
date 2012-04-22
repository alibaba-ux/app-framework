// Load the file to test here.
//
// classTest:
importJS("lib/core.js");
importJS("lib/unitest/staticClassTest.js");
var cls=new te.staticClass();

var cls2=new te.staticClass2();

describe("static class define test", function () {
	it("check static class define way work", function () {
        expect(cls.helloWorld()).toEqual(te.staticClass.helloWorld());
    });
});

describe("static class define test and also class inherit", function () {
    it("check the class inherit, prototype method inherit", function () {
        expect(cls2.helloWorld()).toEqual(cls.helloWorld());
    });

    it("cls2 instance have method helloWorld2 ", function () {
        expect(!!cls2.helloWorld2).toEqual(true);
    });

    it("te.staticClass2 have method helloWorld2 ", function () {
        expect(!!te.staticClass2.helloWorld2).toEqual(true);
    });

    it("check helloWorld2 static method and prototype method ", function () {
        expect(cls2.helloWorld2()).toEqual(te.staticClass2.helloWorld2());
    });
    
    it("static method currently do not inherit, do we need support it? .", function () {
        expect(te.staticClass2.helloWorld).toEqual(undefined);
    });
    
    
});