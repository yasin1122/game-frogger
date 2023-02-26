function CCreditsPanel(){
    var _oListener;
    var _oHitArea;
    var _oPanelContainer;
    var _oButExit;
    var _oLogo;
    
    this._init = function(){
        _oPanelContainer = new createjs.Container();        
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);        
        _oPanelContainer.addChild(oPanel);

        var iWidth = 400;
        var iHeight = 40;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = 415;
        var oTitle = new CTLText(_oPanelContainer, 
                    iTextX -iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    30, "center", "#fcff00", PRIMARY_FONT, 1.2,
                    2, 2,
                    TEXT_DEVELOPED,
                    true, true, true,
                    false );
        oTitle.setShadow("#000",2,2,5);

        
        var iWidth = 400;
        var iHeight = 40;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = 580;
        var oTitle = new CTLText(_oPanelContainer, 
                    iTextX -iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    26, "center", "#fcff00", PRIMARY_FONT, 1.2,
                    2, 2,
                    "www.codethislab.com",
                    true, true, true,
                    false );
        oTitle.setShadow("#000",2,2,5);
        
        var oSprite = s_oSpriteLibrary.getSprite('ctl_logo');
        _oLogo = createBitmap(oSprite);
        _oLogo.regX = oSprite.width/2;
        _oLogo.regY = oSprite.height/2;
        _oLogo.x = CANVAS_WIDTH/2;
        _oLogo.y = CANVAS_HEIGHT/2 - 70;
        _oPanelContainer.addChild(_oLogo);
      
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        _oListener = _oHitArea.on("click", this._onLogoButRelease);
        _oPanelContainer.addChild(_oHitArea);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(770, 230, oSprite, _oPanelContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
        
    };
    
    this.unload = function(){
        _oHitArea.off("click", _oListener);
        s_oStage.removeChild(_oPanelContainer);

        _oButExit.unload();
    };
    
    this._onLogoButRelease = function(){
        window.open("http://www.codethislab.com/index.php?&l=en");
    };
    
    this._init();
    
    
};


