function CCar (oInfo, iType, oParentContainer){
    
    var _bGone;
    
    var _szVerse;
    
    var _iTimeElaps;
    var _iWidth;
    var _iHeight;
    var _iEnd;
    
    var _oCar;
    var _oInfo;
    var _oParent;
    
    
    this.init = function (oInfo, iType, oParentContainer){
        _bGone = false;
        
        _iTimeElaps = 0;
        
        _oInfo = {pos: oInfo.pos, start: oInfo.start, end: oInfo.end, speed: oInfo.speed, occur: oInfo.occur};        
        
        var szTag = "car_" + iType;
        var oSprite = s_oSpriteLibrary.getSprite(szTag);
        _iWidth = oSprite.width;
        _iHeight = oSprite.height;
        
        _oCar = createBitmap(oSprite);
        _oCar.x = _oInfo.start;
        _oCar.y = _oInfo.pos;
        _oCar.regX = _iWidth/2;
        _oCar.regY = _iHeight/2;
        
        if(_oInfo.start < _oInfo.end){
            _oCar.rotation = 180;
            //_iEnd = //CANVAS_WIDTH + UNLOAD_OFFSET;
            _szVerse = "right";
        } else {
            //_iEnd = //-UNLOAD_OFFSET;
            _szVerse = "left";
        }
        _iEnd = _oInfo.end;
        
        oParentContainer.addChild(_oCar);
        
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oCar);
    };
    
    this.playHornet = function (oFrogPos){
        var iRandomHornet = Math.random();
        
        if((DISABLE_SOUND_MOBILE === false || s_bMobile === false) && iRandomHornet < 0.66 && oFrogPos > 2 && oFrogPos < 8){
        
            if(iType === 0 || iType === 1){
                playSound("big_hornet",1,false);
                
            } else {
                playSound("small_hornet",1,false);
            }

        }
    };
    
    this.instantCar = function(iX){
        _oInfo.speed = oInfo.speed/2;
        _oInfo.start = iX;
        
    };
    
    this.setPos = function(iX, iY){
        _oCar.x = iX;
        _oCar.y = iY;
    };
    
    this.getType = function(){
        return "car";
    };
    
    this.setGone = function(bVal){
        _bGone = bVal;
    };
    
    this.getGone = function(){
        return _bGone;
    };
    
    this.getLogicRect = function(){
        return new createjs.Rectangle(_oCar.x - _iWidth/2,_oCar.y - _iHeight/2,_iWidth,_iHeight);
    };
    
    this.update = function(){
        if(_bGone){
            return;
        }

        _iTimeElaps += s_iTimeElaps; 
        var fLerp = easeLinear( _iTimeElaps, 0, 1, _oInfo.speed);
        var iNewX = tweenVectorsOnX(_oInfo.start, _iEnd, fLerp );
        
        _oCar.x = iNewX;
        
        if( (_szVerse === "right" && _oCar.x >  _iEnd) || (_szVerse === "left" && _oCar.x <  _iEnd)){
            _bGone = true;
            s_oGame.addElemToRemoveList(this);            
        }
    };
    
    _oParent = this;
    this.init (oInfo, iType, oParentContainer);
    
}
