function CGame(oData){
    var _bStartGame;
    var _bBlockMovement;
    var _bBlockKeyboard;
    var _bFrogOnSupport;
    var _bLevelInProgress;
    
    var _iLives;
    var _iNumHorizCel;
    var _iNumVertCel;
    var _iFrogInNest;
    var _iVarInitSinkOccur;
    var _iTimeFlySpawn;
    
    var _aGridMatrix;
    var _aStreetLaneTimeElaps;
    var _aWaterLaneTimeElaps;
    var _aCar;
    var _aSupport;
    var _aNest;
    var _aElementsToRemove;
    var _aFrogToRemove;
    var _aSinkTurtleOccur;

    var _oInterface;
    var _oEndPanel = null;
    var _oHelpPanel;
    var _oParent;
    var _oWater;
    var _oFrog;
    var _oStreet;
    var _oWaterContainer;
    var _oSupportContainer;
    var _oDrownContainer;
    var _oTrafficContainer;
    var _oFrogContainer;
    var _oPosOffset;
    var _oCurLogicPos;
    var _oFly;
    var _oHammer;
    var _oListener;
    
    this._init = function(){
        _bBlockMovement = true;
        _bBlockKeyboard = true;

        s_iScore=0;
        _iLives = LIVES;
        
        _aSinkTurtleOccur = new Array();
        _iVarInitSinkOccur = SINK_TURTLE_OCCURRENCY;
        s_iCurLevel = 0;

        
        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);    
            
              
        var iPixelsEdge = {h:11, v:386};
        _iNumHorizCel = 17;
        _iNumVertCel = 15;
        _oPosOffset = {x:(CANVAS_WIDTH - iPixelsEdge.h -EDGEBOARD_X*2)/_iNumHorizCel, y:(CANVAS_HEIGHT - iPixelsEdge.v)/_iNumVertCel};
        var oStartGridPos = {x: iPixelsEdge.h/2 + _oPosOffset.x/2 + EDGEBOARD_X, y: 808};
        _aGridMatrix = new Array();
        for (var i=0; i<_iNumVertCel; i++){
            _aGridMatrix[i]= new Array();
            for (var j=0; j<_iNumHorizCel; j++){
                _aGridMatrix[i][j]= {x:oStartGridPos.x + _oPosOffset.x*j, y:oStartGridPos.y - _oPosOffset.y*i};
                
            }
        }      

        _oWaterContainer = new createjs.Container();
        s_oStage.addChild(_oWaterContainer);
        
        _oDrownContainer = new createjs.Container();
        s_oStage.addChild(_oDrownContainer);
        
        _oSupportContainer = new createjs.Container();
        s_oStage.addChild(_oSupportContainer);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg); 

        _oFrogContainer = new createjs.Container();
        s_oStage.addChild(_oFrogContainer);

        _oTrafficContainer = new createjs.Container();
        s_oStage.addChild(_oTrafficContainer);

        var oSprite = s_oSpriteLibrary.getSprite('bridge');
        var oBridge0 = createBitmap(oSprite);
        s_oStage.addChild(oBridge0);
        
        var oBridge1 = createBitmap(oSprite);
        oBridge1.scaleY = -1;
        oBridge1.scaleX = -1;
        oBridge1.x = CANVAS_WIDTH;
        oBridge1.y = CANVAS_HEIGHT-140;
        s_oStage.addChild(oBridge1);

        
        _oInterface = new CInterface();             
        
        this._initLevel();

        
        
        _oHelpPanel = new CHelpPanel();

        _oHammer = new Hammer(s_oCanvas);
        _oHammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        _oHammer.get('swipe').set({ velocity: 0.01});
        _oHammer.get('swipe').set({ threshold: 5 });


        _oHammer.on("swipeleft",function(e){s_oGame.onLeftPress(s_oStage.mouseY);});
        _oHammer.on("swiperight",function(){s_oGame.onRightPress(s_oStage.mouseY);});
        _oHammer.on("swipeup",function(){s_oGame.onUpPress(s_oStage.mouseY);});
        _oHammer.on("swipedown",function(){s_oGame.onDownPress(s_oStage.mouseY);});      
        
        if(s_bMobile === false){
            document.onkeydown   = onKeyDown; 
            document.onkeyup   = onKeyUp; 
        }else{
            _oHammer.on("tap",function(){s_oGame.onUpPress(s_oStage.mouseY);});      
        }
    };
  
    this._initLevel = function(){
        _bStartGame=false;        
        _bFrogOnSupport = false;
        _bLevelInProgress = false;
        _bBlockKeyboard = false;
        _bBlockMovement = false;

        _iFrogInNest=0;
        _iTimeFlySpawn = 0;
        
        _oWater = new CWater(220, _aGridMatrix[9][0].y, _oPosOffset.y, s_iCurLevel, _oWaterContainer);        
        _oStreet = new CStreet(_aGridMatrix[3][0].y, _oPosOffset.y, s_iCurLevel);
        
        _aStreetLaneTimeElaps = new Array();
        for (var i=0; i<5; i++){
            _aStreetLaneTimeElaps[i] = _oStreet.getLaneInfo(i).occur;
        }
        _aWaterLaneTimeElaps = new Array();
        for (var i=0; i<5; i++){
            _aWaterLaneTimeElaps[i] = _oWater.getLaneInfo(i).occur;
        }
        
        $(s_oMain).trigger("start_level",s_iCurLevel+1);
        
        _aCar = new Array();
        var iRandPosX;
        var iRandType;
        for(var i=0; i<STREET_LANE_OCCURENCE.length; i++){
            iRandPosX = Math.random()*CANVAS_WIDTH/2;
            iRandType = Math.floor(Math.random()*10);
            _aCar.push(new CCar(_oStreet.getLaneInfo(i), iRandType, _oTrafficContainer));
            _aCar[i].instantCar(iRandPosX + CANVAS_WIDTH/4 , _oStreet.getLaneInfo(i).pos);
            
        }
        
        _aSupport = new Array();
        
        _aNest = new Array();
        _aNest[2] = "free";
        _aNest[5] = "free";
        _aNest[8] = "free";
        _aNest[11] = "free";
        _aNest[14] = "free";        
        _aElementsToRemove = new Array();
        _aFrogToRemove = new Array();
        
        _aSinkTurtleOccur[0] = _iVarInitSinkOccur;
        _aSinkTurtleOccur[1] = _iVarInitSinkOccur;

        _oCurLogicPos = {row: FROG_STARTING_LOGIC_POS.row, col: FROG_STARTING_LOGIC_POS.col};        
        var oStartFrogPos = {x:_aGridMatrix[_oCurLogicPos.row][_oCurLogicPos.col].x, y:_aGridMatrix[_oCurLogicPos.row][_oCurLogicPos.col].y};        
        _oFrog = new CFrog(oStartFrogPos.x ,oStartFrogPos.y, _oFrogContainer);
        
    };
    
    function onKeyUp(evt) {
        if(!_bStartGame){
            return;
        }
        _bBlockKeyboard = false;  
        evt.preventDefault();
    };
    
    function onKeyDown(evt) { 
        if(!evt){ 
            evt = window.event; 
        }  
        if(_bBlockKeyboard){
            return;
        }
        _bBlockKeyboard = true;
        evt.preventDefault();
        
        switch(evt.keyCode) {  
           // left  
           case 37: {
                   s_oGame.onLeftPress();
                   break; 
               }
               
           case 38: {
                   s_oGame.onUpPress();
                   break; 
               }         
                
           // right  
           case 39: {
                   s_oGame.onRightPress();
                   break; 
               }
           case 40: {
                   s_oGame.onDownPress();
                   break; 
               }     
        }  
    };
    
    this.onUpPress = function(iY){
        if(iY < 100){
            return;
        }
        
        if(_bBlockMovement){
            return;
        }
        _bBlockMovement = true;
        var iPos = _oFrog.getPos().y - V_MOVE;
        if(iPos < _aGridMatrix[_iNumVertCel-1][0].y){
            iPos = _aGridMatrix[_iNumVertCel-1][0].y;
        }
        _oFrog.move(_oFrog.getPos().x, iPos, "up", iPos);
    };
    
    this.onDownPress = function(iY){
        if(iY < 100){
            return;
        }
        
        if(_bBlockMovement){
            return;
        }
        _bBlockMovement = true;
        var iPos = _oFrog.getPos().y + V_MOVE;
        if(iPos > _aGridMatrix[0][0].y){
            iPos = _aGridMatrix[0][0].y;
        }
        _oFrog.move(_oFrog.getPos().x, iPos, "down", iPos);
    };
    
    this.onLeftPress = function(iY){
        if(iY < 100){
            return;
        }
        
        if(_bBlockMovement){
            
            return;
        }
        _bBlockMovement = true;
        var iPos = _oFrog.getPos().x - H_MOVE;

        if(iPos < _aGridMatrix[0][0].x){
            iPos = _aGridMatrix[0][0].x;
        }
        
        _oFrog.move(iPos, _oFrog.getPos().y, "left", iPos);
    };
    
    this.onRightPress = function(iY){
        if(iY < 100){
            return;
        }
        
        if(_bBlockMovement){
            return;
        }
        _bBlockMovement = true;
        var iPos = _oFrog.getPos().x + H_MOVE;
        if(iPos > _aGridMatrix[0][_iNumHorizCel-1].x){
            iPos = _aGridMatrix[0][_iNumHorizCel-1].x;
        }
        _oFrog.move(iPos, _oFrog.getPos().y, "right", iPos);
    };
    
    this.updateLogicPos = function(){
        
        for (var i=0; i<_iNumVertCel; i++){
            for (var j=0; j<_iNumHorizCel; j++){
                 
                if( _oFrog.getPos().x >= _aGridMatrix[i][j].x - _oPosOffset.x/2 && _oFrog.getPos().x <= _aGridMatrix[i][j].x + _oPosOffset.x/2 ){
                    _oCurLogicPos.col = j; 
                }
                
                if( _oFrog.getPos().y >= _aGridMatrix[i][j].y - _oPosOffset.y/2 && _oFrog.getPos().y <= _aGridMatrix[i][j].y + _oPosOffset.y/2 ){
                    _oCurLogicPos.row = i; 
                }                
            }
        }      

		_bBlockMovement = false;
		
		if(_oCurLogicPos.row > 8 && _oCurLogicPos.row < 14 && !_bBlockMovement){
			this._checkFrogInWater();
		}
    };    
                
    this.updateScore = function(iValue){
        s_iScore += iValue;
        if(s_iScore<0){
            s_iScore = 0;
        }
        _oInterface.refreshScore(s_iScore);
    };
    
    this.unload = function(){
        _oInterface.unload();
        if(_oEndPanel !== null){
            _oEndPanel.unload();
        }

        for(var i=0; i<_aCar.length; i++){
                _aCar[i].unload();
            }
        for(var i=0; i<_aSupport.length; i++){
            _aSupport[i].unload();
        }
        
        _oHammer.off("swipeleft",function(){s_oGame.onLeftPress(s_oStage.mouseY);});
        _oHammer.off("swiperight",function(){s_oGame.onRightPress(s_oStage.mouseY);});
        _oHammer.off("swipeup",function(){s_oGame.onUpPress(s_oStage.mouseY);});
        _oHammer.off("swipedown",function(){s_oGame.onDownPress(s_oStage.mouseY);});    
        
        
        if(s_bMobile){
            _oHammer.off("tap",function(){s_oGame.onUpPress();}); 
        } else{            
            s_oStage.off("click",function(){s_oGame.onUpPress();});
        }
        
        
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();

           
    };
 
    this.onExit = function(){
        setVolume("soundtrack", 1);
        
        this.unload();
        s_oMain.gotoMenu();
        
    };
    
    this._onExitHelp = function () {
         _bStartGame = true;
         _bLevelInProgress = true;
         _bBlockKeyboard = false;
         _bBlockMovement = false;
         _oInterface.refreshBar();
    };
    
    this.gameOver = function(){ 
        
        setVolume("soundtrack", 0.3);
        
        for (var i=0; i<_aSupport.length; i++){
            _aSupport[i].stopAnim();
        }
        
        _bLevelInProgress = false;
        createjs.Tween.removeAllTweens();
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.show(s_iScore);
    };
    
    this._updateLives = function(szMode){
        if(szMode === "add"){
            _iLives++;
        } else {
            _iLives--;
        }
        
        _oInterface.refreshLives(_iLives);
        if(_iLives === 0){
            _oFrog.setTextVisible(false);
            this.gameOver();
        }
        
    };
    
    this.reset = function (){
       
        for(var i=0; i<_aCar.length; i++){
                _aCar[i].unload();
            }
        for(var i=0; i<_aSupport.length; i++){
            _aSupport[i].unload();
        }
        for(var i=0; i<_aFrogToRemove.length; i++){
            _aFrogToRemove[i].unload();
        }
        
        var iIncreaseSink = s_iCurLevel%NUM_LEVEL_INCREASE_SINK;
        if(iIncreaseSink === 0){
            _iVarInitSinkOccur--;
        }        
        if(_iVarInitSinkOccur < 0){
            _iVarInitSinkOccur = 0;
        }
        _oInterface.refreshBar();
        this._initLevel();
        
        _bLevelInProgress = true;
        _bStartGame = true;
    };

    this._checkNewLevel = function(){
        _iFrogInNest++;
        if(_iFrogInNest === 5){
            $(s_oMain).trigger("end_level",s_iCurLevel+1);
            $(s_oMain).trigger("save_score",[s_iScore]);
            $(s_oMain).trigger("show_interlevel_ad");
            s_iCurLevel++;
            _oFrog.setTextVisible(false);
            _oInterface.stopBar();
            _bStartGame = false;
            _bBlockMovement = true;
            _bBlockKeyboard = true;
            var oLevelPanel = new CLevelPanel(s_iCurLevel);
            oLevelPanel.show(s_iScore);
        }
    };
    
    this.addElemToRemoveList = function(oElem){
        var iIndex;
        var szType;
        if(oElem.getType() === "car"){            
            for(var j=0; j<_aCar.length; j++){
                if(_aCar[j] === oElem){
                    iIndex = j;
                    szType = "car";
                }
            }        
        } else {
            for(var j=0; j<_aSupport.length; j++){
                if(_aSupport[j] === oElem){
                    iIndex = j;
                    szType = "support";
                }
            }
            
        }            
        _aElementsToRemove.push({elem:oElem, index:iIndex, type: szType });
    };
    
    this.freeCell = function(iCell){
        _aNest[iCell] = "free";
    };
    
    this._generateFly = function(){
        _iTimeFlySpawn += s_iTimeElaps;
        if(_iTimeFlySpawn > TIME_FLY_TO_SPAWN){
            _iTimeFlySpawn = 0;
            var aFreeSpot = new Array();
            for(var i=0; i<_aNest.length; i++){
                if(_aNest[i] === "free"){
                    aFreeSpot.push(i);
                }                
            }
            if(aFreeSpot.length > 0){
                shuffle(aFreeSpot);
                _oFly = new CFly(_aGridMatrix[14][aFreeSpot[0]].x, _aGridMatrix[14][aFreeSpot[0]].y, aFreeSpot[0]);
                _aNest[aFreeSpot[0]] = "fly";
            }

        }            
    };

    this._generateNewFrog = function() {
        if(_iLives === 0 ){
            return;
        }
        _oCurLogicPos = {row: FROG_STARTING_LOGIC_POS.row, col: FROG_STARTING_LOGIC_POS.col};
        _oFrog = new CFrog(_aGridMatrix[_oCurLogicPos.row][_oCurLogicPos.col].x, _aGridMatrix[_oCurLogicPos.row][_oCurLogicPos.col].y, _oFrogContainer);
        _oInterface.refreshBar();
        _bStartGame = true;
        _bBlockMovement = false;
    };

    this._generateCar = function (){ 
        for (var i=0; i<_aStreetLaneTimeElaps.length; i++){
            _aStreetLaneTimeElaps[i] += s_iTimeElaps;
            if (_aStreetLaneTimeElaps[i] > _oStreet.getLaneInfo(i).occur){
                _aStreetLaneTimeElaps[i] = 0;
                var iType = Math.floor(Math.random()*10);
                _aCar.push(new CCar(_oStreet.getLaneInfo(i), iType, _oTrafficContainer));
                _aCar[_aCar.length-1].playHornet(_oCurLogicPos.row);
            }
        }           
    };
    
    this._generateSupport = function(){
        for (var i=0; i<_aWaterLaneTimeElaps.length; i++){
            _aWaterLaneTimeElaps[i] += s_iTimeElaps;
            if (_aWaterLaneTimeElaps[i] > _oWater.getLaneInfo(i).occur){
                _aWaterLaneTimeElaps[i] = 0;
                if(i === 0){
                    if(_aSinkTurtleOccur[0] === 0){
                            for(var j=0; j<NUM_CONSECUTIVE_TURTLE_0; j++){                        
                                _aSupport.push(new CTurtle(_oWater.getLaneInfo(i), 1, j*TURTLE_OFFSET, _oSupportContainer));                                
                            }
                            _aSinkTurtleOccur[0] = _iVarInitSinkOccur+1;
                    } else {
                            for(var j=0; j<NUM_CONSECUTIVE_TURTLE_0; j++){                        
                                _aSupport.push(new CTurtle(_oWater.getLaneInfo(i), 0, j*TURTLE_OFFSET, _oSupportContainer));                                
                            }
                    }                                            
                    _aSinkTurtleOccur[0]--;

                    
                } else if(i === 3){
                        if(_aSinkTurtleOccur[1] === 0){
                            for(var j=0; j<NUM_CONSECUTIVE_TURTLE_3; j++){                        
                                _aSupport.push(new CTurtle(_oWater.getLaneInfo(i), 1, j*TURTLE_OFFSET, _oSupportContainer));                                
                            }
                            _aSinkTurtleOccur[1] = _iVarInitSinkOccur+1;
                        } else {
                                for(var j=0; j<NUM_CONSECUTIVE_TURTLE_3; j++){                        
                                    _aSupport.push(new CTurtle(_oWater.getLaneInfo(i), 0, j*TURTLE_OFFSET, _oSupportContainer));                                
                                }
                        }   
                        _aSinkTurtleOccur[1]--;
    
                } else  {
                    _aSupport.push(new CTrunk(_oWater.getLaneInfo(i), _oSupportContainer));
                }
                
            }
        }        
    };
	
	this._checkFrogInWater = function(){
		var rFrogRect = _oFrog.getLogicRect();
		for (var i=0; i<_aSupport.length; i++){
                if(_aSupport[i].getLogicRect() !== null){
                        if (_aSupport[i].getLogicRect().intersects(rFrogRect) ){

                            var iSpeed = _aSupport[i].getSpeed();
                            if(_oFrog.getPos().x >= _aGridMatrix[0][0].x && _oFrog.getPos().x <= _aGridMatrix[0][16].x){
                                _oFrog.carry(iSpeed);

                            }else if (_oFrog.getPos().x < _aGridMatrix[0][0].x){             
                                _oFrog.setPos(_aGridMatrix[0][0].x, _oFrog.getPos().y );
                             
                            }else {
                                _oFrog.setPos(_aGridMatrix[0][16].x, _oFrog.getPos().y );
                            }                           
                            _bFrogOnSupport = true;
                        }
                    }
                }
                
                if(!_bFrogOnSupport){
                    _bBlockMovement= true;
                    this._updateLives("sub");
                    _oFrog.drown();
                    _oFrog.unload();
                    _oDrownContainer.addChild(_oFrog.getContainer());
                    _bStartGame = false;
                    this._generateNewFrog();
                    this.updateScore(SCORE_DEATH);
                }
	}
    
    this.update = function(){
        
        if(_bStartGame){
            
            var rFrogRect = _oFrog.getLogicRect();
            
            if(_oCurLogicPos.row  === 14){
                    
                    if(_aNest[_oCurLogicPos.col] === "free" || _aNest[_oCurLogicPos.col] === "fly"){
                        playSound("frog_arrived",1,false);

                        var bFlyScore = false; 
                        if(_aNest[_oCurLogicPos.col] === "fly"){
                            
                            playSound("eat_fly",1,false);

                            bFlyScore = true;
                            _oFly.unload();
                        }
                        if(bFlyScore){
                            this.updateScore(SCORE_WITH_FLY);
                        } else {
                            this.updateScore(SCORE_IN_NEST);
                        }
                        this._checkNewLevel();
                        _aNest[_oCurLogicPos.col] = "taken";
                        _oFrog.setPos(_aGridMatrix[_oCurLogicPos.row][_oCurLogicPos.col].x, _aGridMatrix[_oCurLogicPos.row][_oCurLogicPos.col].y);
                        _oCurLogicPos.row = 0;
                        _aFrogToRemove.push(_oFrog);
                        _oFrog.great();
                        if(_iFrogInNest<5){
                            this._generateNewFrog();
                        }
                                               
                    } else if(_aNest[_oCurLogicPos.col] === "taken") {

                        _oFrog.unload();
                        this._generateNewFrog();
                    } else {

                        _oFrog.crash();
                        this._updateLives("sub");
                        _bStartGame = false;
                        this._generateNewFrog();
                        this.updateScore(SCORE_DEATH);
                    }
                    
                  
                
            } else if(_oCurLogicPos.row > 8 && _oCurLogicPos.row < 14 && !_bBlockMovement){
				this._checkFrogInWater();
            } else {
                
                for(var i=0; i<_aCar.length; i++){
                    var rCarRect = _aCar[i].getLogicRect();                
                    if(rCarRect.intersects(rFrogRect)){
                        _bBlockMovement = true;
                        this._updateLives("sub");
                        _bStartGame = false;   
                        _oFrog.splat();
                        this._generateNewFrog();
                        this.updateScore(SCORE_DEATH);
                    }                                
                
                }
            }
            
            /*
            if(!_oFrog.getDead() && !_oFrog.isJumping()){
                _bBlockMovement = false;
            } */
            _bFrogOnSupport = false;
        }

        if(_bLevelInProgress){

            this._generateCar();
            this._generateSupport();
            this._generateFly();
            
            _oWater.update();
            for (var i=0; i<_aCar.length; i++){
                _aCar[i].update();
            }
            for (var i=0; i<_aSupport.length; i++){
                _aSupport[i].update();
            }
            
            
            

            ////////REMOVE ELEMENTS///////////
            _aElementsToRemove.sort(compare);
           
            for(var i=0; i<_aElementsToRemove.length; i++){            
                _aElementsToRemove[i].elem.unload();
                if(_aElementsToRemove[i].type === "car"){
                    _aCar.splice(_aElementsToRemove[i].index,1);
                } else {
                    _aSupport.splice(_aElementsToRemove[i].index,1);
                }            
            }


            _aElementsToRemove = new Array();
        }
        
        
        
    };

    s_oGame=this;
    
    LIVES = oData.lives;
    LEVEL_TIME = oData.crossing_time;
    SCORE_IN_NEST = oData.score_in_nest;
    SCORE_WITH_FLY = oData.score_with_fly;
    SCORE_DEATH = oData.score_death;
    
    FROG_SPEED = oData.frog_speed;
    
    SINK_TURTLE_OCCURRENCY = oData.sink_turtle_occurrency;
    NUM_LEVEL_INCREASE_SINK = oData.num_level_increase_sink;
    
    TIME_FLY_TO_SPAWN = oData.time_fly_to_spawn;
    TIME_FLY_TO_DISAPPEAR = oData.time_fly_to_disappear;
    
    STREET_LANE_TIMESPEED = oData.street_lane_timespeed;
    STREET_TIMESPEED_DECREASE_PER_LEVEL = oData.street_timespeed_decrease_per_level;
    STREET_LANE_OCCURENCE = oData.street_lane_occurrence;
    STREET_OCCURENCE_DECREASE_PER_LEVEL = oData.street_occurrence_decrease_per_level;
    
    WATER_LANE_TIMESPEED = oData.water_lane_timespeed;
    WATER_TIMESPEED_DECREASE_PER_LEVEL = oData.water_timespeed_decrease_per_level;
    WATER_LANE_OCCURENCE = oData.water_lane_occurrence;
    WATER_OCCURENCE_INCREASE_PER_LEVEL = oData.water_occurrence_increase_per_level;
    
    _oParent=this;
    this._init();
}

var s_oGame;
