var express = require("express");
var bodyParser = require('body-parser');

var distantScreenSocket = null;

var http = require("http");
var server = http.createServer(function(request, response) {
console.log("at post beginning");
  if (request.method == 'POST') {
          console.log("POST");
          var body = '';
          request.on('data', function (data) {
              body += data;
          });
          request.on('end', function () {
              try {
                var post = JSON.parse(body);

                // deal_with_post_data(request,post);
                console.log(post); // <--- here I just output the parsed JSON

                distantScreenSocket.emit("tablet", post);

				response.send("{}")

                return;
              }catch (err){
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write("Bad Post Data.  Is your data a proper JSON?\n");
                response.end();
                return;
              }
          });
      }
  });
server.listen(4040);
var io = require("socket.io")(server);


io.on("connection", function(socket){
  console.log("connection : " + socket.id);
  distantScreenSocket = socket;
});


console.log("server on 4040");
