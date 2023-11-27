const http = require('http');
const app = require('./app');

//express app requires to know which port we are
app.set('port', process.env.PORT || 3000);
//node creates the server using our express app
const server = http.createServer(app);
server.listen(process.env.PORT || 3000);