(function(){

	var root = typeof self == 'object' && self.self === self && self ||
	typeof global == 'object' && global.global === global && global ||
	this ||
	{};

	var previousUnderscore = root._;

	var ArrayProto = Array.prototype, ObjProto = Object.prototype;
	var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

	var push = ArrayProto.push,
	slice = ArrayProto.slice,
	toString = ObjProto.toString,
	hasOwnProperty = ObjProto.hasOwnProperty;

	// are declared here.
	var nativeIsArray = Array.isArray,
	nativeKeys = Object.keys,
	nativeCreate = Object.create;

	var Ctor = function(){};

	var _ = function(obj) {
	if (obj instanceof _) return obj;
	if (!(this instanceof _)) return new _(obj);
	this._wrapped = obj;
	};

	// Export the Underscore object for **Node.js**, with
	// backwards-compatibility for their old module API. If we're in
	// the browser, add `_` as a global object.
	// (`nodeType` is checked to ensure that `module`
	// and `exports` are not HTML elements.)
	if (typeof exports != 'undefined' && !exports.nodeType) {
	if (typeof module != 'undefined' && !module.nodeType && module.exports) {
	exports = module.exports = _;
	}
	exports._ = _;
	} else {
	root._ = _;
	}

	// Current version.
	_.VERSION = '1.9.1';

	// functions.
	var optimizeCb = function(func, context, argCount) {
	if (context === void 0) return func;
	switch (argCount == null ? 3 : argCount) {
	case 1: return function(value) {
	return func.call(context, value);
	};
	// The 2-argument case is omitted because we’re not using it.
	case 3: return function(value, index, collection) {
	return func.call(context, value, index, collection);
	};
	case 4: return function(accumulator, value, index, collection) {
	return func.call(context, accumulator, value, index, collection);
	};
	}
	return function() {
	return func.apply(context, arguments);
	};
	};

	var builtinIteratee;

	// An internal function to generate callbacks that can be applied to each
	var cb = function(value, context, argCount) {
	if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
	if (value == null) return _.identity;
	if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
	return _.property(value);
	};

	// External wrapper for our callback generator. Users may customize
	_.iteratee = builtinIteratee = function(value, context) {
	return cb(value, context, Infinity);
	};

	// Some functions take a variable number of arguments, or a few expected
	var restArguments = function(func, startIndex) {
	startIndex = startIndex == null ? func.length - 1 : +startIndex;
	return function() {
	var length = Math.max(arguments.length - startIndex, 0),
	rest = Array(length),
	index = 0;
	for (; index < length; index++) {
	rest[index] = arguments[index + startIndex];
	}
	switch (startIndex) {
	case 0: return func.call(this, rest);
	case 1: return func.call(this, arguments[0], rest);
	case 2: return func.call(this, arguments[0], arguments[1], rest);
	}
	var args = Array(startIndex + 1);
	for (index = 0; index < startIndex; index++) {
	args[index] = arguments[index];
	}
	args[startIndex] = rest;
	return func.apply(this, args);
	};
	};

	// An internal function for creating a new object that inherits from another.
	var baseCreate = function(prototype) {
	if (!_.isObject(prototype)) return {};
	if (nativeCreate) return nativeCreate(prototype);
	Ctor.prototype = prototype;
	var result = new Ctor;
	Ctor.prototype = null;
	return result;
	};

	var shallowProperty = function(key) {
	return function(obj) {
	return obj == null ? void 0 : obj[key];
	};
	};

	var has = function(obj, path) {
	return obj != null && hasOwnProperty.call(obj, path);
	}

	var deepGet = function(obj, path) {
	var length = path.length;
	for (var i = 0; i < length; i++) {
	if (obj == null) return void 0;
	obj = obj[path[i]];
	}
	return length ? obj : void 0;
	};

	// Helper for collection methods to determine whether a collection
	var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	var getLength = shallowProperty('length');
	var isArrayLike = function(collection) {
	var length = getLength(collection);
	return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	};

	// Collection Functions
	// --------------------

	// The cornerstone, an `each` implementation, aka `forEach`.
	_.each = _.forEach = function(obj, iteratee, context) {
	iteratee = optimizeCb(iteratee, context);
	var i, length;
	if (isArrayLike(obj)) {
	for (i = 0, length = obj.length; i < length; i++) {
	iteratee(obj[i], i, obj);
	}
	} else {
	var keys = _.keys(obj);
	for (i = 0, length = keys.length; i < length; i++) {
	iteratee(obj[keys[i]], keys[i], obj);
	}
	}
	return obj;
	};

	// Return the results of applying the iteratee to each element.
	_.map = _.collect = function(obj, iteratee, context) {
	iteratee = cb(iteratee, context);
	var keys = !isArrayLike(obj) && _.keys(obj),
	length = (keys || obj).length,
	results = Array(length);
	for (var index = 0; index < length; index++) {
	var currentKey = keys ? keys[index] : index;
	results[index] = iteratee(obj[currentKey], currentKey, obj);
	}
	return results;
	};

	// Create a reducing function iterating left or right.
	var createReduce = function(dir) {
	// Wrap code that reassigns argument variables in a separate function than
	var reducer = function(obj, iteratee, memo, initial) {
	var keys = !isArrayLike(obj) && _.keys(obj),
	length = (keys || obj).length,
	index = dir > 0 ? 0 : length - 1;
	if (!initial) {
	memo = obj[keys ? keys[index] : index];
	index += dir;
	}
	for (; index >= 0 && index < length; index += dir) {
	var currentKey = keys ? keys[index] : index;
	memo = iteratee(memo, obj[currentKey], currentKey, obj);
	}
	return memo;
	};

	return function(obj, iteratee, memo, context) {
	var initial = arguments.length >= 3;
	return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
	};
	};

	// **Reduce** builds up a single result from a list of values, aka `inject`,
	_.reduce = _.foldl = _.inject = createReduce(1);

	// The right-associative version of reduce, also known as `foldr`.
	_.reduceRight = _.foldr = createReduce(-1);

	// Return the first value which passes a truth test. Aliased as `detect`.
	_.find = _.detect = function(obj, predicate, context) {
	var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
	var key = keyFinder(obj, predicate, context);
	if (key !== void 0 && key !== -1) return obj[key];
	};

	// Return all the elements that pass a truth test.
	// Aliased as `select`.
	_.filter = _.select = function(obj, predicate, context) {
	var results = [];
	predicate = cb(predicate, context);
	_.each(obj, function(value, index, list) {
	if (predicate(value, index, list)) results.push(value);
	});
	return results;
	};

	// Return all the elements for which a truth test fails.
	_.reject = function(obj, predicate, context) {
	return _.filter(obj, _.negate(cb(predicate)), context);
	};

	// Determine whether all of the elements match a truth test.
	// Aliased as `all`.
	_.every = _.all = function(obj, predicate, context) {
	predicate = cb(predicate, context);
	var keys = !isArrayLike(obj) && _.keys(obj),
	length = (keys || obj).length;
	for (var index = 0; index < length; index++) {
	var currentKey = keys ? keys[index] : index;
	if (!predicate(obj[currentKey], currentKey, obj)) return false;
	}
	return true;
	};

	// Determine if at least one element in the object matches a truth test.
	// Aliased as `any`.
	_.some = _.any = function(obj, predicate, context) {
	predicate = cb(predicate, context);
	var keys = !isArrayLike(obj) && _.keys(obj),
	length = (keys || obj).length;
	for (var index = 0; index < length; index++) {
	var currentKey = keys ? keys[index] : index;
	if (predicate(obj[currentKey], currentKey, obj)) return true;
	}
	return false;
	};

	// Determine if the array or object contains a given item (using `===`).
	// Aliased as `includes` and `include`.
	_.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	if (!isArrayLike(obj)) obj = _.values(obj);
	if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	return _.indexOf(obj, item, fromIndex) >= 0;
	};

	// Invoke a method (with arguments) on every item in a collection.
	_.invoke = restArguments(function(obj, path, args) {
	var contextPath, func;
	if (_.isFunction(path)) {
	func = path;
	} else if (_.isArray(path)) {
	contextPath = path.slice(0, -1);
	path = path[path.length - 1];
	}
	return _.map(obj, function(context) {
	var method = func;
	if (!method) {
	if (contextPath && contextPath.length) {
	context = deepGet(context, contextPath);
	}
	if (context == null) return void 0;
	method = context[path];
	}
	return method == null ? method : method.apply(context, args);
	});
	});

	// Convenience version of a common use case of `map`: fetching a property.
	_.pluck = function(obj, key) {
	return _.map(obj, _.property(key));
	};

	// Convenience version of a common use case of `filter`: selecting only objects
	// containing specific `key:value` pairs.
	_.where = function(obj, attrs) {
	return _.filter(obj, _.matcher(attrs));
	};

	// Convenience version of a common use case of `find`: getting the first object
	// containing specific `key:value` pairs.
	_.findWhere = function(obj, attrs) {
	return _.find(obj, _.matcher(attrs));
	};

	// Return the maximum element (or element-based computation).
	_.max = function(obj, iteratee, context) {
	var result = -Infinity, lastComputed = -Infinity,
	value, computed;
	if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
	obj = isArrayLike(obj) ? obj : _.values(obj);
	for (var i = 0, length = obj.length; i < length; i++) {
	value = obj[i];
	if (value != null && value > result) {
	result = value;
	}
	}
	} else {
	iteratee = cb(iteratee, context);
	_.each(obj, function(v, index, list) {
	computed = iteratee(v, index, list);
	if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	result = v;
	lastComputed = computed;
	}
	});
	}
	return result;
	};

	// Return the minimum element (or element-based computation).
	_.min = function(obj, iteratee, context) {
	var result = Infinity, lastComputed = Infinity,
	value, computed;
	if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
	obj = isArrayLike(obj) ? obj : _.values(obj);
	for (var i = 0, length = obj.length; i < length; i++) {
	value = obj[i];
	if (value != null && value < result) {
	result = value;
	}
	}
	} else {
	iteratee = cb(iteratee, context);
	_.each(obj, function(v, index, list) {
	computed = iteratee(v, index, list);
	if (computed < lastComputed || computed === Infinity && result === Infinity) {
	result = v;
	lastComputed = computed;
	}
	});
	}
	return result;
	};

	// Shuffle a collection.
	_.shuffle = function(obj) {
	return _.sample(obj, Infinity);
	};

	_.sample =function(obj, n, guard){
		if(n == null || guard){
			if(!isArrayLike(obj)) obj = _.values(obj);
			return obj[_.random(obj.length -1)]
	}
	var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
	var length = getLength(sample);
	n = Math.max(Math.min(n, length), 0);
	var last = length -1;
	for(var index = 0; index < n; index++){
		var rand = _.random(index, last);
		var temp = sample(index);
		sample[index] = sample[rand];
		sample[rand] = temp;
	}
	return sample.slice(0, n);
}

