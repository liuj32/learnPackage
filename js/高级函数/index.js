

/***
 *柯里化  转为一系列函数
 * 反柯里化 一个函数调用
 */



function currying(fn, ...args){
	if(args.length >= fn.length){
	return	fn(...args)
	}else{
		return (...args1) => currying(fn, ...args,...args1)
	}
}

function arr(a,b,c,d){
	console.log([a,b,c,d])
}
//currying(arr)(1)(2)(3)

function selfBind(context,...arg){
	let fn = this
	return function(...args1){
		fn.apply(context, ...arg,...args1)
	}
}

Function.prototype.uncurrying = function() {
	let self = this;    // self 此时就是下面的Array.prototype.push方法
	return function() {
			let obj = Array.prototype.shift.call(arguments);
			/*
					obj其实是这种样子的
					obj = {
							'length': 1,
							'0': 1 
					}
			*/
			return self.apply(obj, arguments); // 相当于Array.prototype.push(obj, 110)
	}
};
let slice = Array.prototype.push.uncurrying();

let obj = {
	'length': 1,
	'0': 1
};
slice(obj, 110);
//console.log(obj);   // { '0': 1, '1': 110, length: 2 }

/**
 * 分时函数
 */