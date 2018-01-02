"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.ToggleButton = function(parent) {

    var _this = this,
        _parent = parent,
        buttonFrame,
        buttonOnImage,
        buttonOffImage,
        markerPaths = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.markerPaths,
        buttonFrameStyle = {
            width: '25px',
            height: '25px',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: 'auto',
            position: 'absolute'
        },
        buttonImageStyle = {
            width: '21px',
            height: '21px',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: 'auto',
            position: 'absolute'
        };
    
    this.onImagePath;

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

    initButtonFrame();
    initOffImage();
    initOnImage();

    

}