_.sortBy = function(obj, iteratee, context) {
	var index = 0;
	iteratee = cb(iteratee, context);
	return _.pluck(_.map(obj, function(value, key, list){
		return {
			value: value,
			index: index++,
			criteria: iteratee(value, key, list)
		};
	}).sort(function(left, right){
		var a = left.criteria;
		var b = right.criteria;
		if(a != b){
			if(a > b || a === void 0) return 1;
			if(a < b || b === void 0) return -1;
		}
		return left.indesx - right.index;
	}), 'value');
};

var group = function(behavior, partition){
	return function(obj, iteratee, context){
		var result = partition ? [[], []] : {};
		iteratee = cb(iteratee, context);
		_.each(obj, function(value, index){
			var key = iteratee(value, index, obj);
			behavior(result, value, key);
		});
		return result;
	}
};

_.groupBy = group(function(result, value, key){
	if(has(result, key)) result[key].push(value);
	else result[key] = [value];
})

_.indexBy = group(function(result, value, key){
	result[key] = value;
});

_.countBy = group(function(result, value, key){
	if(has(result, key)) result[key]++;
	else result[key] = 1;
});

var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;

_.toArray = function(obj) {
	if(!obj) return [];
	if(_.isArray(obj))  return slice.call(obj);
	if(_.isString(obj)) {
		return obj.match(reStrSymbol);
	}
	if(isArrayLike(obj)) return _.map(obj, _.identity);
	return _.values(obj);
};


