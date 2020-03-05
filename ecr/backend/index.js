var http = require('http');
var moment = require('moment');

var server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    var time = moment().format('MMMM Do YYYY, h:mm:ss a')
    console.log("Backend request at: " + time)
    response.end(JSON.stringify(time));
});

var port = 80;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
