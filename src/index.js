const express = require('express')
const path = require('path')
const app = express();
const http = require('http')
const socketio = require('socket.io');


const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('a user connected');
})



server.listen(port, ()=> {
    console.log(`This server is runing on port ${port}`);
})