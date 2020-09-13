const express = require('express')
const path = require('path')
const app = express();
const http = require('http')
const Filter = require('bad-words');
const generateMessage = require('./utils/generateMessage');

const server = http.createServer(app)
const io = require('socket.io')(server);


//const io = socketio(server)
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath))


//---------------------------------------------
let count = 0;
io.on('connection', (socket) => {
    debugger
    socket.on('join', ({username,room}) => {
      
        socket.join(room)

        console.log(username, room);
        socket.emit('message', generateMessage('Wellcome'))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined the room`))
    })
   

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();
        if(filter.isProfane(message)) {
          callback('Bad words not allowed')
          return   io.emit('message', generateMessage('***********'))
        }
       io.emit('message', generateMessage(message))
       callback();
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('messageLocation', generateMessage(`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('An user have left'))
    })


})



server.listen(port, ()=> {
    console.log(`This server is runing on port ${port}`);
})