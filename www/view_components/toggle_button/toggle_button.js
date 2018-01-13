"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.ToggleButton = function(parent, text, initialState) {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        elements = returnvisitor.common.elements,
        loadFile = returnvisitor.common.loadFile,
        _this = this,
        _frame,
        _onButton,
        _text,
        _toggled = false,
        FADE_DURATION = 100;

    if (initialState !== undefined && initialState) {
        _toggled = true;
    }

    function initFrame() {

        loadFile.loadCss('./view_components/toggle_button/toggle_button.css');
        loadFile.loadHtmlAsElement('./view_components/toggle_button/toggle_button.html', function(div){
            _frame = div;

            initOnButton();
            initText();

            toggle(_toggled, false);

            _frame.addEventListener('click', onClick);

            parent.appendChild(_frame);
            
        })
    };

    function initOnButton() {
        _onButton = elements.getElementByClassName(_frame, 'on_button');
    }

    function initText() {
        _text = elements.getElementByClassName(_frame, 'toggle_text');
        if (text !== undefined) {
            _text.innerText = text;
        } else {
            _text.style.width = 0;
        }
    }

    function onClick() {

        $(_frame).fadeTo(100, 0.3, function(){
            $(_frame).fadeTo(100, 1);
        });

        if (_toggled) {
            if (_this.uncheckable) {

            } else {
                toggle(true, true);

                if (typeof _this.onChange === 'function') {
                    _this.onChange(_toggled);
                }
            }
        } else {
            _toggled = !_toggled;
            toggle(_toggled, true);

            if (typeof _this.onChange === 'function') {
                _this.onChange(_toggled);
            }
        }

    }

    function toggle(toToggle, animated) {

        if (animated) {
            if (toToggle) {
                $(_onButton).fadeTo(FADE_DURATION, 1);
            } else {
                $(_onButton).fadeTo(FADE_DURATION, 0);
            }
        } else {
            if (toToggle) {
                _onButton.style.opacity = 1;                
            } else {
                _onButton.style.opacity = 0
            }
        }
    }

    this.toggle = function(toToggle, animated) {
        
        _toggled = toToggle;
        toggle(_toggled, animated);
        
    }

    initFrame();

    

}

