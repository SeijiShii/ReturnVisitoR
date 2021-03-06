"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
/**
 * @param parent parent element to set rater. 
 * @param rateObject Key-value object to rate.
 * @param imagePaths Image paths to show as buttons.
 * @param initialKey
 */
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.Rater = function(parent, buttonColors, initialValue) {

    var _this = this,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        tokenGenerator  = common.tokenGenerator,
        elements        = common.elements,
        touchEventFilter = common.touchEventFilter,
        waiter          = common.waiter,
        _value = initialValue,
        raterDiv,
        raterButtons = [],
        MIN_BUTTON_DIV_WIDTH_NUM = 30,
        MAX_BUTTON_DIV_WIDTH_NUM = 60,
        _buttonWidth,
        BUTTON_ID_PREFIX = 'rater_' + tokenGenerator.generateToken() + '_',
        BUTTON_SIZE = '20px';

    function initialize() {
        
        loadFile.loadCss('./view_components/rater/rater.css');

        initButtonWidth();
        initRaterDiv();
        initRaterButtons();
    
    }


    function initButtonWidth() {

        // console.log('_parent.style.width: ', _parent.style.width )
        // console.log('_parent.clientWidth: ', _parent.clientWidth )

        _buttonWidth = parseInt(parent.clientWidth) / buttonColors.length;
        
        if (_buttonWidth > MAX_BUTTON_DIV_WIDTH_NUM ) { 
            _buttonWidth = MAX_BUTTON_DIV_WIDTH_NUM;
        } else if (_buttonWidth < MIN_BUTTON_DIV_WIDTH_NUM) {
            _buttonWidth = MIN_BUTTON_DIV_WIDTH_NUM
        }
    }

    function initRaterDiv() {
        raterDiv = document.createElement('div');
        raterDiv.classList.add('rater_div')
        raterDiv.style.width = _buttonWidth * 8 + 'px',

        parent.appendChild(raterDiv);
    }


    function initRaterButtons() {

        for ( var i = 0 ; i < buttonColors.length ; i++ ) {

            loadFile.loadHtmlAsElement('./view_components/rater/rater_button.html', function(button){
                button.style.width = _buttonWidth + 'px';
                raterButtons.push(button);
                raterDiv.appendChild(button);
                button.addEventListener('click', onClickRaterButton);
            });
        }

        waiter.wait(function(){
            onButtonsReady();

        }, function(){
            return raterButtons.length == buttonColors.length;
        });
    }

    function onButtonsReady() {
        for ( var i = 0 ; i < buttonColors.length ; i++ ) {
            raterButtons[i].id = BUTTON_ID_PREFIX + i;
        }

        refreshRaterButtons(false);
    }

    function onClickRaterButton(e) {

        var id = touchEventFilter.getTargetId(e, 'button_div');

        _value = id.substring(BUTTON_ID_PREFIX.length);

        if ( typeof _this.onSetRater === 'function' ) {
            _this.onSetRater(_value);
        }
        refreshRaterButtons(false);
        
    }

    function refreshRaterButtons(animated) {
        
        if (animated) {

            var animateButton = function(index) {
                if (index > raterButtons.length) {
                    return;
                }

                var button = raterButtons[index];
                var colorButton = elements.getElementByClassName(button, 'color_button');
                var $button = $(colorButton);

                if (index <= _value) {
                    
                    $button.animate({
                        width : 0,
                        height : 0,
                        borderRadius : 0
                    }, 20, function(){
                        colorButton.style.backgroundColor =  buttonColors[_value];  
                        $button.animate({
                            width : BUTTON_SIZE,
                            height : BUTTON_SIZE,
                            borderRadius : '10px'
                        }, 20); 
                        index++;
                        animateButton(index); 
                    });

                } else {
                    $button.animate({
                        width : 0,
                        height : 0,
                        borderRadius : 0
                    }, 20, function(){
                        index++;
                        animateButton(index);
                    });
                }
                
            };

            animateButton(0);

        } else {
            for ( var i = 0 ; i < raterButtons.length ; i++ ) {

                var button = raterButtons[i];
                var colorButton = elements.getElementByClassName(button, 'color_button');
                var $button = $(colorButton);

                if (i <= _value) {
                    
                    colorButton.style.backgroundColor =  buttonColors[_value];  
                    $button.css({
                        width : BUTTON_SIZE,
                        height : BUTTON_SIZE,
                        borderRadius : '10px'
                    });  

                } else {
                    $button.css({
                        width : 0,
                        height : 0,
                        borderRadius : 0
                    });
                }
            }
        }
    }

    initialize();
};