_.size = function(obj){
	if(obj == null) return 0;
	return isArrayLike(obj) ? obj.length : _.values(obj).length;
}

_.partition = group(function(result, value, pass) {
	result[pass ? 0: 1].push(value);
}, true);

_.first = _.head = _.take = function(array, n, guard){
	if(array == null || array.length < 1) return n == null ? void 0 : [];
	if(n == null || guard)  return array[0];
	return _.initial(array, array.length -n );
};

_.initial = function(array, n, guard){
	return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1:n)));
};

_.last = function(array, n, guard){
	if(array == null || array.length<1) return n == null ? void 0 :[];
	if(n == null || guard) return array[array.length - 1];
	return _.rest(array, Math.max(0, array.length -n));
}

_.rest = _.tail = _.drop = function(array, n, guard){
	return slice.call(array, n == null || guard ? 1 : n);
}



_.compact = function(array){
	return _.filter(array, Boolean);
}

var flatten = function(input, shallow, strict, output){
	output = output || [];
	var idx = output.length;
	for(var i=0,length = getLength(input);i< length;i++){
		var value = input[i];
		if(isArrayLike(value) && (_.isArray(value) || _.isArguments(value))){
			if(shallow){
				var j = 0, len = value.length;
				while(j<len) output[idx++] = value[j++]
			}else{
				flatten(value, shallow, strict, output);
				idx = output.length;
			}
		}else if(!strict) {
			output[idx++] = value;
		}
	}
	return output;
}

