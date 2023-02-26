function CInterface(){
    var _oAudioToggle;
    var _oButExit;
    var _oHelpPanel=null;
    var _oScoreText;
    var _oScoreNum;
    var _oScoreNumTextOutline;
    var _oTimeText;
    var _oBarFill;
    var _oMask;    
    var _oLifeText;
    var _oInfoBg;
    var _oLifeContainer;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosLife;
    var _pStartPosFullscreen;
    
    this._init = function(){                
        
        var oSprite = s_oSpriteLibrary.getSprite('gui_panel_top');
        var oTopPanel = createBitmap(oSprite);
        s_oStage.addChild(oTopPanel);
        
        
        var oExitX;
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 5, y: (oSprite.height/2) + 5};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        oExitX = CANVAS_WIDTH - (oSprite.width/2) - 70;
        
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _pStartPosAudio = {x: oExitX, y: (oSprite.height/2) + 5};
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
            
            _pStartPosFullscreen = {x:_pStartPosAudio.x - oSprite.width/2 - 10,y:oSprite.height/2 + 5};
        }else{
            _pStartPosFullscreen = {x: oExitX, y: (oSprite.height/2) + 5};
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        }
        
        _oLifeContainer = new createjs.Container();
        _pStartPosLife = {x:14, y:14};
        _oLifeContainer.x = _pStartPosLife.x;
        _oLifeContainer.y = _pStartPosLife.y;
        s_oStage.addChild(_oLifeContainer);

        var oSprite = s_oSpriteLibrary.getSprite('life');
        var oLife = createBitmap(oSprite);
        _oLifeContainer.addChild(oLife);
        
        _oLifeText = new createjs.Text("X"+LIVES,"40px "+PRIMARY_FONT, "#fcff00");
        _oLifeText.x = 56;
        _oLifeText.y = 34;
        _oLifeText.textAlign = "left";
        _oLifeText.textBaseline = "alphabetic";
        _oLifeText.lineWidth = 200;
        _oLifeContainer.addChild(_oLifeText);
        
        var oSprite = s_oSpriteLibrary.getSprite('gui_panel_bottom');
        _oInfoBg = createBitmap(oSprite);
        _oInfoBg.regY = oSprite.height;
        _oInfoBg.y = CANVAS_HEIGHT;
        s_oStage.addChild(_oInfoBg);
        
        var oInfoContainer = new createjs.Container();
        oInfoContainer.x = 370;
        oInfoContainer.y = 940;        
        s_oStage.addChild(oInfoContainer);
        
        _oTimeText = new createjs.Text(TEXT_TIME,"40px "+PRIMARY_FONT, "#fcff00");//87d304
        _oTimeText.x =10;
        _oTimeText.y =0;
        _oTimeText.textAlign = "left";
        _oTimeText.textBaseline = "alphabetic";
        _oTimeText.lineWidth = 200;        
        oInfoContainer.addChild(_oTimeText);
        
        var oTimeTextOutline = new createjs.Text(TEXT_TIME,"40px "+PRIMARY_FONT, "#000000");
        oTimeTextOutline.x =10;
        oTimeTextOutline.y =0;
        oTimeTextOutline.textAlign = "left";
        oTimeTextOutline.textBaseline = "alphabetic";
        oTimeTextOutline.lineWidth = 200;
        oTimeTextOutline.outline = 3;
        oInfoContainer.addChild(oTimeTextOutline);

        var oSprite = s_oSpriteLibrary.getSprite('time_bar_fill');
        _oBarFill = createBitmap(oSprite);
        _oBarFill.x = 10;
        _oBarFill.y = 18;

        oInfoContainer.addChild(_oBarFill);
        
        _oMask = new createjs.Shape();
        _oMask.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(0, 0, oSprite.width,oSprite.height);
        _oMask.x= 10;
        _oMask.y= 18;      
        oInfoContainer.addChild(_oMask);

        _oBarFill.mask = _oMask;

        var oSprite = s_oSpriteLibrary.getSprite('time_bar_frame');
        var oBarFrame = createBitmap(oSprite);
        oBarFrame.x = 7;
        oBarFrame.y = 15;
        oInfoContainer.addChild(oBarFrame);
        
        _oScoreText = new createjs.Text(TEXT_SCORE,"40px "+PRIMARY_FONT, "#fcff00");
        _oScoreText.x =10;
        _oScoreText.y =110;
        _oScoreText.textAlign = "left";
        _oScoreText.textBaseline = "alphabetic";
        _oScoreText.lineWidth = 200;        
        oInfoContainer.addChild(_oScoreText);
        
        var oScoreTextOutline = new createjs.Text(TEXT_SCORE,"40px "+PRIMARY_FONT, "#000000");
        oScoreTextOutline.x =10;
        oScoreTextOutline.y =110;
        oScoreTextOutline.textAlign = "left";
        oScoreTextOutline.textBaseline = "alphabetic";
        oScoreTextOutline.lineWidth = 200;
        oScoreTextOutline.outline = 3;
        oInfoContainer.addChild(oScoreTextOutline);
        
        _oScoreNum = new createjs.Text("0","36px "+PRIMARY_FONT, "#fcff00");
        _oScoreNum.x = 10;
        _oScoreNum.y = 155;
        _oScoreNum.textAlign = "left";
        _oScoreNum.textBaseline = "alphabetic";
        _oScoreNum.lineWidth = 200;
        oInfoContainer.addChild(_oScoreNum);
        
        _oScoreNumTextOutline = new createjs.Text("0","36px "+PRIMARY_FONT, "#000000");
        _oScoreNumTextOutline.x =10;
        _oScoreNumTextOutline.y =155;
        _oScoreNumTextOutline.textAlign = "left";
        _oScoreNumTextOutline.textBaseline = "alphabetic";
        _oScoreNumTextOutline.lineWidth = 200;
        _oScoreNumTextOutline.outline = 3;
        oInfoContainer.addChild(_oScoreNumTextOutline);

        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        }
        
        _oLifeContainer.x = _pStartPosLife.x + iNewX;
        _oLifeContainer.y = iNewY + _pStartPosLife.y;
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        
        s_oInterface = null;
    };

    this.refreshScore = function(iValue){
        _oScoreNum.text = iValue;
        _oScoreNumTextOutline.text = iValue;
    };
    
    this.refreshLives = function (iLives){
        _oLifeText.text = "X"+iLives;
    };
    
    this.refreshBar = function(){
        _oMask.scaleX = 1;
        createjs.Tween.get(_oMask, {override:true}).to({scaleX:0}, LEVEL_TIME, createjs.Ease.linear).call(function(){s_oGame.gameOver()});
    };
   
    this.stopBar = function(){
        createjs.Tween.removeTweens(_oMask);
    };
   
    this._onButHelpRelease = function(){
        _oHelpPanel = new CHelpPanel();
    };
    
    this._onButRestartRelease = function(){
        s_oGame.restartGame();
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.enabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };
        
    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    this._onExit = function(){
        $(s_oMain).trigger("end_level",s_iCurLevel+1);
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("share_event", s_iScore); 
        
      s_oGame.onExit();  
    };
    
    s_oInterface = this;
    
    this._init();
    
    return this;
}

var s_oInterface = null;