var Origin = require("./Origin.js");
var Layer = require("./Layer.js");

var Sprite = function (image, milliseconds, origin, layer, x, y) {
	if (milliseconds === undefined) {
		milliseconds = 0;
	}

	if (origin === undefined) {
		origin = Origin.CENTRE;
	}

	if (layer === undefined) {
		layer = Layer.BACKGROUND;
	}

	if (x === undefined) {
		x = 0;
	}

	if (y === undefined) {
		y = 0;
	}

	this.image = image;
	this.ms = milliseconds;

	this.origin = origin;
	this.layer = layer;

	this.x = x;
	this.y = y;
	this.size = 1;

	this.transparency = 1;
	this.rotation = 0;
	this.layer = 0;

	this.chain = [];
	this.inLoop = false;
	this.loops = 0;
	this.loopDuration = 0;

	this.init();

	return this;
};

/**
 * Adds the header for the current object to chain
 * @return {[type]} [description]
 */
Sprite.prototype.init = function() {
	this.chain.push("Sprite," + this.layer + "," + this.origin + "," + this.image + "," + this.x + "," + this.y);
	return this;
};

/**
 * Applys a specific effect object to the current time
 * @param  {Effect} effect the effect to use
 * @param  {int} amount how often should the affect get applied?
 * @return {Sprite}        the sprite itself
 */
Sprite.prototype.applyEffect = function (effect, amount) {
	if (amount === undefined) {
		amount = 1;
	}

	var effectChain, effectEntry;

	effectChain = effect.getChain();
	this.chain.push("_L," + this.ms + "," + amount);

	for (effectEntry in effectChain) {
		this.chain.push(effectChain[effectEntry]);
	}

	this.ms += (effect.ms * amount);

	return this;
};

/**
 * Adds a entry to result chain
 * @param {string} fx       Fx idenifier (F, S, M, etc)
 * @param {int} easing   should easing be used for this one?
 * @param {int} duration how long does the animation take?
 * @param {array} params   everything else
 */
Sprite.prototype.addToChain = function(fx, easing, duration, params) {
	fx = "_" + fx;
	startms = this.ms;
	endms = (this.ms + duration);

	if (this.inLoop) {
		fx = "_" + fx;
		startms = this.loopDuration;
		endms = this.loopDuration + duration;

		this.loopDuration += duration;
	} else {
		this.ms += duration;
	}

	var chainEntry = [
		fx,
		startms,
		endms,
		params.join(",")
	];

	this.chain.push(chainEntry.join(","));

	return this;
};

/**
 * Returns the whole action chain
 * @return {array} the chain itself
 */
Sprite.prototype.getChain = function() {
	return this.chain;
};

/**
 * Does nothing. Simply adds the duration to current ms
 * @param  {int} duration the duration
 * @return {Sprite}          the Sprite itself
 */
Sprite.prototype.sleep = function (duration) {
	this.ms += duration;
	return this;
};

/**
 * Changes x / y of the sprite. Does not write the chain
 * @param {int} x x-coordinate
 * @param {int} y y-coordinate
 */
Sprite.prototype.setPosition = function (x, y) {
	this.x = x;
	this.y = y;

	return this;
};

/**
 * Changes the size of the sprite. Does not write the chain
 * @param {float} size the scale
 */
Sprite.prototype.setSize = function (size) {
	this.size = size;

	return this;
};

/**
 * Sets the transparency of the sprite. Does not write the chian
 * @param {float} transparency the transparency
 */
Sprite.prototype.setTransparency = function (transparency) {
	this.transparency = transparency;

	return this;
};

/**
 * Sets the layer. Does not write the chain
 * @param {string} layer the layer string.
 */
Sprite.prototype.setLayer = function (layer) {
	this.layer = layer;

	return this;
};

/**
 * Sets the Sprites rotation, does not write the chain
 * @param {float} rotation rotation in radiants
 */
Sprite.prototype.setRotation = function (rotation) {
	this.rotation = rotation;

	return this;
};

// Animation methods

/**
 * Fades the sprite in
 * @param  {int} duration animation duration
 * @return {Sprite}          the sprite itself
 */
Sprite.prototype.fadeIn = function (duration) {
	this.addToChain("F", 0, duration, [this.transparency, 1]);
	this.transparency = 1;
	return this;
};

/**
 * Fades the sprite out
 * @param  {int} duration animation duration
 * @return {Sprite}          the sprite itself
 */
Sprite.prototype.fadeOut = function (duration) {
	this.addToChain("F", 0, duration, [this.transparency, 0]);
	this.transparency = 0;
	return this;
};

/**
 * Creates a fading animaiton
 * @param  {int} duration     animation duration
 * @param  {float} transparency target transparency
 * @return {Sprite}              the sprite itself
 */
Sprite.prototype.fade = function (duration, transparency) {
	this.addToChain("F", 0, duration, [this.transparency, transparency]);
	this.transparency = transparency;
	return this;
};

/**
 * Adds a move animation to the chain
 * @param  {int} duration animation duration
 * @param  {int} x        target x-coordinate
 * @param  {int} y        target y-coordinate
 * @return {Sprite}          the sprite itself
 */
Sprite.prototype.moveTo = function (duration, x, y) {
	this.addToChain("M", 0, duration, [this.x, this.y, x, y]);
	this.x = x;
	this.y = y;
	return this;
};

/**
 * Adds a scale animation to the chain
 * @param  {int} duration animation duration
 * @param  {float} newsize  the target size
 * @return {Sprite}          the sprite itself
 */
Sprite.prototype.resize = function (duration, newsize) {
	this.addToChain("S", 0, duration, [this.size, newsize]);
	this.size = newsize;
	return this;
};

/**
 * Adds a rotation animation to the chain
 * @param  {int} duration animation duration
 * @param  {float} rotation target rotation in radiants
 * @return {Sprite}          the sprite itself
 */
Sprite.prototype.rotate = function (duration, rotation) {
	this.addToChain("R", 0, duration, [this.rotation, rotation]);
	this.rotation = rotation;
	return this;
};

/**
 * Switches loop mode on
 * @param  {int} loopcount the amount of loops
 * @return {Sprite}           the sprite itself
 */
Sprite.prototype.startLoop = function (loopcount) {
	if (!this.inLoop) {
		this.chain.push("_L," + this.ms + "," + loopcount);
		this.inLoop = true;
		this.loops = loopcount;
	}

	return this;
};

/**
 * Switches loop mode off
 * @return {Sprite} the sprite itself
 */
Sprite.prototype.endLoop = function () {
	this.inLoop = false;
	this.ms += this.loops * this.loopDuration;
	return this;
};

module.exports = Sprite;