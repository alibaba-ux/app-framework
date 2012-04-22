importJS("lib/core.js");
importJS("lib/unitest/classInheritTest.js");

var f=new test.class3();

describe("class inherit test", function () {
    it("check the uid", function () {
        expect(f.getUid()).toEqual(f.uid);
    });

    it("check the age", function () {
        expect(f.getAge()).toEqual(f.age);
    });

    it("check the name", function () {
        expect(f.getName()).toEqual(f.name);
    });



});
