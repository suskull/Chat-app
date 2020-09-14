const users = []

const addUser = ({id, username, room}) => {

    //clean the input data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate data
    if(!username || !room) {
        return {error : 'Please provide username and room'}
    }

    const existUser = users.find(user => {
        return user.room === room && user.username === username
    })

    if(existUser) {
        return {error: 'Please use another username'}

    }

    const user = {id, username, room}
    users.push(user)
    return {user}
}

// addUser({
//     id: 1,
//     username:'Hieu',
//     room:'101'
// })
// addUser({
//     id: 2,
//     username:'Hieu2',
//     room:'101'
// })
// addUser({
//     id: 3,
//     username:'Hieu3',
//     room:'102'
// })


console.log(users)





const removeUser = id => {
  const index = users.findIndex(user => {
      return user.id === id
  })

 if(index !== -1) {
    return users.splice(index, 1)[0]
 }
 
}

const getUser = id => {
    return users.find(user => user.id === id)
}

// const user = getUser(2);
// console.log(user)

const getUsersInRoom = room => {
    return users.filter(user => user.room === room)
}

const users1 = getUsersInRoom('101')
console.log(users1)


module.exports = {
    addUser,
    getUser,
    removeUser,
    getUsersInRoom
}