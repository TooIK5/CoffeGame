
console.log("c");

var socket = new WebSocket("ws://192.168.43.209:3333");

socket.onopen = function() {
    console.log("Соединение установлено.");


    socket.send("Привет");
    startGame();
};

function startGame(){
	setInterval(cicle, 30);
}

function cicle(){
	socket.send("1");
}

socket.onclose = function(event) {
    if (event.wasClean) {
        console.log('Соединение закрыто чисто');
    } else {
        console.log('Обрыв соединения'); // например, "убит" процесс сервера
    }
    console.log('Код: ' + event.code + ' причина: ' + event.reason);
};

socket.onmessage = function(event) {
    console.log("Получены данные " + event.data);
};

socket.onerror = function(error) {
    console.log("Ошибка " + error.message);
};