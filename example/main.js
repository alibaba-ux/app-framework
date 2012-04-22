define(function(require) {

  var log = require('./useLogging');
  console.info(log);
  var f = require('./form');
  console.info(f.data.register());

});
