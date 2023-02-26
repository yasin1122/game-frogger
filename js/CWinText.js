function CWinText (szType,iX,iY, bVisible){
    
    var _oText;
    var _oTextOutline;
    var _oTextContainer;    
    
    this._init = function(szType,iX,iY, bVisible){    
        
        _oTextContainer = new createjs.Container();
        _oTextContainer.x=iX;
        _oTextContainer.y=iY - 60;        
        _oTextContainer.alpha = 0;
        _oTextContainer.visible = bVisible;        
        s_oStage.addChild(_oTextContainer);

        _oText = new createjs.Text("","30px "+PRIMARY_FONT, "#fcff00");
        _oText.textAlign="center";	  
        _oText.text = szType;
        _oText.textBaseline = "alphabetic";
        _oTextContainer.addChild(_oText);
        
        _oTextOutline = new createjs.Text("","30px "+PRIMARY_FONT, "#000000");
        _oTextOutline.textAlign="center";	  
        _oTextOutline.text = szType;
        _oTextOutline.outline = 3;
        _oTextOutline.textBaseline = "alphabetic";
        _oTextContainer.addChild(_oTextOutline);
    };
    
    this.great = function(){
        _oTextContainer.scaleX=0;
        _oTextContainer.scaleY=0;
        _oTextContainer.alpha=1;
        var oParent = this;        
        createjs.Tween.get(_oTextContainer).to({scaleX:1, scaleY:1}, 100, createjs.Ease.linear).wait(2000).call(function(){oParent.unload();});
    };

    this.splat = function(){
        var oParent = this;

        createjs.Tween.get(_oTextContainer).to({alpha:1}, 300, createjs.Ease.linear).to({alpha:0}, 2000, createjs.Ease.cubicIn)
                .call(function(){oParent.unload();});;
    };

    this.crash = function(){
        var oParent = this;
        createjs.Tween.get(_oTextContainer).to({alpha:1}, 300, createjs.Ease.linear).to({alpha:0}, 2000, createjs.Ease.cubicIn)
                .call(function(){oParent.unload();});
    };

    this.drown = function(){
        _oTextContainer.scaleX=0;
        _oTextContainer.scaleY=0;
        _oTextContainer.alpha=0;  
        _oTextContainer.y=iY;
        var oParent = this;
        createjs.Tween.get(_oTextContainer).to({alpha:1}, 2500, createjs.Ease.linear).to({alpha:0}, 2500, createjs.Ease.linear);
        createjs.Tween.get(_oTextContainer).to({scaleX:1, scaleY:1}, 5000, createjs.Ease.linear).call(function(){oParent.unload();});
        
    };
        
    this.unload = function(){
        s_oStage.removeChild(_oTextContainer);
    };
	
    this._init(szType,iX,iY, bVisible);
    
}