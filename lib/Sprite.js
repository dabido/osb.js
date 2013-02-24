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
		x = 320;
	}

	if (y === undefined) {
		y = 240;
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
    
    this.r = 255;
    this.g = 255;
    this.b = 255;

	this.chain = [];
	this.inLoop = false;
	this.loops = 0;
	this.loopDuration = 0;

	this.inBatch = false;
	this.batchDuration = 0;

	this.init();
    
    this.manager = new SpriteManager();
    this.manager.add(this);

	return this;
};

/**
 * Adds the header for the current object to chain
 * @return {Sprite} The Sprite itself
 */
Sprite.prototype.init = function() {
	this.chain.push("Sprite," + this.layer + "," + this.origin + ",\"" + this.image + "\"," + this.x + "," + this.y);
	return this;
};

/**
 * Overwrites the current ms
 * @param {int} ms the target milliseconds
 * @return {Sprite} The Sprite itself
 */
Sprite.prototype.setTime = function(ms) {
    this.ms = ms;
    
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
    var startms, endms;
	fx = "_" + fx;
	startms = this.ms;
	endms = (this.ms + duration);

	if (this.inLoop) {
		fx = "_" + fx;
		startms = this.loopDuration;
		endms = this.loopDuration + duration;

		if (!this.inBatch) {
			this.loopDuration += duration;
		}
	} else {
		if (!this.inBatch) {
			this.ms += duration;	
		}
	}

	if (this.inBatch) {
		if (duration > this.batchDuration) {
			this.batchDuration = duration;
		}
	}

	var chainEntry = [
		fx,
		easing,
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
 * Sets the transparency of the sprite. Does not write the chain
 * @param {float} transparency the transparency
 */
Sprite.prototype.setTransparency = function (transparency) {
	this.transparency = transparency;

	return this;
};

/**
 * Overwrites the current color of the sprite. Does not write the chain
 * @param {int} r red value
 * @param {int} g green value
 * @param {int} b blue value
 */
Sprite.prototype.setColor = function (r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    
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
 * @param {int} easing the esaing parameter, 0, 1, 2
 * @return {Sprite}          the sprite itself
 */
Sprite.prototype.fadeIn = function (duration, easing) {
	if (easing === undefined) {
		easing = 0;
	}

	this.addToChain("F", easing, duration, [this.transparency, 1]);
	this.transparency = 1;
	return this;
};

/**
 * Fades the sprite out
 * @param  {int} duration animation duration
 * @param {int} easing the esaing parameter, 0, 1, 2
 * @return {Sprite}          the sprite itself
 */
Sprite.prototype.fadeOut = function (duration, easing) {
	if (easing === undefined) {
		easing = 0;
	}

	this.addToChain("F", easing, duration, [this.transparency, 0]);
	this.transparency = 0;
	return this;
};

/**
 * Creates a fading animaiton
 * @param  {int} duration     animation duration
 * @param  {float} transparency target transparency
 * @param {int} easing the esaing parameter, 0, 1, 2
 * @return {Sprite}              the sprite itself
 */
Sprite.prototype.fade = function (duration, transparency, easing) {
	if (easing === undefined) {
		easing = 0;
	}

	this.addToChain("F", easing, duration, [this.transparency, transparency]);
	this.transparency = transparency;
	return this;
};

/**
 * Adds a move animation to the chain
 * @param  {int} duration animation duration
 * @param  {int} x        target x-coordinate
 * @param  {int} y        target y-coordinate
 * @param {int} easing the esaing parameter, 0, 1, 2
 * @return {Sprite}          the sprite itself
 */
Sprite.prototype.moveTo = function (duration, x, y, easing) {
	if (easing === undefined) {
		easing = 0;
	}

	this.addToChain("M", easing, duration, [this.x, this.y, x, y]);
	this.x = x;
	this.y = y;
	return this;
};

/**
 * Adds a scale animation to the chain
 * @param  {int} duration animation duration
 * @param  {float} newsize  the target size
 * @param {int} easing the esaing parameter, 0, 1, 2
 * @return {Sprite}          the sprite itself
 */
Sprite.prototype.resize = function (duration, newsize, easing) {
	if (easing === undefined) {
		easing = 0;
	}

	this.addToChain("S", easing, duration, [this.size, newsize]);
	this.size = newsize;
	return this;
};

/**
 * Adds a rotation animation to the chain
 * @param  {int} duration animation duration
 * @param  {float} rotation target rotation in radiants
 * @param {int} easing the esaing parameter, 0, 1, 2
 * @return {Sprite}          the sprite itself
 */
Sprite.prototype.rotate = function (duration, rotation, easing) {
	if (easing === undefined) {
		easing = 0;
	}

	this.addToChain("R", easing, duration, [this.rotation, rotation]);
	this.rotation = rotation;
	return this;
};

/**
 * Changes the color of the sprite
 * @param  {int} duration animation duration
 * @param {int} r red value
 * @param {int} g green value
 * @param {int} b blue value
 * @param {int} easing the esaing parameter, 0, 1, 2
 * @return {Sprite}          the sprite itself
 */
Sprite.prototype.color = function (duration, r, g, b, easing) {
    if (easing === undefined) {
    	easing = 0;
    }

    this.addToChain("C", easing, duration, [this.r, this.g, this.b, r, g, b]);
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
};

/**
 * Executes osu parameter command
 * @param  {int} duration the duration
 * @param  {string} string   parameter string (H, V, A)
 * @param {int} easing the esaing parameter, 0, 1, 2
 * @return {Sprite}          the sprite itself
 */
Sprite.prototype.parameter = function (duration, string, easing) {
	if (easing === undefined) {
		easing = 0;
	}

	this.addToChain("P", easing, duration, [string]);
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
		this.loopDuration = 0;
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

/**
 * Starts a parallel action batch
 * @return {Sprite} the sprite itself
 */
Sprite.prototype.startBatch = function () {
	this.inBatch = true;
	this.batchDuration =0;
	return this;
};

/**
 * Closes the parallel batch
 * @return {Sprite} the sprite itself
 */
Sprite.prototype.endBatch = function() {
	this.inBatch = false;
	if (this.inLoop) {
		this.loopDuration += this.batchDuration;
	} else {
		this.ms += this.batchDuration;	
	}
	
	return this;
};