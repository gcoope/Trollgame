// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {
	xspeed: 2,
	yspeed: 2
};
var monstersCaught = 0;


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var initObjects = function ()
{
	// Initial hero placement
	hero.x = ((canvas.width / 2) - heroImage.width/2);
	hero.y = ((canvas.height / 2) - heroImage.height/2);
}

// Reset the monster when the player catches a monster
var reset = function () {

	var coords = new Array(50, 100, 150, 200, 250, 300, 350);
	
	var xChosen = coords[Math.floor (Math.random() * coords.length)];
	var yChosen = coords[Math.floor (Math.random() * coords.length)];

	monster.x = xChosen;
	monster.y = yChosen;
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Edge collisions
	if (hero.y < 30)
	{
		hero.y = 31;
	}
	if (hero.y > (canvas.height - 64)) 
	{
		hero.y = canvas.height - 65;
	}
	if (hero.x < 30)
	{
		hero.x = 31; 
	}
	if (hero.x > (canvas.width-64))
	{
		hero.x = (canvas.width - 65);
	}
	
	// Collision
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}

	// Monster movement	
	monster.x += monster.xspeed;
	monster.y += monster.yspeed;

	if (monster.x > canvas.width - (monsterImage.width*2))
	{
		monster.xspeed = -monster.xspeed;
	}
	else if (monster.x < monsterImage.width)
	{
		monster.xspeed = -monster.xspeed;
	}
	else if (monster.y > (canvas.height - (monsterImage.height*2)))
	{
		monster.yspeed = -monster.yspeed;
	}
	else if (monster.y < monsterImage.height)
	{
		monster.yspeed = -monster.yspeed;
	}


};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Draw the score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Trolls caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

initObjects();
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
