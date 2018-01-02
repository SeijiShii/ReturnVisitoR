"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.ToggleButton = function(parent) {

    var _this = this,
        _parent = parent,
        buttonFrame,
        buttonOnImage,
        buttonOffImage,
        BUTTON_FRAME_SIZE = '25px',
        BUTTON_IMAGE_SIZE = '20px',
        markerPaths = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.markerPaths,
        buttonFrameStyle = {
            width: BUTTON_FRAME_SIZE,
            height: BUTTON_FRAME_SIZE,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: 'auto',
            position: 'absolute'
        },
        buttonImageStyle = {
            width: BUTTON_IMAGE_SIZE,
            height: BUTTON_IMAGE_SIZE,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: 'auto',
            position: 'absolute'
        };
    
    this.onImagePath;
    this._toggled;

    function initButtonFrame() {
        buttonFrame = document.createElement('div');
        $(buttonFrame).css(buttonFrameStyle)
 
        _parent.appendChild(buttonFrame);
    }

    function initOffImage() {
        buttonOffImage = document.createElement('img');
        $(buttonOffImage).css(buttonImageStyle);

        buttonOffImage.src = markerPaths.buttonMarkerPaths.grayButton;

        buttonFrame.appendChild(buttonOffImage);
    }

    function initOnImage() {
        buttonOnImage = document.createElement('img');
        $(buttonOnImage).css(buttonImageStyle);
        
        if (_this.onImagePath !== undefined) {
            buttonOnImage.src = onImagePath;
        } else {
            buttonOnImage.src = markerPaths.buttonMarkerPaths.emeraldButton;
        }

        buttonFrame.appendChild(buttonOnImage);
    }

    this.toggle = function(toggled, animated) {

        console.log('this.toggle called! toggle:', toggled, 'animated:', animated);

        if (animated) {
            if (toggled) {
                $(buttonOnImage).css({
                    width : 0,
                    height : 0,
                    opacity : 1
                });
                $(buttonOnImage).animate({
                    width : BUTTON_IMAGE_SIZE,
                    height : BUTTON_IMAGE_SIZE
                }, 300);
                 
            } else {
                $(buttonOnImage).animate({
                    width : 0,
                    height : 0
                }, 200, function(){
                    buttonOnImage.style.opacity = 0;
                });
            }
        } else {
            if (toggled) {
                buttonOnImage.style.opacity = 1;                 
            } else {
                buttonOnImage.style.opacity = 0;
            }
        }

        _this._toggled = toggled;
    }


    initButtonFrame();
    initOffImage();
    initOnImage();
    this.toggle(false, false);
}

Object.defineProperty(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.ToggleButton.prototype, 'toggled', {
    get : function() {return this._toggled;},
    set : function(value) {
        console.log('toggled set!');
        this.toggle(value, true);
    }
});

Object.defineProperty(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.ToggleButton, 'on', {
    get : function() {return this._toggled;},
    set : function(value) {this.toggle(value, false);}
});

