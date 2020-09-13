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
////

const {username, room} = Qs.parse(location.search , {ignoreQueryPrefix: true});
console.log(location.search)

socket.on('message', message => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        messageMustache: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('messageLocation', url => {
    console.log(url)

    const html = Mustache.render(messageLocationTemplate, {
        url: url.text,
        createdAt: moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
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




socket.emit('join', {username,room})