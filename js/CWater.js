function CWater(iXPos, iFirstLanePos, iOffset, iCurLevel, oParentContainer){
    var _bVal;
    
    var _iFrame;
    var _iMaxFrames;
    var _iLeftPos;
    var _iRightPos;
    
    var _aWater;
    var _aLanes;
    
    var _oWaterContainer;
    
    
    this._init = function(iXPos, iFirstLanePos, iOffset, iCurLevel, oParentContainer){
        _bVal=true;
        
        _iFrame = 0;
        _iMaxFrames = 9;
        
        _aWater = new Array();
        
        _oWaterContainer = new createjs.Container();
        _oWaterContainer.x = iXPos;
        _oWaterContainer.y = iFirstLanePos - 280;
        oParentContainer.addChild(_oWaterContainer);
        
        var szTag;
        for(var i=0; i<10; i++){
            szTag = "water_anim_"+i;
            _aWater[i] = createBitmap(s_oSpriteLibrary.getSprite(szTag));
            _aWater[i].visible = false;
            _oWaterContainer.addChild(_aWater[i]);
        }        
        _aWater[0].visible = true;
      
        /////////////GENERATE LANES///////////////
        _aLanes = new Array();
        _iLeftPos = -UNLOAD_OFFSET + EDGEBOARD_X;
        _iRightPos = CANVAS_WIDTH+UNLOAD_OFFSET-EDGEBOARD_X;
        
        if(iCurLevel > MAX_LEVEL_DIFFICULTY){
            iCurLevel = MAX_LEVEL_DIFFICULTY;
        }
        
        var aSpeed = new Array();

        for(var i=0; i<WATER_LANE_TIMESPEED.length; i++){
            aSpeed[i] = WATER_LANE_TIMESPEED[i] + iCurLevel*WATER_TIMESPEED_DECREASE_PER_LEVEL[i];
        }     
        
        var aOccur = new Array();
        for(var i=0; i<WATER_LANE_OCCURENCE.length; i++){
            aOccur[i] = WATER_LANE_OCCURENCE[i] + iCurLevel*WATER_OCCURENCE_INCREASE_PER_LEVEL[i];
        }

        
        _aLanes[0] = {pos: iFirstLanePos - 0*iOffset, start: _iRightPos, end: _iLeftPos, speed: aSpeed[0], occur: aOccur[0]};
        _aLanes[1] = {pos: iFirstLanePos - 1*iOffset, start: _iLeftPos, end: _iRightPos, speed: aSpeed[1], occur: aOccur[1]};
        _aLanes[2] = {pos: iFirstLanePos - 2*iOffset, start: _iLeftPos, end: _iRightPos, speed: aSpeed[2], occur: aOccur[2]};
        _aLanes[3] = {pos: iFirstLanePos - 3*iOffset, start: _iRightPos, end: _iLeftPos, speed: aSpeed[3], occur: aOccur[3]};
        _aLanes[4] = {pos: iFirstLanePos - 4*iOffset, start: _iLeftPos, end: _iRightPos, speed: aSpeed[4], occur: aOccur[4]};
        
    };
    
    this.getLaneInfo = function (iNumLane){
        return _aLanes[iNumLane];
        
    };
    
    this.update = function(){
        _bVal = !_bVal; //Half water anim speed
        if(_iFrame===0){                
            _aWater[_iMaxFrames].visible=false;
            _aWater[0].visible=true;                
        } else {
            _aWater[_iFrame-1].visible=false;
            _aWater[_iFrame].visible=true;
        }       

        if(_bVal){
            _iFrame++;
        }
        
        if(_iFrame>_iMaxFrames){
            _iFrame=0;
        }
    };
    
    this._init(iXPos, iFirstLanePos, iOffset, iCurLevel, oParentContainer);
    
}
