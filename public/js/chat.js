const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')



//Templates

const messageTemplate = document.querySelector('#message-template').innerHTML
const messageLocationTemplate = document.querySelector('#message-location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
////
const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

const {username, room} = Qs.parse(location.search , {ignoreQueryPrefix: true});
console.log(location.search)

socket.on('message', message => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        messageMustache: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('messageLocation', url=> {
   // console.log(url)

    const html = Mustache.render(messageLocationTemplate, {
        username: url.username,
        url: url.url,
        createdAt: moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()

})

socket.on('userData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html
    console.log('hahaha', room)
    console.log('hihihi', users)

})


//////////////////////////////////
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = $messageFormInput.value;

    $messageFormButton.setAttribute('disabled', 'disabled')

    //const message = e.target.elements.message.value
    socket.emit('sendMessage', message , (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if(error) {
            return console.log(error)
        }
        console.log('Message delivered!')
    })

})


//////////////////////////////////////
$sendLocationButton.addEventListener('click', () => {

    $sendLocationButton.setAttribute('disabled', 'disabled')
    if(!navigator.geolocation) {
        alert('your browser does not support geolocation')
    }

    navigator.geolocation.getCurrentPosition(location => {
        console.log(location);
        socket.emit('sendLocation', {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
        }, () => {
            console.log('Location printed')
            $sendLocationButton.removeAttribute('disabled');
        })
    })
})




socket.emit('join', {username,room}, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})