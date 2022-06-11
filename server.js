const express = require('express');
const cors = require("cors");
const http = require('http');
const { Server } = require("socket.io");
const {DATA_ENTITY_STATE_CHANGE_EVENT} = require("./events");
const DATA_ENTITIES = require("./dataEntities");

const app = express();
const server = http.createServer(app);
const io = new Server(server,
    {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('WebSocket Server says Hello');
});

app.post('/dataStateUpdate/:dataEntity', (req, res) => {

    const dataEntity = req.params['dataEntity'];

    if (!DATA_ENTITIES[dataEntity]) {
        res.status(400).send('Invalid data entity');
        return;
    }

    io.emit(DATA_ENTITY_STATE_CHANGE_EVENT, req.params['dataEntity']);

    res.status(200).send("Event emitted!");
}) ;


io.on('connection', (socket) => {
    console.log('Dashboard connected.');
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});