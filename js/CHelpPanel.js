function CHelpPanel(){
    var _oText1;
    var _oText1Back;
    var _oText2;
    var _oText2Back;
    var _oText3;
    var _oText3Back;
    var _oText4;
    var _oText4Back;
    var _oMessage1;
    var _oMessage2;
    var _oHelpBg;
    var _oGroup;

    this._init = function(){
        
        var oSprite;
        if(s_bMobile === false){
            _oMessage1=TEXT_HELP1;
            oSprite = s_oSpriteLibrary.getSprite('bg_help_desktop');
        } else {
            _oMessage1=TEXT_HELP_MOB1;
            oSprite = s_oSpriteLibrary.getSprite('bg_help');
        }
        
        
        _oGroup = new createjs.Container();
        _oGroup.on("pressup",function(){oParent._onExitHelp();});
        s_oStage.addChild(_oGroup);
        
        _oHelpBg = createBitmap(oSprite);
        _oGroup.addChild(_oHelpBg);
        
        
        
        var oPos = {x: 290, y: 280, shadow: 4}

        var iWidth = 380;
        var iHeight = 150;
        var iTextX = oPos.x;
        var iTextY = oPos.y;
        _oText1 = new CTLText(_oGroup, 
                    iTextX, iTextY - iHeight/2, iWidth, iHeight, 
                    22, "left", "#fcff00", PRIMARY_FONT, 1.2,
                    2, 2,
                    _oMessage1,
                    true, true, true,
                    false );
        _oText1.setShadow("#000",2,2,5);

        
        var iWidth = 250;
        var iHeight = 100;
        var iTextX = oPos.x + 250;
        var iTextY = oPos.y + 140;
        _oText2 = new CTLText(_oGroup, 
                    iTextX, iTextY - iHeight/2, iWidth, iHeight, 
                    22, "left", "#fcff00", PRIMARY_FONT, 1.2,
                    2, 2,
                    TEXT_HELP2,
                    true, true, true,
                    false );
        _oText2.setShadow("#000",2,2,5);
       
       
        var iWidth = 250;
        var iHeight = 100;
        var iTextX = oPos.x;
        var iTextY = oPos.y + 300;
        _oText3 = new CTLText(_oGroup, 
                    iTextX, iTextY - iHeight/2, iWidth, iHeight, 
                    22, "left", "#fcff00", PRIMARY_FONT, 1.2,
                    2, 2,
                    TEXT_HELP3,
                    true, true, true,
                    false );
        _oText3.setShadow("#000",2,2,5);

        
        var iWidth = 360;
        var iHeight = 100;
        var iTextX = oPos.x + 150;
        var iTextY = oPos.y + 430;
        _oText4 = new CTLText(_oGroup, 
                    iTextX, iTextY - iHeight/2, iWidth, iHeight, 
                    22, "left", "#fcff00", PRIMARY_FONT, 1.2,
                    2, 2,
                    TEXT_HELP4,
                    true, true, true,
                    false );
        _oText4.setShadow("#000",2,2,5);

        var oParent = this;
        

        
    };

    this.unload = function(){
        s_oStage.removeChild(_oGroup);

        _oGroup.removeAllEventListeners();
    };

    this._onExitHelp = function(){
        this.unload();
        s_oGame._onExitHelp();
    };

    this._init();

}
