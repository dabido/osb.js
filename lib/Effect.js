var Sprite = require("./Sprite");

var Effect = function () {
	this.ms = 0;

	this.x = 0;
	this.y = 0;
	this.size = 1;

	this.transparency = 1;
	this.rotation = 0;
	this.layer = 0;

	this.chain = [];

	return this;
};

Effect.prototype = Object.create(Sprite.prototype);
Effect.prototype.constructor = Effect;

/**
 * Adds a entry to result chain
 * @param {string} fx       Fx idenifier (F, S, M, etc)
 * @param {int} easing   should easing be used for this one?
 * @param {int} duration how long does the animation take?
 * @param {array} params   everything else
 */
Effect.prototype.addToChain = function(fx, easing, duration, params) {
	fx = "__" + fx;
	startms = this.ms;
	endms = this.ms + duration;

	this.ms += duration;

	var chainEntry = [
		fx,
		startms,
		endms,
		params.join(",")
	];

	this.chain.push(chainEntry.join(","));

	return this;
};

module.exports = Effect;