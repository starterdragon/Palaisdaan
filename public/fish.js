class Fish {
	
	constructor(username, breed, profileimg, age) {
		this.name = username;
		this.namecolor = "#ffff99";
		this.myimg = profileimg;
		this.breed = breed;
		this.age = age;

		this.size = 50;
		this.facing = 1;
		this.speed = 1.5;
		this.velocity = {x:0,y:0};
		this.direction = {x:0,y:0};
		this.movecooldown = 0;
		
		this.x = mt_rand(5, canvas.width - 1);
		this.y = mt_rand(5, canvas.height - 1);

		this.progress = {
			exp: 0,
			level: 1,
			limit: 100
		};

		this.liveData = {
			isFollower: false,
			isSubscriber: false,
			gifterRank: null,
			TotalGift: 0,
			TotalLikes: 0,
			PendingLikes: 0
		};
		
		this.cosmetic = {
			title: "Live Viewer",
			titleColor: "#ff66ff"
		};
	}

	checkBoundary(){
		//left border
		if ( this.x < 1 /*0 + (this.size / 2)*/ ) {
			this.x = 1; //0 + this.size;
			this.direction.x = mt_rand(7, 11);
			this.facing = 1;
		}

		//upper border
		else if (this.x > canvas.width - this.size) {
			this.x = canvas.width - this.size;
			this.direction.x = mt_rand(-11, -7);
			this.facing = 0;
		}

		//upper border
		if (this.y < 0 + this.size){
			this.y = 0 + this.size;
		}
		//lower border
		else if (this.y > canvas.height - this.size){
			this.y = canvas.height - this.size;
		}
	}
	
	getAge() {
		return this.age;
	}

	render() {
		/** WINGS **/
		//var wing = new Image();
		//wing.src = "https://tenor.com/bpNcZ.gif";
		//ctx.drawImage(wing, this.x - (this.size / 2), this.y, this.size * 2, this.size * 2);
		
		var fish = new Image();
		fish.src = (this.facing) ? "./img/" + this.breed + "-right.png" : "./img/" + this.breed + "-left.png";
		ctx.drawImage(fish, this.x, this.y, this.size + (this.size * 0.25), this.size);

		/** NAMETAG **/
		ctx.font = /*(this.size / 2)+*/ "20px Arial";
		ctx.fillStyle = this.cosmetic.titleColor;
		ctx.fillText(this.cosmetic.title, this.x - (this.size / 2), this.y - 23);

		ctx.font = "22px Arial";
		ctx.fillStyle = this.namecolor;
		if (this.age <= /*((30 / 50) * 1000) =*/ 600) {
			ctx.fillText("💀 " + (this.age / 50) + "s | " + this.name, this.x - (this.size / 2), this.y - 3);
		} else {
			ctx.fillText(this.name, this.x - (this.size / 2), this.y - 3);
		}

		var pfp = new Image();
		pfp.src = this.myimg;
		ctx.drawImage(pfp, (this.x - (this.size / 2)) - 25, this.y - 20, 20, 20);
		
		/** LIKES **/
		if (this.liveData.PendingLikes > 0) {
			var pointX = this.x - (this.size / 2);
			var pointY = this.y + this.size + 10;

			ctx.font = "22px Arial";
			ctx.fillText("consuming x" + this.liveData.PendingLikes + " 💕", pointX, pointY);

			var percentage = (this.progress.exp / this.progress.limit) * 100;

			ctx.fillStyle = 'hsla(' + this.progress.exp + ', 100%, 50%, 1)';
			ctx.fillRect(pointX, pointY + 4, percentage, 10);

			var grad = ctx.createLinearGradient(0, 0, 0, 180);
			grad.addColorStop(0, "transparent");
			grad.addColorStop(1, "rgba(0,0,0,0.8)");
			ctx.fillStyle = grad;
			ctx.fillRect(pointX, pointY + 4, percentage, 10);
			
			this.liveData.PendingLikes--;
		}
	}
	
	update() {
		this.age--;

		if (this.movecooldown > 0) {
			this.movecooldown--;
		} else {
			this.wander();
		}

		if (this.direction.x == 0 && this.direction.y == 0){
			this.velocity.x *= 0.97;
			this.velocity.y *= 0.97;
			this.x += this.velocity.x;
			this.y += this.velocity.y;
			let stopThreashold = 0.01;
			if ((this.velocity.x < stopThreashold && this.velocity.x > 0 || this.velocity.y < stopThreashold && this.velocity.y > 0) || (this.velocity.x > stopThreashold * -1 && this.velocity.x < 0 || this.velocity.y > stopThreashold * -1 && this.velocity.y < 0)){
				this.velocity.x = 0;
				this.velocity.y = 0;
			}

			this.checkBoundary();
			this.render();
			return;
		}

		this.move();
		this.render();
		//this.randomChase();
	}

	wander() {
		var odds = Math.ceil(mt_rand(0, 10));
		if (odds >= 4) {
			this.speed = mt_rand(0.2, 1.4);

			this.direction.y = mt_rand(-20, 20);
			this.direction.x = mt_rand(-30, 30);

			this.facing = (this.direction.x < 0) ? 0 : 1;

			var cfg = getConfig();
			this.movecooldown = Math.ceil(4 * 1000) / cfg.heartbeat.listener;
		}
	}

	randomChase() {
		var odds = Math.ceil(mt_rand(0, 10));
		if (odds < 3) {
			var lobby = getLobby();
			for (let fish of lobby) {
				var fishObj = fish[1];
				console.log(fishObj.name);
				if (fishObj != this) {
					if (fishObj.size <= this.size) {
						this.speed = mt_rand(2.3, 2.9);
						this.direction.x = (fishObj.x + fishObj.size) - this.x;
						this.direction.y = (fishObj.y + fishObj.size) - this.y;
						this.facing = (this.direction.x < 0) ? 0 : 1;

						break;
					}
				}
			}
		}
	}
	
	move() {
		let mag = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y);
		
		this.direction.x = this.direction.x / mag;
		this.direction.y = this.direction.y / mag;
		
		this.velocity.x = this.direction.x * this.speed;
		this.velocity.y = this.direction.y * this.speed;
		this.velocity.x = this.velocity.x * 2.35;
		this.velocity.y = this.velocity.y * 2.35;
		
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		
		this.direction.x = 0;
		this.direction.y = 0;

		//this.hasCollided();
		this.checkBoundary();
	}
	
	hasCollided () {
		var collidable = [].concat(lobby, obstacles);
		console.log(collidable.length);
		Object.keys( collidable ).forEach(function ( obj ) {
			console.log(obj);
			if (obj === this) return;
			
			var w2 = this.x + this.size;
			var w1 = obj.x + (obj.width ?? obj.size);
			console.log(w2);
			console.log(w1);
			
			if (this.x > w1 || obj.x > w2) return;
			
			var h2 = this.y + this.size;
			var h1 = obj.y + (obj.width ?? obj.size);
			
			console.log(h2);
			console.log(h1);
			if (y2 > h1 || y1 > h2) return;

			this.velocity.x = 0;
			this.velocity.y = 0;
		});
	}
}

const mt_rand = (min, max) => {
	return Math.random() * (max - min + 1) + min;
}
