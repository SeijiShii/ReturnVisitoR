"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
/**
 * @param parent parent element to set rater. 
 * @param rateObject Key-value object to rate.
 * @param imagePaths Image paths to show as buttons.
 * @param initialKey
 */
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.Rater = function(parent, rateObject, imagePaths, initialKey) {

    var _this = this,
        _parent = parent,
        _selectedKey = initialKey,
        _imagePaths = imagePaths,
        _pathKeys = Object.keys(imagePaths),
        _rateObject = rateObject,
        keys = Object.keys(rateObject),
        raterDiv,
        raterButtons = [],
        MIN_BUTTON_WIDTH_NUM = 30,
        MAX_BUTTON_WIDTH_NUM = 60,
        BUTTON_HEIGHT_NUM = 30,
        _buttonWidth,
        BUTTON_ID_PREFIX = 'rater_button_',
        IMAGE_SIZE = '20px';
    
    this.onSetRater;

    function initButtonWidth() {

        console.log('_parent.style.width: ', _parent.style.width )
        console.log('_parent.clientWidth: ', _parent.clientWidth )


        _buttonWidth = parseInt(_parent.clientWidth) / 8;
        
        if (_buttonWidth > MAX_BUTTON_WIDTH_NUM ) { 
            _buttonWidth = MAX_BUTTON_WIDTH_NUM;
        } else if (_buttonWidth < MIN_BUTTON_WIDTH_NUM) {
            _buttonWidth = MIN_BUTTON_WIDTH_NUM
        }
    }

    function initRaterDiv() {
        raterDiv = document.createElement('div');
        $(raterDiv).css({
            width       : _buttonWidth * 8 + 'px',
            height      : BUTTON_HEIGHT_NUM + 'px',
            position    : 'absolute',
            top         : 0,
            bottom      : 0,
            left        : 0,
            right       : 0,
            margin      : 'auto'
        });

        _parent.appendChild(raterDiv);

    }


    function initRaterButtons() {

        for ( var i = 0 ; i < keys.length ; i++ ) {
            var raterButton = document.createElement('span');

            raterButton.id = BUTTON_ID_PREFIX + keys[i];

            $(raterButton).css({
                width : _buttonWidth + 'px',
                height : BUTTON_HEIGHT_NUM + 'px',
                position : 'relative',
                float : 'left',
            });

            refreshButtonNewImagePath(raterButton);

            raterButton.oldImage = generateButtonImage(raterButton.newImagePath);
            raterButton.oldImage.style.opacity = 0;

            raterButton.newImage = generateButtonImage(raterButton.newImagePath);

            raterButton.appendChild(raterButton.oldImage);
            raterButton.appendChild(raterButton.newImage);
            
            raterButtons.push(raterButton);

            
            raterButton.addEventListener('click', onClickRaterButton, true);

            raterDiv.appendChild(raterButton);
        }
    }

    function generateButtonImage(src) {
        var buttonImage = document.createElement('img');
        $(buttonImage).css({
            width   : IMAGE_SIZE,
            height  : IMAGE_SIZE,
            position: 'absolute',
            top     : 0,
            bottom  : 0,
            left    : 0,
            right   : 0,
            margin  : 'auto'
        });

        buttonImage.src = src

        return buttonImage;
    }

    function onClickRaterButton(event) {
            
        event.stopPropagation();

        var id = event.currentTarget.id;
        _selectedKey = id.substring(BUTTON_ID_PREFIX.length);
        
        refreshRaterButtons();

        if (typeof _this.onSetRater === 'function') {
            _this.onSetRater(_selectedKey);
        }
    }

    function refreshButtonNewImagePath(button) {

        var index = _rateObject.indexOfKey(button.id.substring(BUTTON_ID_PREFIX.length));

        if (_selectedKey === undefined) {
            button.newImagePath = _imagePaths[_pathKeys[0]];
        } else {
            if (_rateObject.indexOfKey(_selectedKey) >= index) {
                button.newImagePath = _imagePaths[_pathKeys[_rateObject.indexOfKey(_selectedKey)]];
            } else {
                button.newImagePath = _imagePaths[_pathKeys[0]];
            }
        }
    }

    function refreshRaterButtons() {
        
        for ( var i = 0 ; i < raterButtons.length ; i++ ) {

            var button = raterButtons[i];

            button.oldImage.src = button.newImage.src;
            button.oldImage.style.opacity = 1;

            button.oldImagePath = button.newImagePath;

            refreshButtonNewImagePath(button);

            if (button.newImagePath !== button.oldImagePath) {
                $(button.newImage).css({
                    width : 0,
                    height : 0
                });
                button.newImage.src = button.newImagePath;
                $(button.newImage).animate({
                    width   : IMAGE_SIZE,
                    height  : IMAGE_SIZE,
                }, 200);
                $(button.oldImage).fadeTo(200, 0);
            }
        }
    }


    console.log(_rateObject.values);

    initButtonWidth();
    initRaterDiv();
    initRaterButtons();

    // var timer = function() {
    //     var parentWidth = _parent.clientWidth;
    //     console.log(parentWidth);

    //     if (parentWidth > 0) {
    //         clearTimeout(timerId);
    //     }
    // } 

    // var timerId = setInterval(timer, 500);

}

