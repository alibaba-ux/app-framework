#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    sys = require('util'),
    os = require('os');

var less = require('../lib/less');

//USER CONFIGURATION
var requireLess=['../base.less',
                 //'../widgets/form/form.less',
				 //'../widgets/singlestack/singlestack.less',
				 '../widgets/navbar/navbar.less',
				 '../widgets/alibar/alibar.less',
				 '../widgets/thirdbanner/thirdbanner.less',
				 '../modules/common.less',
				 '../modules/welcomepage.less',
				 '../main.less'];

var config={
  folder:'../output',
  cssname:'core.css'
}

var readfile=function() {
  var data="";
  for(var i=0;i<requireLess.length;i++){
	  data+=fs.readFileSync(requireLess[i]);
  }
  return data;
};

var options = {
    compress: true,
    yuicompress: false,
    optimization: 1,
    silent: false,
    paths: [],
    color: true,
    strictImports: false
};


//copy from https://github.com/majorye/less.js/blob/master/bin/lessc and do some modification
var css, fd, tree;
var parseLessFile = function (e, data) {
    if (e) {
        sys.puts("lessc: " + e.message);
        process.exit(1);
    }

    new(less.Parser)({
        paths: [],
        optimization: options.optimization,
        filename: '',
        strictImports: options.strictImports
    }).parse(data, function (err, tree) {
        if (err) {
            less.writeError(err, options);
            process.exit(1);
        } else {
            try {
                css = tree.toCSS({
                    compress: options.compress,
                    yuicompress: options.yuicompress
                });
                if (config.folder) {
				    try{
						fs.mkdirSync(config.folder);
					    fs.unlinkSync(config.folder+"/"+config.cssname);
					}catch(e){
					  //do nothing
					}
                    fd = fs.openSync(config.folder+"/"+config.cssname, "w");
                    fs.writeSync(fd, css, 0, "utf8");
					sys.print('success!!');
                } else {
                    sys.print(css);
                }
            } catch (e) {
                less.writeError(e, options);
            }finally{
			  process.exit(2);
			}
        }
    });
};

function main() {
  var data=readfile();
  parseLessFile(false,data);
}

main();








