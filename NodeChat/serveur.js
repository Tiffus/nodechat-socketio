const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
//const url = require('url');
//const query = require('querystring');

let port = process.env.PORT;

if (port == null || port == "") {
    port = 3000;
}

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
app.get('/style.min.css', function (req, res) {
    res.sendFile(__dirname + '/style.min.css');
})
app.get('/style.min.css.map', function (req, res) {
    res.sendFile(__dirname + '/style.min.css.map');
})
app.get('/client.js', function (req, res) {
    res.sendFile(__dirname + '/client.js');
})
app.get('/contact', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send("Vous êtes bien sur la page de contact.");
})
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404);
    res.send("Page not found");
})

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('chat message', function (msg) {
        console.log(msg);

        io.emit('chat message', msg);
    });

    socket.on('disconnect', function () {
        console.log('a user has disconnected');
    });
});

server.listen(port);