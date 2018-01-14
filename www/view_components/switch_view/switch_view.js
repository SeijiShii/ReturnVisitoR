"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.SwitchView = function(parent, switchText, initialState){

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = returnvisitor.common.loadFile, 
        elements = returnvisitor.common.elements,
        _frame,
        _greenRect,
        _text,
        _isOn = false,
        RV_GREEN = '#34873b';
    
    if (initialState !== undefined) {
        _isOn = initialState;
    }
    
    function initFrame() {
        loadFile.loadCss('./view_components/switch_view/switch_view.css')
        loadFile.loadHtmlAsElement('./view_components/switch_view/switch_view.html', function(div){
            _frame = div;

            _greenRect = elements.getElementByClassName(_frame, 'green_rect');
            if (_isOn) {
                _greenRect.style.width = '100%';
            } else {
                _greenRect.style.width = '0';
            }

            _text = elements.getElementByClassName(_frame, 'switch_text');
            _text.innerText = switchText;

            _frame.addEventListener('click', onClickFrame);

            parent.appendChild(_frame);
        });
    }

    function onClickFrame(e) {

        $(_frame).fadeTo(100, 0.3, function() {
            $(_frame).fadeTo(100, 1);
        });

        if (_isOn) {

            $(_greenRect).animate({
                width: 0
            }, 300);

        } else {

            $(_greenRect).animate({
                width: '100%'
            }, 300);

        }

        _isOn = !_isOn;

    }
    
    initFrame();

}

