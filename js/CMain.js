function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        s_oStage.preventSelection = false;
        createjs.Touch.enable(s_oStage);
		
	s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
            $('body').on('contextmenu', '#canvas', function(e){ return false; });
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;
        
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
        
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();

    };
    
    this.preloaderReady = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            s_oMain._initSounds();
        }
        
        this._loadImages();
        _bUpdate = true;
    };
    
    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);
    };
    
    this._initSounds = function(){
        Howler.mute(!s_bAudioActive);
        
        s_aSoundsInfo = new Array();
        
        s_aSoundsInfo.push({path: './sounds/',filename:'fr_soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        s_aSoundsInfo.push({path: './sounds/',filename:'press_button',loop:false,volume:1, ingamename: 'click'});
        s_aSoundsInfo.push({path: './sounds/',filename:'fr_game_over',loop:false,volume:1, ingamename: 'game_over'});
        
        s_aSoundsInfo.push({path: './sounds/',filename:'fr_frog_arrived',loop:false,volume:1, ingamename: 'frog_arrived'});
        s_aSoundsInfo.push({path: './sounds/',filename:'fr_frog_death_road',loop:false,volume:1, ingamename: 'splat'});
        s_aSoundsInfo.push({path: './sounds/',filename:'fr_frog_death_water',loop:false,volume:1, ingamename: 'drown'});
        s_aSoundsInfo.push({path: './sounds/',filename:'fr_frog_jump',loop:false,volume:1, ingamename: 'jump'});
        s_aSoundsInfo.push({path: './sounds/',filename:'fr_power_up',loop:false,volume:1, ingamename: 'eat_fly'});
        s_aSoundsInfo.push({path: './sounds/',filename:'fr_win_level',loop:false,volume:1, ingamename: 'win_level'});
        s_aSoundsInfo.push({path: './sounds/',filename:'fr_horn_1',loop:false,volume:1, ingamename: 'big_hornet'});
        s_aSoundsInfo.push({path: './sounds/',filename:'fr_horn_2',loop:false,volume:1, ingamename: 'small_hornet'});


        RESOURCE_TO_LOAD += s_aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<s_aSoundsInfo.length; i++){
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }
    };

    this.tryToLoadSound = function(oSoundInfo, bDelay){
        
       setTimeout(function(){        
            s_aSounds[oSoundInfo.ingamename] = new Howl({ 
                                                            src: [oSoundInfo.path+oSoundInfo.filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: oSoundInfo.loop, 
                                                            volume: oSoundInfo.volume,
                                                            onload: s_oMain.soundLoaded,
                                                            onloaderror: function(szId,szMsg){
                                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                         s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                                                                                         break;
                                                                                     }
                                                                                }
                                                                        },
                                                            onplayerror: function(szId) {
                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                          s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {
                                                                                            s_aSounds[s_aSoundsInfo[i].ingamename].play();
                                                                                            if(s_aSoundsInfo[i].ingamename === "soundtrack" && s_oGame !== null){
                                                                                                setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
                                                                                            }

                                                                                          });
                                                                                         break;
                                                                                     }
                                                                                 }
                                                                       
                                                            } 
                                                        });

            
        }, (bDelay ? 200 : 0) );
    };

    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg"); 
        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.png");        
        s_oSpriteLibrary.addSprite("gui_panel_bottom","./sprites/gui_panel_bottom.png");
        s_oSpriteLibrary.addSprite("gui_panel_top","./sprites/gui_panel_top.png");
        s_oSpriteLibrary.addSprite("life","./sprites/life.png");
        s_oSpriteLibrary.addSprite("time_bar_frame","./sprites/time_bar_frame.png");
        s_oSpriteLibrary.addSprite("time_bar_fill","./sprites/time_bar_fill.png");
        s_oSpriteLibrary.addSprite("bg_help","./sprites/bg_help.png");
        s_oSpriteLibrary.addSprite("bg_help_desktop","./sprites/bg_help_desktop.png");
        
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_up","./sprites/but_up.png");
        s_oSpriteLibrary.addSprite("but_down","./sprites/but_down.png");
        s_oSpriteLibrary.addSprite("but_left","./sprites/but_left.png");
        s_oSpriteLibrary.addSprite("but_right","./sprites/but_right.png");
        s_oSpriteLibrary.addSprite("skid_rows","./sprites/skid_rows.png");
        s_oSpriteLibrary.addSprite("bridge","./sprites/bridge.png");
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("ctl_logo","./sprites/ctl_logo.png");
                
        var szTag;
        for(var i=0; i<10; i++){
            szTag = "water_anim_"+i;
            s_oSpriteLibrary.addSprite(szTag,"./sprites/"+szTag+".jpg");
        }
        var szTag2;
        for(var i=1; i<11; i++){
            szTag = "car_"+i;
            szTag2 = "car_"+(i-1);
            s_oSpriteLibrary.addSprite(szTag2,"./sprites/"+szTag+".png");
        }
        
        s_oSpriteLibrary.addSprite("trunk","./sprites/trunk.png");
        s_oSpriteLibrary.addSprite("turtle","./sprites/turtle.png");
        s_oSpriteLibrary.addSprite("fly","./sprites/fly.png");
        
        s_oSpriteLibrary.addSprite("frog","./sprites/frog.png");
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);
    };
    
    this._onAllImagesLoaded = function(){
        
    };

    
    this._onRemovePreloader = function(){
        _oPreloader.unload();

        s_oSoundTrack = playSound("soundtrack",1,true);  

        
        this.gotoMenu();
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };

    this.gotoGame = function(bEasyMode){
        s_bEasyMode=bEasyMode;
        _oGame = new CGame(_oData);   						
        _iState = STATE_GAME;

        $(s_oMain).trigger("game_start");
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
	
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        Howler.mute(true);
     };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");

        if(s_bAudioActive){
                Howler.mute(false);
        }
    };
    
    this._update = function(event){
        if(_bUpdate === false){
                return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;
    
    _oData = oData;
    ENABLE_FULLSCREEN = oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    
    this.initContainer();
}
var s_bMobile;
var s_bEasyMode;
var s_bAudioActive = false;
var s_bFullscreen = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_iCurLevel = 0;
var s_iScore=0;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oCanvas;
var s_oSoundTrack = null;
