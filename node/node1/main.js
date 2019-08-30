var fs = require('fs');

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
console.log(arr); // => <Buffer 68 65 65 6c 6f>
console.log(arr1); // => <Buffer 68 65 65 6c 6f>

/**\
 * path路径
 * http://nqdeng.github.io/7-days-nodejs/#3.2.4
 */