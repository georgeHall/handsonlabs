var http = require('http');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

const url = `http://${process.env.HOST}:${process.env.PORT}`
dotenv.config();

var server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    console.log(`Recieved Request`);
    var json = fetch(url)
        .then(res => res.json())
        .then(json => {
            console.log(`Fetch response: ${json}`)
            response.end(`Hello world, the time is: ${json}`)
        })
        .catch(err => {
            console.log(`Error: ${err}`)
            response.end(`Error`)
        });
});


var port = 8080;
server.listen(port);

console.log(`Server running at http://localhost:${port}`);
console.log(`Backend running at ${url}`);