_.flatten = function(array, shallow){
	return flatten(array, shallow, false);
};

_.without = restArguments(function(array, otherArrays){
	return _.difference(array, otherArrays);
});

_.uniq = _.unique = function(array, isSorted, iteratee, context){
	if(!_.isBoolean(isSorted)){
		context = iteratee;
		iteratee = isSorted;
		isSorted = false;
	}
	if(iteratee != null) iteratee = cb(iteratee, context);
	var result = [];
	var seen = [];
	for(var i=0,length = getLength(array);i<length;i++){
		var value = array[i],
				computed  = iteratee ? iteratee(value, i, array) : value;
		if(isSorted && !iteratee){
			if(!i || seen !== computed)  result.push(value);
			seen = computed;
		} else if(iteratee){
			if(!_.contains(seen, computed))	{
				seen.push(computed);
				result.push(value);
			}
		}else if(!_.contains(result, value)){
			result.push(value);
		}
	}
	return result;
}

_.union = restArguments(function(arrays){
	return _.uniq(flatten(arrays, true, true));
});

_.intersection = function(array){
	var result =[];
	var argsLength = arguments.length;
	for(var i=0, length=getLength(array);i<length;i++){
		var item = array[i];
		if(_.contains(result, item)) continue;
		var j;
		for(j=1;j<argsLength;j++){
			if(!_.contains(arguments[j], item)) break;
		}
		if(j == argsLength) result.push(item);
	}
	return result;
}

_.difference = restArguments(function (array, rest){
	rest = flatten(rest, true, true);
	return _.filter(array, function(value){
		return !_.contains(rest, value);
	})
});

_.unzip = function(array){
	var length = array && _.max(array, getLength).length || 0;
	var result = Array(length);
	for(var index =0;index<length;index++){
		result[index] = _.pluck(array, index);
	}
	return result;
}

_.zip = restArguments(_.unzip);

_.object = function(list, values){
	var result = {};
	for(var i=0,length = getLength(list);i<length;i++){
		if(values){
			result[list[i]] = values[i]
		}else {
			result[list[i][0]] = list[i][1];
		}
	}
	return result;
}

var createPredicateIndexFinder = function(dir){
	return function(array, predicate, context){
		predicate = cb(predicate, context);
		var length = getLength(array);
		var index = dir > 0 ? 0 : length -1;
		for(;index>=0 && index < length;index +=dir){
			if(predicate(array[index], index, array))  return index;
		}
		return -1;
	}
}

_.findIndex =  createPredicateIndexFinder(1);
_.findLastIndex = createPredicateIndexFinder(-1);


_.sortedIndex = function(array, obj, iteratee, context){
	iteratee = cb(iteratee, context, 1);
	var value = iteratee(obj);
	var low = 0, high = getLength(array);
	while(low < high){
		var mid = Math.floor((low +high)/2);
		if(iteratee(array[mid] < value)) low = mid+1;
		else high = mid;
	}
	return low;
}

