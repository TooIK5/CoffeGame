class SocketConnector {
	constructor(host, port, isMock){
		this.host = host;
		this.port = port;
		this.isMock = isMock;
	}

	connect(onconnected, onmessage) {
		if(this.isMock) {
			this.mockConnect(onmessage);
		    return;
		}

	    let address = "ws://"+this.host+":"+this.port;
	    console.log("Connecting... "+ address);

        this.socket = new WebSocket(address);

        this.socket.onopen = () => {
          console.log("Соединение установлено.");

          this.socket.send("Привет");
          onconnected();
        };

        this.socket.onclose = function(event) {
          if (event.wasClean) {
           console.log('Соединение закрыто чисто');
          } else {
            console.log('Обрыв соединения'); // например, "убит" процесс сервера
          }
          console.log('Код: ' + event.code + ' причина: ' + event.reason);
        };

        this.socket.onmessage = function(event) {
          //console.log("Получены данные " + event.data);
          onmessage(event.data);
        };

        this.socket.onerror = function(error) {
          console.log("Ошибка " + error.message);
        };
	}

	send(message) {
		if(this.isMock) {
			this.mockSend(message);
			return;//TODO
		}
		
		this.socket.send(message);
	}

	mockConnect(onmessage) {
		this.players = [];

		for(let i = 0; i<4; i++) {
		   let p = {};
		   p.name = "A"+i;
		   p.x = 0.1*i;
		   p.y = 0.1*i;
		   this.players.push(p);
	    }
	

		let cicle = (e)=> {
			for(let i = 0; i<this.players.length; i++) {
		       let p = this.players[i];
		       p.x = p.x+0.0001*(i+1);
		       p.y = p.y+0.0002*(i+1);
	        }

	        let data = {};
	        data.players = this.players;

			onmessage(commandBody("state", data));
		}

		setInterval(cicle, 30);

		let p = this.players[3];
		let halfSize = PLAYER_SIZE_PERCENT/2;

		let bulletCicle = (e)=> {
			onmessage(commandBody("shot", {x:p.x+halfSize, y:p.y+halfSize, route:-0.4}));
		}

		setInterval(bulletCicle, 600);
	}

	mockSend(message) {
		//console.log(message);
	}
}