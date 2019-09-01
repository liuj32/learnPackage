var fs = require('fs');
var path = require('path')
var http = require('http')
var zlib = require('zlib')

/**
 * 网络操作
 */

//  http.createServer(function(request, response){
//    response.writeHead(200, {'Contetn-Type': 'text-plain'});
//    response.end('324')
//  }).listen(8132)


var options = {
  hostname: 'localhost',
  port: 80,
  path: '/',
  method: 'GET',
  headers: {
    'Accept-Encoding': 'gzip, deflate'
  }
};

http.request(options, function (response) {
  var body = [];

  response.on('data', function (chunk) {
    body.push(chunk);
  });

  response.on('end', function () {
    body = Buffer.concat(body);
    console.log('body')
    console.log(body)
    if (response.headers['content-encoding'] === 'gzip') {
      zlib.gunzip(body, function (err, data) {
        console.log(data.toString());
      });
    } else {
      console.log(body.toString());
    }
  });
}).end();




















































































