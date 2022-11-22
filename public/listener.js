	let backendUrl = location.protocol === 'file:' ? "https://tiktok-chat-reader.zerody.one/" : undefined;
	const connection = new TikTokIOConnection(backendUrl); //("https://tiktok-chat-reader.zerody.one/");

	let myUsername;

	var lobby = new Map();
	var obstacles = [];
	var tempName = [];
	var tempGift = [];
	var counter = {
		view: 0,
		like: 0,
		gift: 0
	};

	const config = {
		age: {
			common: 120,
			vip: 240,
			vvip: 500
		},
		
		heartbeat: {
			listener: 50,
			leaderboard: 1000
		}
	}

	$(document).ready(function() {
		popTikTok_input("");
	});

	const popTikTok_input = (msg) => {
		var user = prompt(msg + "Enter your TikTok @username");
		if (user  == null || "") {
			popTikTok_input("Field cannot be empty\n");
		} else {
			connect(user);
		}
	}
	
	const connect = (user) => {
		connection.connect(user, {
			enableExtendedGiftInfo: true
		}).then(state => {
			myUsername = user;

			setInterval(() => { tempGiftTask(); }, 1000);
			setInterval(() => { tempNameTask(); }, 1000);

			startLeaderBoardEngine();
		}).catch(errorMessage => {
			popTikTok_input(errorMessage + "\n");
		});
	}

	const tempGiftTask = () => {
		Object.keys(tempGift).forEach(function(gifter) {
			if (tempGift[gifter].time > 0) {
				tempGift[gifter].time -= 1;
				
				/** SHOW GIFT TASK **/
				var gObj = lobby.get (gifter);
				var img = new Image();
				img.src = tempGift[gifter].giftimg;
				ctx.drawImage(img, gObj.x + 10, gObj.y -10, gObj.size + 5, gObj.size +5);
				
				ctx.fillStyle = "#e6e600";
				ctx.font = "20px Arial";
				ctx.fillText("Count: " + tempGift[gifter].count, gObj.x + 10, gObj.y -10);
			} else {
				delete tempGift[gifter];
			}
		});
	}

	const tempNameTask = () => {
		Object.keys(tempName).forEach(function(viewer) {
			if (tempName[viewer] > 0) {
				tempName[viewer] -= 1;
			} else {
				var Tiktokerist = lobby.get(viewer);
				Tiktokerist.name = viewer;
				delete tempName[viewer];
			}
		});
	}

	const sanitize = (message) => {
		return message.replace(/</g, '&lt;')
	}

	const generateUsernameLink = (data) => {
		return `<a class="usernamelink" href="https://www.tiktok.com/@${data.uniqueId}" target="_blank">${data.uniqueId}</a>`;
	}

	const hasStreak = (data) => {
		return data.giftType === 1 && !data.repeatEnd;
	}

	/** LIVESTREAM LISTENER */
	//not sure what tf is this..
	connection.on('roomUser', (msg) => {
		if (typeof msg.viewerCount === 'number') {
			counter.view = msg.viewerCount;
		}
	})

	// like stats
	connection.on('like', (data) => {
		var tiktoker = data.uniqueId;

		if (lobby.get(tiktoker) != null || undefined) {
			var Liker = lobby.get(tiktoker);

			Liker.progress.exp += data.likeCount;
			Liker.liveData.totallikes += data.likeCount;
			Liker.liveData.pendinglikes += data.likeCount;

			if (Liker.progress.level < 25) {
				if (Liker.progress.exp >= Liker.progress.limit) {
					Liker.progress.exp = 0;
					Liker.progress.limit += Liker.progress.limit * 0.69; 
					Liker.progress.level += 1;

					Liker.size += 4;
				}
			}

			Liker.age = (Math.ceil(config.age.common / config.heartbeat.listener) * 1000) * Liker.progress.level;
		} else {
			
			var newBorn = new Fish(
				tiktoker, //username
				"common", //breed
				data.profilePictureUrl, //profile pic
				Math.ceil(config.age.common / config.heartbeat.listener) * 1000 //age
			);

			lobby.set(tiktoker, newBorn);

			newBorn.update();
			console.log(tiktoker + " joined..");
		}

		counter.like += data.likeCount;
	})

	/*
	* New Viewer
	*/
	connection.on('member', (data) => {
		
	})

	/* 
	* Comment Event
	*/
	connection.on('chat', (data) => {
		var tiktoker = data.uniqueId;

		if (lobby.get(tiktoker) != null || undefined) {
			var Commentator = lobby.get(tiktoker);
			Commentator.name = "💬 " + sanitize(data.comment.substr(0, 45));

			tempName[tiktoker] = 5;
		}
	});

	// New gift received
	connection.on('gift', (data) => {
		var tiktoker = data.uniqueId;

		if (lobby.get(tiktoker) != null || undefined) {
			var Gifter = lobby.get(tiktoker);

			tempGift[ tiktoker ] = {
				time: 5,
				giftimg: data.giftPictureUrl,
				count: data.repeatCount
			};

			Gifter.liveData.giftamount += (data.diamondCount * data.repeatCount);

			if (Gifter.liveData.giftamount >= 1) {
				Gifter.cosmetic.title = "🌱 VIP I 🌱";
				Gifter.cosmetic.titleColor = "#ff1a1a";
				Gifter.size += 3;
			}

			if (Gifter.liveData.giftamount >= 10) {
				Gifter.cosmetic.title = "🌱 VIP II 🌱";
				Gifter.cosmetic.titleColor = "#ff1a1a";
				Gifter.size += 6;
			}

			if (Gifter.liveData.giftamount >= 30) {
				Gifter.cosmetic.title = "💵 ELITE 💵";
				Gifter.cosmetic.titleColor = "#ff1a1a";
				Gifter.size += 9;
			}

			if (Gifter.liveData.giftamount >= 50) {
				Gifter.cosmetic.title = "💵 MILLIONAIRE 💵";
				Gifter.cosmetic.titleColor = "#ff1a1a";
				Gifter.size += 12;
			}
			
			if (Gifter.liveData.giftamount >= 100) {
				Gifter.cosmetic.title = "🔥🔥 LEGENDARY 🔥🔥";
				Gifter.cosmetic.titleColor = "#ff1a1a";
				Gifter.size += 20;
			}

			//tempName[data.uniqueId] = 3;
			// to do: Post the gift
		}

		counter.gift += (data.diamondCount * data.repeatCount);
	})

	// share, follow
	connection.on('social', (data) => {
		//let color = data.displayType.includes('follow') ? '#ff005e' : '#2fb816';
		//addChatItem(color, data, data.label.replace('{0:user}', ''));
		//to do, add "broadcast message"
	})

	connection.on('streamEnd', () => {
		popTikTok_input("TikTok Live has Ended\n");
	})

	/** Canvas Listener **/
	var canvas = document.getElementById("myCanvas");
	canvas.width = innerWidth -20;
	canvas.height = innerHeight * 0.75;

	var ctx = canvas.getContext('2d');
	ctx.fillStyle = "#ffffff"
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	function render() {
		//var img = new Image();
		//img.src = "./img/gate.png";
		//ctx.drawImage(img, 25, 25, 120, 120);
	}

	function getCounter() {
		return counter;
	}
	
	function getLobby() {
		return lobby;
	}
	
	function getConfig() {
		return config;
	}

	const update = () => {
		var background = new Image();
		background.src = "./img/background.jpg";
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		lobby.forEach((fishObj, viewer) => {
			fishObj.update();
			if (fishObj.age <= 0) lobby.delete(viewer);
		});
	}

	setInterval(update, config.heartbeat.listener);
