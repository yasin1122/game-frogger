function CFly(iX, iY, iCell){
    
    var _oFly;
    
    this._init = function(iX, iY, iCell){
        
        var oSprite = s_oSpriteLibrary.getSprite('fly');
        _oFly = createBitmap(oSprite);
        _oFly.x = iX;
        _oFly.y = iY;
        _oFly.regX = oSprite.width/2;
        _oFly.regY = oSprite.height/2;
        s_oStage.addChild(_oFly);
        
        var oParent = this;
        createjs.Tween.get(_oFly).wait(TIME_FLY_TO_DISAPPEAR).call(function(){oParent.unload(); s_oGame.freeCell(iCell);});//.to({alpha : 0}, 4000, createjs.Ease.linear).call(function(){oParent.unload();});
    };
    
    this.unload = function(){
        createjs.Tween.removeTweens(_oFly);
        s_oStage.removeChild(_oFly);
    };
    
    
    
    this._init(iX, iY, iCell);
}
