"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.ToggleButton = function(parent, text) {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        elements = returnvisitor.common.elements,
        loadFile = returnvisitor.common.loadFile,
        _this = this,
        _frame,
        _onButton,
        _text,
        _toggled,
        FADE_DURATION = 200;


        // buttonFrame,
        // buttonOnImage,
        // buttonOffImage,
        // BUTTON_FRAME_SIZE = '25px',
        // BUTTON_IMAGE_SIZE = '20px',
        // markerPaths = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.markerPaths,
        // buttonFrameStyle = {
        //     width: BUTTON_FRAME_SIZE,
        //     height: BUTTON_FRAME_SIZE,
        //     top: 0,
        //     bottom: 0,
        //     left: 0,
        //     right: 0,
        //     margin: 'auto',
        //     position: 'absolute'
        // },
        // buttonImageStyle = {
        //     width: BUTTON_IMAGE_SIZE,
        //     height: BUTTON_IMAGE_SIZE,
        //     top: 0,
        //     bottom: 0,
        //     left: 0,
        //     right: 0,
        //     margin: 'auto',
        //     position: 'absolute'
        // };
    
    // this.onImagePath;
    // this._toggled;

    function initFrame() {
        loadFile.loadCss('./view_components/toggle_button/toggle_button.css');
        loadFile.loadHtmlAsElement('./view_components/toggle_button/toggle_button.html', function(div){
            _frame = div;

            initOnButton();
            initText();

            _frame.addEventListener('click', onClick);

            parent.appendChild(_frame);
            
        })
    };

    function initOnButton() {
        _onButton = elements.getElementById(_frame, 'on_button');
        // _onButton.style.opacity = 0;
    }

    function initText() {
        _text = elements.getElementById(_frame, 'toggle_text');
        if (text !== undefined) {
            _text.innerText = text;
        } else {
            _text.style.width = 0;
        }
    }

    // function initButtonFrame() {
    //     buttonFrame = document.createElement('div');
    //     $(buttonFrame).css(buttonFrameStyle)
 
    //     _parent.appendChild(buttonFrame);
    // }

    // function initOffImage() {
    //     buttonOffImage = document.createElement('img');
    //     $(buttonOffImage).css(buttonImageStyle);

    //     buttonOffImage.src = markerPaths.buttonMarkerPaths.grayButton;

    //     buttonFrame.appendChild(buttonOffImage);
    // }

    // function initOnImage() {
    //     buttonOnImage = document.createElement('img');
    //     $(buttonOnImage).css(buttonImageStyle);
        
    //     if (_this.onImagePath !== undefined) {
    //         buttonOnImage.src = onImagePath;
    //     } else {
    //         buttonOnImage.src = markerPaths.buttonMarkerPaths.emeraldButton;
    //     }

    //     buttonFrame.appendChild(buttonOnImage);
    // }

    function onClick() {
        _this.toggle();
    }

    this.toggle = function(animated) {

        // console.log('this.toggle called! toggle:', toggled, 'animated:', animated);

        if (animated) {
            if (_toggled) {

                $(_onButton).fadeTo(FADE_DURATION, 1);

                // $(buttonOnImage).css({
                //     width : 0,
                //     height : 0,
                //     opacity : 1
                // });
                // $(buttonOnImage).animate({
                //     width : BUTTON_IMAGE_SIZE,
                //     height : BUTTON_IMAGE_SIZE
                // }, 300);
                 
            } else {
                // $(buttonOnImage).animate({
                //     width : 0,
                //     height : 0
                // }, 200, function(){
                //     buttonOnImage.style.opacity = 0;
                // });

                $(_onButton).fadeTo(FADE_DURATION, 0);

            }
        } else {
            if (_toggled) {
                // buttonOnImage.style.opacity = 1; 
                _onButton.style.opacity = 1;                
            } else {
                // buttonOnImage.style.opacity = 0;
                _onButton.style.opacity = 0
            }
        }


        // _this._toggled = toggled;
    }

    initFrame();

    // initButtonFrame();
    // initOffImage();
    // initOnImage();
    // this.toggle(false);
}

// Object.defineProperty(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.ToggleButton.prototype, 'toggled', {
//     get : function() {return this._toggled;},
//     set : function(value) {
//         this.toggle(value, true);
//     }
// });

// Object.defineProperty(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.ToggleButton, 'on', {
//     get : function() {return this._toggled;},
//     set : function(value) {this.toggle(value, false);}
// });