var createIndexFinder = function(dir, predicateFind, sortedIndex){
	return function(array, item, idx) {
		var i = 0, length = getLength(array);
		if(typeof idx == 'number') {
			if(dir > 0){
				i = idx >=0 ? idx : Math.max(idx+ length, i);
			} else {
				length = idx >=0 ? Math.min(idx + 1, length): idx + length +1;
			}
		}else if(sortedIndex && idx && length){
			idx = sortedIndex(array, item);
			return array[idx] == item ? idx : -1;
		}
		if(item != item){
			idx = predicateFind(slice.call(array, i, length), _.isNaN);
			return idx >= 0 ? idx + i : -1;
		}
		for(idx = dir>0 ? i : length - 1;idx >=0 && idx<length;idx +=dir){
			if(array(idx) == item) return idx;
		}
		return -1;
	}
};



_.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
_.lastIndex = createIndexFinder(-1, _.findLastIndex);


_.range = function(start, stop, step){
	if(stop == null){
		stop = start || 0;
		start = 0;
	}
	if(!step){
		step = stop < start ? -1 : 1;
	}

	var length = Math.max(Math.ceil((stop - start)/ step), 0);
	var range = Array(length);
	for(var idx =0;idx < length;idx++, start += step){
		range[idx] = start;
	}
	return range;
}

_.chunk = function(array, count){
	if(count == null ||count < 1) return [];
	var result = [];
	var i = 0, length = array.length;
	while(i< length){
		result.push(slice.call(array, i, i+=count));
	}
	return result;
}

var executeBound = function(sourceFunc, boundFunc, context, callligContext, args){
	if(!(callligContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	var self = baseCreate(sourceFunc.prototype);
	var result = sourceFunc.apply(self, args);
	if(_.isObject(result)) return result;
	return self;
};


_.bind = restArguments(function(func, context, args){
	if(!_.isFunction(func)) throw new Error('bind must be on a function');
	var bound = restArguments(function(callArgs){
		return executeBound(func, bound, context, this, args.concat(callArgs));
	})
	return bound;
})


_.partial = restArguments(function(func, boundArgs){
	var placeholder = _.partial.placeholder;
	var bound = function () {
		var position = 0, length = boundArgs.length;
		var args = Array(length);
		for(var i=0;i<length;i++){
			args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
		}
		while(position < arguments.length) args.push(arguments[position++]);
		return executeBound(func, bound, this, this, args);
	}
	return bound;
});


_.partial.placeholder = _;

_.bindAll = restArguments(function(obj, keys){
	keys = flatten(keys, false, false);
	var index = keys.length;
	if(index < 1) throw new Error ('bindall must be passed function names');
	while(index--){
		var key = keys[index];
		obj[key] = _.bind(obj[key], obj);
	}
});


_.memoize = function(func, hasher){
	var memoize = function(key){
		var cache = memoize.cache;
		var address = ''+(hasher ? hasher.apply(this, arguments) : key);
		if(!has(cache, address)) cache[address]  = func.apply(this, arguments);
		return cache[address]
	}
	memoize.cache = {};
	return memoize;
};

_.delay = restArguments(function(func, wait, args){
	return setTimeout(function(){
		return func.apply(null, args);
	}, wait);
});


_.defer = _.partial(_.delay, _, 1);


//节流  规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。
_.throttle = function(func, wait, options){
	var timeout, context, args, result;
	var previous = 0;
	if(!options) options = {};

	var later = function(){
		previous = options.leading == false ? 0: _.now();
		timeout = null;
		result = func.apply(context, args);
		if(!timeout) context = args = null;
	};

	var throttle = function(){
		var now = _.now();
		if(!previous && options.leading == false) previous  = now;
		var remaining = wait - (now - previous);
		context = this;
		args = arguments;
		if(remaining <=0 || remaining > wait){
			if(timeout){
				clearInterval(timeout);
				timeout = null;
			}
			previous = now;
			result = func.apply(context, args);
			if(!timeout) context = args = null;
		} else if(!timeout && options.trailing !== false){
			timeout = setTimeout(later, remaining);
		}
		return result;
	};

	throttle.cancel = function(){
		clearTimeout(timeout);
		previous = 0;
		timeout = context = args = null;
	}

	return throttle;
}



//debounce  防抖 一段连续操作只执行最后一次























})()