function CTurtle (oInfo, iType, iOffset, oParentContainer){
    
    var _bGone;
    
    var _szVerse;
    
    var _iWidth;
    var _iHeight;
    var _iStart;
    var _iEnd;
    var _iTimeElaps;
    var _iMoveOffset;
    var _iPrevX;

    var _oRect;
   
    var _oTurtle;
    var _oInfo;
    var _oParent;
    var _oParentContainer;
    
    this.init = function (oInfo, iType, iOffset, oParentContainer){
        _bGone = false;
        
        _iWidth = 74;
        _iHeight = 74;
        _iTimeElaps = 0;
        
        _oRect = {w: 70, h: 50};
        
        _oInfo = oInfo;
        _oParentContainer = oParentContainer;
        
        var oAnim;
        if(iType === 0){
            oAnim = {idle : [0,33]};
        } else {
            oAnim = {idle : [0,99]};
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('turtle');      
        var oData = {   // image to use
                        images: [oSprite],
                        // width, height & registration point of each sprite
                        frames: {width: _iWidth, height: _iHeight, regX: _iWidth/2, regY: _iHeight/2}, 
                        animations: oAnim                   
        };
        
        var oSpriteSheet = new createjs.SpriteSheet(oData);                       
        _oTurtle = createSprite(oSpriteSheet,"idle",0,0,_iWidth,_iHeight);        
        _oTurtle.y = _oInfo.pos;
        
        _iStart = _oInfo.start + iOffset;
                
        if(_oInfo.start < _oInfo.end){
            _oTurtle.rotation = 180;
            //_iEnd = CANVAS_WIDTH + UNLOAD_OFFSET + iOffset;
            _szVerse = "right";
        } else {
            //_iEnd = -100 -UNLOAD_OFFSET + iOffset;
            _szVerse = "left";
        }
        _iEnd = _oInfo.end + iOffset -100;
        
        _oParentContainer.addChild(_oTurtle);
        
    };
    
    this.unload = function(){
        _oParentContainer.removeChild(_oTurtle);
    };
    
    this.stopAnim = function(){
        _oTurtle.stop();
    };
    
    this.getType = function(){
        return "support";
    };
    
    this.getPos = function(){
        return {x: _oTurtle.x, y: _oTurtle.y};
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
        if(_oTurtle.currentAnimationFrame < 40 ||  _oTurtle.currentAnimationFrame > 90 ){
            return new createjs.Rectangle(_oTurtle.x - _oRect.w/2,_oTurtle.y - _oRect.h/2,_oRect.w,_oRect.h);
        }else {
            return null;
        }
        
    };
    
    this.update = function(){
        if(_bGone){
            return;
        }
        _iTimeElaps += s_iTimeElaps; 
        var fLerp = easeLinear( _iTimeElaps, 0, 1, oInfo.speed);
        var iNewX = tweenVectorsOnX(_iStart, _iEnd, fLerp);
        
        _iPrevX = _oTurtle.x;
        _oTurtle.x = iNewX;
        
        _iMoveOffset = iNewX - _iPrevX;

        if( (_szVerse === "right" && _oTurtle.x >  _iEnd) || (_szVerse === "left" && _oTurtle.x <  _iEnd)){
            _bGone = true;
            s_oGame.addElemToRemoveList(this);            
        }
    };
    
    _oParent = this;
    this.init (oInfo, iType, iOffset, oParentContainer);
    
}
