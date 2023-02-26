function CStreet (iFirstLanePos, iOffset, iCurLevel){
    
    var _aLanes;
    var _iLeftPos;
    var _iRightPos;
    
    this.init = function (iFirstLanePos, iOffset, iCurLevel){
        
        _aLanes = new Array();
        _iLeftPos = -UNLOAD_OFFSET + EDGEBOARD_X;
        _iRightPos = CANVAS_WIDTH+UNLOAD_OFFSET -EDGEBOARD_X;
        
        if(iCurLevel > MAX_LEVEL_DIFFICULTY){
            iCurLevel = MAX_LEVEL_DIFFICULTY;
        }
        
        var aRandSpeed = new Array();

        for(var i=0; i<STREET_LANE_TIMESPEED.length; i++){
            aRandSpeed[i] = STREET_LANE_TIMESPEED[i] + iCurLevel*STREET_TIMESPEED_DECREASE_PER_LEVEL[i];
        }
        shuffle(aRandSpeed);        
        
        var aRandOccur = new Array();
        for(var i=0; i<STREET_LANE_OCCURENCE.length; i++){
            aRandOccur[i] = STREET_LANE_OCCURENCE[i] + iCurLevel*STREET_OCCURENCE_DECREASE_PER_LEVEL[i];
        }
        shuffle(aRandOccur);
        
        var iVerse;
        var iStartPos;
        var iEndPos;
        for(var i=0; i<5; i++){
            iVerse = i%2;
            if(iVerse === 0){
                iStartPos = _iRightPos;
                iEndPos = _iLeftPos;
            } else {
                iStartPos = _iLeftPos;
                iEndPos = _iRightPos;
            }                    
            _aLanes[i] = {pos: iFirstLanePos - i*iOffset, start: iStartPos, end: iEndPos, speed: aRandSpeed[i], occur: aRandOccur[i]};
        }        
    };
    
    this.getLaneInfo = function (iNumLane){
        return _aLanes[iNumLane];
        
    };
    
    this.init(iFirstLanePos, iOffset, iCurLevel);
}