// Load the file to test here.
//
// classTest:
importJS("lib/core.js");
importJS("lib/unitest/classTest.js");

var myclassInstance=new ali.openpf.classTest();

describe("classTest", function () {
    it("check the uid", function () {
        expect(myclassInstance.getUid()).toEqual(myclassInstance.uid);
    });
});
