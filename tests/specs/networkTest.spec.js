
importJS("lib/core.js");
importJS("lib/unitest/networkTest.js");

describe("networkTest", function () {
    it("calls the addDataToDOM function on success", function () {
        te.networkTest.makeRequest(); // Make the AJAX call

        spyOn(te.networkTest, "addDataToDOM"); // Add a spy to the callback

        mostRecentAjaxRequest().response({status: 200, responseText: "foo"}); // Mock the response

        expect(te.networkTest.addDataToDOM).toHaveBeenCalledWith("foo");
    });
});
