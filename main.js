
var Origin = require("./lib/Origin.js");
var Layer = require("./lib/Layer.js");
var Effect = require("./lib/Effect");
var Sprite = require("./lib/Sprite.js");



var testEffect = new Effect();
testEffect
	.fadeIn(100)
	.fadeOut(100);


// Test
/*
var mySprite = new Sprite("testdf.png")
	.fadeIn(200)
	.moveTo(100, 100, 200)
	.fadeOut(100)
	.resize(200, 0.8)
	.resize(200, 1)
		.startLoop(10)
			.resize(200, 2)
			.fade(800, 0.5)
		.endLoop()
	.resize(100, 1)
	.sleep(1000)
	.fadeIn(200)
	;
*/

var mySprite = new Sprite("asdf.png");
	mySprite
		.applyEffect(testEffect, 10)
			.fadeOut(500)
			.sleep(1500)
		.applyEffect(testEffect, 1)
		.fadeOut(200)
		.startLoop(2)
			.fadeIn(50)
			.fadeOut(50)
		.endLoop()
	;

var chain = mySprite.getChain();
for (v in chain) {
	console.info(chain[v]);
}

console.info("----------");

var asdf = testEffect.getChain();
for (v in asdf) {
	console.info(asdf[v]);
}