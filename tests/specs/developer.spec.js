describe("open platform developer", function() {

  it("queryString test", function() {
   //window.location.search="?name=jack&greeting=hello-world";
	 var reg = new RegExp('^\\d{3,4}[-]\\d{7,8}([-]{0,1}\\d{0,8})$');
	 var r=reg.test("0832-4602122-741");
     expect(r).toEqual(true); 
  });
})

