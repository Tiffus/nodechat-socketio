let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

let port = process.env.PORT;

let history = [];

if (port == null || port == "") {
  port = 3000;
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/client.js', (req, res) => {
    res.sendFile(__dirname + '/client.js');
});

app.get('/style.min.css', (req, res) => {
    res.sendFile(__dirname + '/style.min.css');
});

app.get('/style.min.css.map', (req, res) => {
    res.sendFile(__dirname + '/style.min.css.map');
});

//Chaque socket représente un client, d'où le fait qu'on peut garder le pseudo dans une variable ici
io.on('connection', (socket) => {
    console.log('new user connected');

    let pseudoOnServer;

    //Envoie l'historique au nouveau connecté
    socket.emit('history', JSON.stringify(history));
    
    //Envoi un message disant que untel s'est connecté à tout le monde sauf au nouveau
    socket.on('new user', (pseudo) => {

        pseudoOnServer = pseudo;

        console.log(`${pseudo} s'est connecté`);

        const payload = {
            msg: `${pseudo} s'est connecté`,
            color: "hsla(0,100%,100%,1)",
            pseudo: "Server"
        }

        socket.broadcast.emit('chat message', payload);

        saveHistory(payload);
    })

    //Envoi le message à tout le monde
    socket.on('chat message', (payload) => {
        //On restocke le pseudo à chaque fois, si jamais le serveur à redemarre cela permet de restocker les user déjà connectés
        pseudoOnServer = payload.pseudo;

        io.emit('chat message', payload);

        saveHistory(payload);
    });

    //Disconnect
    socket.on('disconnect', () => {
        console.log(`${pseudoOnServer} s'est déconnecté`);

        const payload = {
            msg: `${pseudoOnServer} s'est déconnecté`,
            color: "hsla(0,100%,100%,1)",
            pseudo: "Server"
        }

        socket.broadcast.emit('chat message', payload);

        saveHistory(payload);

    });
});

let saveHistory = (payload)=>{
    history.push(payload);
        
    if (history.length > 1000) {
        history.shift();
    }
}

server.listen(port, () => {
    console.log('listening on *:'+port);
});