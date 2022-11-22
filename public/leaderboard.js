	var board = document.getElementById("leaderBoard");
	board.width = innerWidth - 20;
	board.height = innerHeight * 0.20;

	var btx = board.getContext('2d');
	btx.fillStyle = "#ffffff"
	btx.fillRect(0, 0, board.width, board.height);
	
	const startLeaderBoardEngine = () => {
		setInterval(() => { updater() }, 1000);
	}

	const updater = () => {
		//var bg = new Image();
		//bg.src = "";
		//btx.drawImage(bg, 0, 0);

		btx.fillStyle = "#ffffff"
		btx.fillRect(0, 0, board.width, board.height);

		drawLobby();
		drawEarned();
	}

	const drawEarned = () => {
		var counter = getCounter();
		var earned = "𝕍𝕚𝕖𝕨𝕖𝕣: " + counter.view + " | 𝕃𝕚𝕜𝕖: " + counter.like + " | 𝔾𝕚𝕗𝕥𝕤: " + counter.gift;
		btx.font = "20px Arial";
		btx.fillStyle = "#000000";
		btx.fillText(earned, 50, 50);
	}

	const drawLobby = () => {
		//var img = new Image();
		//img.src = "https://cdn3.iconfinder.com/data/icons/leto-user-group/64/__user_person_profile-512.png";
		//btx.drawImage(img, 50, 50, 20, 30);

		var lobby = getLobby();
		btx.font = "20px Arial";
		btx.fillStyle = "#000000";
		btx.fillText("🐡 𝕔𝕠𝕦𝕟𝕥: " + lobby.size, 50, 75);

		btx.font = "25px Arial";
		btx.fillStyle = "#000000";
		btx.fillText("WORK IN PROGRESS [PREVIEW ONLY] : 💖 to join, grow, and keep your fish", 50, 110);
	}
	
	/*
	    function Point(x,y){
    this.x = x;
    this.y = y;
    

    this.distanceTo = function (point)
    {
        var distance = Math.sqrt((Math.pow(point.x-this.x,2))+(Math.pow(point.y-this.y,2)))
        return distance;
    };
}

var newPoint = new Point (10,100);
var nextPoint = new Point (20,25);

console.log(newPoint.distanceTo(nextPoint))
*/