let socket;

let popupContainer = document.body.querySelector('#popup-container');
let popupForm = document.body.querySelector('#popup-form');
let pseudoInput = document.body.querySelector('#pseudo');
let messageForm = document.body.querySelector('#message-form');
let messageInput = document.body.querySelector('#message');
let convContainer = document.body.querySelector('#conversation');

let pseudo;
let randomColor;

let init = () => {
    randomColor = generateHslaColor(100, 90);
    messageInput.focus();

    popupForm.addEventListener('submit', listenPopup);

   
}



//POPUP
let listenPopup = e => {
    e.preventDefault();

    if (pseudoInput.value == '') {
        return false;
    }

    pseudo = pseudoInput.value;

    popupForm.removeEventListener('submit', listenPopup);
    messageForm.addEventListener('submit', listenMessageForm);
    
    messageInput.focus();
    
    //Init socket
    socket = io();
    socket.addEventListener('chat message', listenSocket);
    socket.addEventListener('history', listenSocketHistory);
    socket.emit('new user', pseudo);

    popupContainer.parentNode.removeChild(popupContainer);
}

//CHAT
let listenMessageForm = e => {
    e.preventDefault();

    if (messageInput.value == '') {
        return false;
    }

    console.log(messageInput.value);

    const payload = {
        msg: messageInput.value,
        color: randomColor,
        pseudo: pseudo
    }

    socket.emit('chat message', payload);
    messageInput.value = '';
    messageInput.focus();
    return false;
}

let listenSocket = (payload) => {
    newMessage(payload);
};

let listenSocketHistory = (history) => {

    hArray = JSON.parse(history);

    for (let i = 0; i < hArray.length; i++) {
        const payload = hArray[i];

        newMessage(payload);
    }

}

let newMessage = (payload) => {
    //Ajout de l'élément dans le chat
    convContainer.innerHTML += `<li style="background-color:${payload.color}">${payload.pseudo} dit : ${payload.msg}</li>`;

    //Scroll max sur le chat
    convContainer.parentElement.scrollTo(0, convContainer.parentElement.scrollHeight - convContainer.parentElement.clientHeight);
}

let generateHslaColor = (saturation, lightness) => {
    let colors = []
    let hue = Math.trunc(360 * Math.random());

    return (`hsla(${hue},${saturation}%,${lightness}%,1)`);
}

//INITIALISATION
init();