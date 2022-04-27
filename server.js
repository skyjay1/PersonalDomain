const http = require('http');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static("express"));

app.use('/', function(req,res){
    res.sendFile(path.join(__dirname+'/express/index.html'));
  }
);
app.use(
    "/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
    "/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);

const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);