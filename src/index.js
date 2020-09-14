const express = require('express')
const path = require('path')
const app = express();
const http = require('http')
const Filter = require('bad-words');
const {generateMessage,generateLocationMessage} = require('./utils/generateMessage');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const server = http.createServer(app)
const io = require('socket.io')(server);


//const io = socketio(server)
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath))


//---------------------------------------------
let count = 0;
io.on('connection', (socket) => {
    //console.log(socket)
    socket.on('join', ({username,room}, callback) => {
        
        const {error,user}= addUser({id: socket.id, username, room})

        console.log(user)
        if(error) {
            return callback(error)
        }
        socket.join(user.room)
        //console.log(username, room);
        socket.emit('message', generateMessage('Admin','Wellcome'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has joined the room`))

        io.to(user.room).emit('userData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        
        callback()
    })
   

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();
        const user = getUser(socket.id)
        if(filter.isProfane(message)) {
          callback('Bad words not allowed')
          return   io.to(user.room).emit('message', generateMessage(user.username,'***********'))
        }
       io.to(user.room).emit('message', generateMessage(user.username, message))
       callback();
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('messageLocation', generateLocationMessage(user.username,`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        //console.log(user)
        if(user) {
            io.to(user.room).emit('message', generateMessage('Admin',`${user.username} have left`))

            io.to(user.room).emit('userData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        
    })


})



server.listen(port, ()=> {
    console.log(`This server is runing on port ${port}`);
})