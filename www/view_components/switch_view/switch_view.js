"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.SwitchView = function(parent, switchText){

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = returnvisitor.common.loadFile, 
        elements = returnvisitor.common.elements,
        _frame,
        _buttonBase,
        _onButton,
        _text,
        _isOn,
        RV_GREEN = '#34873b';
    
    function initFrame() {
        loadFile.loadCss('./view_components/switch_view/switch_view.css')
        loadFile.loadHtmlAsElement('./view_components/switch_view/switch_view.html', function(div){
            _frame = div;

            _buttonBase = elements.getElementById(_frame, 'button_base');
            _onButton = elements.getElementById(_frame, 'on_button');
            _onButton.style.opacity = 0;

            _text = elements.getElementById(_frame, 'switch_text')
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
            $(_buttonBase).animate({
                left : '5px',
            }, 300);
            $(_onButton).fadeTo(300, 0);
        } else {
            $(_buttonBase).animate({
                left : '20px',
            }, 300); 
            $(_onButton).fadeTo(300, 1);

        }

        _isOn = !_isOn;

    }
    
    initFrame();

}

