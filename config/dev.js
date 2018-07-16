const debug = require('debug')('nodejs-onboarding:server');
const http = require('http');
const  app =  require('../app/app');

var server = http.createServer(app);

var port = process.env.PORT || '3000';


server.listen(port);
server.on('listening', onListening);

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

