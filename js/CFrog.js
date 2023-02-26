function CFrog(iX, iY, oParentContainer){
    
    var _bDead;
    var _bJumping;
    var _bTextVisible;
    
    var _iWidth;
    var _iHeight;
    var _iSpeed;
    
    var _oRect;
    
    var _oFrog;
    var _oSkidMarks;
    var _oContainer;
    
    this._init = function(iX, iY, oParentContainer){
        _bDead = false;
        _bJumping = false;
        _bTextVisible = true;
       
        _iWidth = 50;
        _iHeight = 75;
        _iSpeed = FROG_SPEED;
        
        _oRect = {w: 10, h: 25};
                
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;    
        oParentContainer.addChild(_oContainer);
       
        var oSprite = s_oSpriteLibrary.getSprite('frog');
        var oData = {   // image to use
                        images: [oSprite],
                        // width, height & registration point of each sprite
                        frames: {width: _iWidth, height: _iHeight, regX: _iWidth/2, regY: _iHeight/2}, 
                        animations: {  idle: [0], jump: [1,5,"idle"], splat: [6], drown: [7,44,"drown_stop"], drown_stop: [44], skid_marks: [45] }
                        
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);        
                
        _oFrog = createSprite(oSpriteSheet,"jump",0,0,_iWidth,_iHeight);
        _oContainer.addChild(_oFrog);
        
        _oSkidMarks = createBitmap(s_oSpriteLibrary.getSprite('skid_rows'));
		_oSkidMarks.regX = _iWidth/2;
		_oSkidMarks.regY = _iHeight/2;
        _oSkidMarks.visible = false;
        _oContainer.addChild(_oSkidMarks);

    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oContainer);
    };
    
    this._disappear = function(){
        var oParent = this;
        createjs.Tween.get(_oContainer).wait(2000).to({alpha : 0}, 2000, createjs.Ease.linear).call(function(){oParent.unload();});
    };
    
    this.move = function (iX, iY, szType, iPos){
        _bJumping = true;
        
        playSound("jump",1,false);

        
        switch(szType){
            
            case "up":  {
                
                _oFrog.rotation = 0;    
                    
                break;
            }
            
            case "down":  {
                
                _oFrog.rotation = 180;    
                    
                break;
            }
            
            case "left":  {
                
                _oFrog.rotation = 270;    
                    
                break;
            }
            
            case "right":  {
                
                _oFrog.rotation = 90;    
                    
                break;
            }
        }
        
        _oFrog.gotoAndPlay("jump");
        createjs.Tween.get(_oContainer).to({x:iX, y:iY}, _iSpeed, createjs.Ease.linear).call(function(){s_oGame.updateLogicPos();_bJumping = false});
        createjs.Tween.get(_oContainer).to({scaleX:1.5, scaleY:1.5}, _iSpeed/2, createjs.Ease.quintIn).to({scaleX:1, scaleY:1}, _iSpeed/2, createjs.Ease.quintIn);
    };
    
    this.isJumping = function(){
        return _bJumping;
    };
    
    this.setTextVisible = function(bVal){
        _bTextVisible = bVal;
    };
    
    this.drown = function(){
        playSound("drown",1,false);
        
        _bDead = true;
        _oFrog.gotoAndPlay("drown");
        var oComic = new CWinText(TEXT_DROWN, this.getPos().x, this.getPos().y, _bTextVisible);
        oComic.drown();
        this._disappear();
    };
    
    this.splat = function() {
        playSound("splat",1,false);
        
        _oFrog.gotoAndPlay("splat");
        _oSkidMarks.visible = true;
        _bDead = true;
        var oComic = new CWinText(TEXT_SPLAT, this.getPos().x, this.getPos().y, _bTextVisible);
        oComic.splat();
        this._disappear();
    };
    
    this.crash = function(){
        playSound("splat",1,false);
        
        _oFrog.gotoAndPlay("splat");
        _bDead = true;
        var oComic = new CWinText(TEXT_SPLAT, this.getPos().x, this.getPos().y, _bTextVisible);
        oComic.splat();
        this._disappear();
    };
    
    this.great = function(){
        var oComic = new CWinText(TEXT_GREAT, this.getPos().x, this.getPos().y, _bTextVisible);
        oComic.great();
    };
    
    this.getDead = function (){
        return _bDead;
    };
    
    this.setPos = function(iX, iY){
        _oContainer.x = iX;
        _oContainer.y = iY;
    };
    
    this.getPos = function(){
        return {x: _oContainer.x, y: _oContainer.y};
    };
    
    this.getContainer = function (){
        return _oContainer;
    };
    
    this.getLogicRect = function(){
        return new createjs.Rectangle(_oContainer.x - _oRect.w/2, _oContainer.y - _oRect.h/2, _oRect.w, _oRect.h);
    };
    
    this.carry = function (iValue){
        _oContainer.x += iValue;
    };
    
    this._init(iX, iY, oParentContainer);
    
    
}