const http = require('http');
const app = require('./app');

const port1 = process.env.MY_PORT || 8080;
console.log(port1);

const server = http.createServer(app);

server.listen(port1);