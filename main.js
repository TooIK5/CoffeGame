var isOfflineTest = false;
var started = false;

document.getElementById("ismock").addEventListener("click", function(event) {
	isOfflineTest = document.getElementById("ismock").checked;

	for(let e of document.querySelectorAll(".address")) {
		if (isOfflineTest) e.classList.add("hidden"); else e.classList.remove("hidden");
	}
});

document.getElementById("start").addEventListener("click", function(event) {
	nickname = document.getElementById("name").value;
	isOfflineTest = document.getElementById("ismock").checked;
	host = document.getElementById("host").value;
	port = document.getElementById("port").value;

	document.getElementById("start").value = "set name";
	
	if (!started) {
		started = true;
		startGame();
	} else {
		connector.send(commandBody("rename", nickname));
	}
});