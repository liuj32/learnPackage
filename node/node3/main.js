var fs = require('fs');
var path = require('path')

/**
 * 事件机制  异步io
 */


function heavyCompute(n) {
    var count = 0,
        i, j;

    for (i = n; i > 0; --i) {
        for (j = n; j > 0; --j) {
            count += 1;
        }
    }
}

var t = new Date();

// setTimeout(function () {
//     console.log(new Date() - t);
// }, 1000);

//heavyCompute(50000);


// (function next(i, len, callback) {
//     if (i < len) {
//         async(arr[i], function (value) {
//             arr[i] = value;
//             next(i + 1, len, callback);
//         });
//     } else {
//         callback();
//     }
// }(0, arr.length, function () {
//     // All array items have processed.
// }));



/**
 * 依次执行
 */
// ( function next(i, len, callback) {  
//     if(i<len){
//         async(arr[i], function (value) { 
//             arr[i] = value 
//             next(i+1, len, callback)
//          })
//     }
// }(0, arr.length, function(){

// }))

/**
 * 并行执行
 */
// (function (i, len, count, callback) {
//     for (; i < len; ++i) {
//         (function (i) {
//             async(arr[i], function (value) {
//                 arr[i] = value;
//                 if (++count === len) {
//                     callback();
//                 }
//             });
//         }(i));
//     }
// }(0, arr.length, 0, function () {
//     // All array items have processed.
// }));


/**
 * 
 * 同步错误
 * @param {*} callback 
 */

// function sync(fn) {
//     return fn();
// }

// try {
//     sync(null);
//     // Do something.
// } catch (err) {
//     console.log('Error: %s', err.message);
// }


/**
 * 异步错误
 * @param {*} callback 
 */
function async(fn, callback) {
    // Code execution path breaks here.
    setTimeout(function ()　{
        callback(fn());
    }, 0);
}

try {
    // async(null, function (data) {
    //     // Do something.
    // });
} catch (err) {
    console.log('Error: %s', err.message);
}


/**
 * 异步捕获
 * @param {*} callback 
 */


function async(fn, callback) {
    // Code execution path breaks here.
    setTimeout(function ()　{
        try {
            callback(null, fn());
        } catch (err) {
            callback(err);
        }
    }, 0);
}

async(null, function (err, data) {
    if (err) {
        //console.log('Error: %s', err.message);
    } else {
        // Do something.
    }
})


/**
 *  域
 */


function async(request, callback) {
    // Do something.
    asyncA(request, function (err, data) {
        if (err) {
            callback(err);
        } else {
            // Do something
            asyncB(request, function (err, data) {
                if (err) {
                    callback(err);
                } else {
                    // Do something
                    asyncC(request, function (err, data) {
                        if (err) {
                            callback(err);
                        } else {
                            // Do something
                            callback(null, data);
                        }
                    });
                }
            });
        }
    });
}

http.createServer(function (request, response) {
    async(request, function (err, data) {
        if (err) {
            response.writeHead(500);
            response.end();
        } else {
            response.writeHead(200);
            response.end(data);
        }
    });
});
/**
 * `````````````````````````````````````````````````````````````````````````````
 */

function async(request, callback) {
    // Do something.
    asyncA(request, function (data) {
        // Do something
        asyncB(request, function (data) {
            // Do something
            asyncC(request, function (data) {
                // Do something
                callback(data);
            });
        });
    });
}

http.createServer(function (request, response) {
    var d = domain.create();

    d.on('error', function () {
        response.writeHead(500);
        response.end();
    });

    d.run(function () {
        async(request, function (data) {
            response.writeHead(200);
            response.end(data);
        });
    });
});












































