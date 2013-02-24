var SpriteManager = function () {
    "use strict";
    if (SpriteManager.prototype.singletonInstance) {
        return SpriteManager.prototype.singletonInstance;
    }
    
    SpriteManager.prototype.singletonInstance = this;
};

SpriteManager.prototype.sprites = [];

SpriteManager.prototype.add = function (sprite) {
    "use strict";
    SpriteManager.prototype.sprites.push(sprite);
};

SpriteManager.prototype.get = function () {
    "use strict";
    return SpriteManager.prototype.sprites;
};