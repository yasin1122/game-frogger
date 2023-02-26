function CTrunk (oInfo, oParentContainer){
    
    var _bGone;
    
    var _szVerse;
    
    var _iWidth;
    var _iHeight;
    var _iSpeed;
    var _iEnd;
    var _iTimeElaps;
    var _iMoveOffset;
    var _iPrevX;
    
    var shape;
    var _oRect;
    
    var _oTrunk;
    var _oInfo;
    var _oParent;
    var _oParentContainer;
    
    
    this.init = function (oInfo, oParentContainer){
        _bGone = false;
        
        _iWidth = 222;
        _iHeight = 50;
        _iTimeElaps = 0;
        
        _oRect = {w: 190, h: 40};
        
        _oInfo = oInfo;
        _oParentContainer = oParentContainer;
        
        var oSprite = s_oSpriteLibrary.getSprite('trunk');
        var oData = {   // image to use
                        images: [oSprite],
                        // width, height & registration point of each sprite
                        frames: {width: _iWidth, height: _iHeight, regX: _iWidth/2, regY: _iHeight/2}, 
                        animations: {  idle: [0,14]}
                        
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);        
                
        _oTrunk = createSprite(oSpriteSheet,"idle",0,0,_iWidth,_iHeight);
        
        _oTrunk.x = _oInfo.start;
        _oTrunk.y = _oInfo.pos;
        
        if(_oInfo.start < _oInfo.end){
            _oTrunk.rotation = 180;
            //_iEnd = CANVAS_WIDTH + UNLOAD_OFFSET;
            _szVerse = "right";
        } else {
            //_iEnd = -UNLOAD_OFFSET;
            _szVerse = "left";
        }
        _iEnd = _oInfo.end;

        _oParentContainer.addChild(_oTrunk);
        
    };
    
    this.unload = function(){

        _oParentContainer.removeChild(_oTrunk);
    };
    
    this.stopAnim = function(){
        _oTrunk.stop();
    };
    
    this.getType = function(){
        return "support";
    };
    
    this.getPos = function(){
        return {x: _oTrunk.x, y: _oTrunk.y};
    };
    
    this.getSpeed = function(){
        return _iMoveOffset;
    };
    
    this.setGone = function(bVal){
        _bGone = bVal;
    };
    
    this.getGone = function(){
        return _bGone;
    };
    
    this.getLogicRect = function(){
        return new createjs.Rectangle(_oTrunk.x - _oRect.w/2,_oTrunk.y - _oRect.h/2,_oRect.w,_oRect.h);
    };
    
    this.update = function(){
        if(_bGone){
            return;
        }

        _iTimeElaps += s_iTimeElaps; 
        var fLerp = easeLinear( _iTimeElaps, 0, 1, oInfo.speed);
        var iNewX = tweenVectorsOnX(oInfo.start, _iEnd, fLerp );
        
        _iPrevX = _oTrunk.x;
        _oTrunk.x = iNewX;
        
        _iMoveOffset = iNewX - _iPrevX;

        if( (_szVerse === "right" && _oTrunk.x >  _iEnd) || (_szVerse === "left" && _oTrunk.x <  _iEnd)){
            _bGone = true;
            s_oGame.addElemToRemoveList(this);            
        }
    };
    
    _oParent = this;
    this.init (oInfo, oParentContainer);
    
}
