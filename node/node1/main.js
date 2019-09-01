var fs = require('fs');
var path = require('path')
function copy(src, dst) {
		fs.writeFileSync(dst, fs.readFileSync(src));
		//   fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}

function main(argv) {
    copy(argv[0], argv[1]);
}

//main(process.argv.slice(2));

var arr = ['a', {b: 'bb'}]
var arr1 = arr.slice()
arr1[1].b = 'aa'
//console.log(arr); // => <Buffer 68 65 65 6c 6f>
//console.log(arr1); // => <Buffer 68 65 65 6c 6f>

/**\
 * path路径
 * http://nqdeng.github.io/7-days-nodejs/#3.2.4
 */

 /**
	* 遍历文件
  */

	function travel(dir, callback){

		fs.readdirSync(dir).forEach((file) =>{
			var pathName = path.join(dir, file)
			if(fs.statSync(pathName).isDirectory()){
				travel(pathName, callback)
			}else{
				callback(pathName)
			}
		})
	}

	// travel("./",console.log)


	function travel(dir, callback, finish) {
    fs.readdir(dir, function (err, files) {
        (function next(i) {
            if (i < files.length) {
                var pathname = path.join(dir, files[i]);

                fs.stat(pathname, function (err, stats) {
                    if (stats.isDirectory()) {
                        travel(pathname, callback, function () {
                            next(i + 1);
                        });
                    } else {
                        callback(pathname, function () {
                            next(i + 1);
                        });
                    }
                });
            } else {
                finish && finish();
            }
        }(0));
    });
}

function readText(pathname) {
	var bin = fs.readFileSync(pathname);

 console.log(bin[0])
 console.log(bin[1])
 console.log(bin[2])
}

//readText('./a.js')

/**
 *  网络操作
 */

 



















































































