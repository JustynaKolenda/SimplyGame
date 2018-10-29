var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

 var Box ={
	 width : 512,
	 height : 480
 };
canvas.width = Box.width;
canvas.height = Box.height;
document.body.appendChild(canvas);

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};

bgImage.src = "./images/background.png";

var mountainReady = false;
var mountainImage = new Image();
mountainImage.onload = function () {
	mountainReady = true;
	
};
mountainImage.src = "./images/mountain.png";

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = './images/player.png';

var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = './images/monsterall.png';


class mountain {
   constructor(x, y) {
    this.x = x;
    this.y = y;
	this.width = 30;
	this.height = 32;
   }

}

let listObstacle = new Array();
for (i=0;i<20;i++){
  let x = Math.floor(Math.random() * 423) + 30;
  let y = Math.floor(Math.random() * 385) + 32;
  listObstacle.push(new mountain(x, y));
   
};
console.log(listObstacle);



var hero ={ 
	x: 0,
	y: 0,
	speed: 100,
	width:50,
	height:60,
	direction:"Top",
	img : {
			Bottom : {
				sx: 3,
				sy: 0.5,
			},
			Left : {
				sx: 3,
				sy: 32,
			},
			Right : {
				sx: 3,
				sy: 64,
			},
			Top : {
				sx : 3,
				sy : 96,
			}

	},

		
	coliObstacle : (x,y)=>{

			for(i=0; i< listObstacle.length; i++){

					if (
						x <= (listObstacle[i].x + 30)
						&& listObstacle[i].x <= (x + 30)
						&& y <= (listObstacle[i].y + 16)
						&& listObstacle[i].y <= (y + 35)
					) {
						return false;
					}

			}

				return true;

	},
	

	go : (direction,modifier)=>{
		let extraVector = 0;
		hero.direction = direction;
		switch(direction) {
			case "Top":
				extraVector = hero.y - hero.speed * modifier;
				
				if(extraVector>=0){
					if(hero.coliObstacle(hero.x, extraVector)){
						hero.y = extraVector;
					}
					
				}
				break;
			case "Bottom":
				extraVector = hero.y + hero.speed * modifier;
				if((extraVector+hero.height)<=Box.height){
					if(hero.coliObstacle(hero.x, extraVector)){
						hero.y = extraVector;
					}
				}
				break;
			case "Left":
				extraVector = hero.x - hero.speed * modifier;
				if(extraVector>=0){
					if(hero.coliObstacle(extraVector, hero.y)){
						hero.x = extraVector;
					}
				}
				break;
			case "Right":
				extraVector = hero.x + hero.speed * modifier;
				
				if((extraVector+hero.width)<=Box.width){
					if(hero.coliObstacle(extraVector, hero.y)){
						hero.x = extraVector;
					}
				}
				break;
			default:
				
		}
	}	
};

       
var monster = {
	x: 0,
	y: 0,
	speed: 100,
	width:36,
	height:56,
	directionCounter : 0,
	direction : 'Top',
	img : {
			Bottom : {
				sx: 3,
				sy: 0.5,
			},
			Left : {
				sx: 3,
				sy: 32,
			},
			Right : {
				sx: 3,
				sy: 64,
			},
			Top : {
				sx : 3,
				sy : 96,
			}

	},
	coliObstacle : (x,y)=>{

				for(i=0; i< listObstacle.length; i++){

						if (
							x <= (listObstacle[i].x + 30)
							&& listObstacle[i].x <= (x + 30)
							&& y <= (listObstacle[i].y + 16)
							&& listObstacle[i].y <= (y + 35)
						) {
							return false;
						}

				}

					return true;

	},

	go : function(modifier){
		monster.directionCounter ++;

			if(monster.directionCounter> 30){
				let	direction = ['Right', 'Bottom','Left', 'Top'];
				let nextVector = Math.floor(Math.random() * 4);
				monster.direction = direction[nextVector];
				monster.directionCounter = 0;
			}
		let extraVector = 0;
		
		switch(monster.direction) {	
			case "Top":
				extraVector = monster.y - monster.speed * modifier;
				if(extraVector>=0){
					if(monster.coliObstacle(monster.x, extraVector)){
						monster.y = extraVector;
					}
				}
				break;
			case "Bottom":
				extraVector =monster.y + monster.speed * modifier;
				if((extraVector+monster.height)<=Box.height){
					if(monster.coliObstacle(monster.x, extraVector)){
					monster.y = extraVector;
					}
				}
				break;

			case "Left":
				extraVector = monster.x - monster.speed * modifier;
				if(extraVector>=0){
					if(monster.coliObstacle(extraVector, monster.y)){
						monster.x = extraVector;
					}
				}
				break;

			case "Right":
				extraVector = monster.x + monster.speed * modifier;
				
				if((extraVector+monster.width)<=Box.width){
					if(monster.coliObstacle(extraVector, monster.y)){
						monster.x = extraVector;
					}
				}
				break;
			default:
				
		}
	}
};
var monstersCaught = 0;

 	 

	var keysDown = {};
	addEventListener("keydown", function (e) {
				keysDown[e.keyCode] = true;
			}, false);

	addEventListener("keyup", function (e) {
				delete keysDown[e.keyCode];
			}, false);
	

	// Reset the game when the player catches a monster
	var reset = function () {
		hero.x = canvas.width / 2;
		hero.y = canvas.height / 2;

		// Throw the monster somewhere on the screen randomly
		monster.x = 32 + (Math.random() * (canvas.width - 74));
		monster.y = 32 + (Math.random() * (canvas.height - 74));

		
		
	};

	
	var update = function (modifier) {
			if (38 in keysDown) { // Player holding up
				hero.go("Top",modifier);
			}
			if (40 in keysDown) { // Player holding down
				hero.go("Bottom",modifier);
			}
			if (37 in keysDown) { // Player holding left
				hero.go("Left",modifier);
			}
			if (39 in keysDown) { // Player holding right
				hero.go("Right",modifier);
			}

		  
			monster.go(modifier);
		
					// Are they touching?
			if (
				hero.x <= (monster.x + 32)
				&& monster.x <= (hero.x + 32)
				&& hero.y <= (monster.y + 32)
				&& monster.y <= (hero.y + 32)
			) {
				++monstersCaught;
				reset();
			}
			
		};

	var render = function () {
		var draw = hero.img[hero.direction]; 
		var drawMon = monster.img[monster.direction];   

		if (bgReady) {
			ctx.drawImage(bgImage, 0, 0);
		}

		if (heroReady) {

			ctx.drawImage(heroImage, draw.sx, draw.sy, 25, 30, hero.x, hero.y, hero.width, hero.height );
		}

		if (monsterReady) {
		ctx.drawImage(monsterImage, drawMon.sx, drawMon.sy, 22, 32,monster.x, monster.y, 36, 56);
	
		}
		
		if (mountainReady) {
			listObstacle.forEach((obstacle)=>{
				
				ctx.drawImage(mountainImage, obstacle.x, obstacle.y);

			})
		}

		// Score
		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Monsterrs caught: " + monstersCaught, 32, 32);

	};

	var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();