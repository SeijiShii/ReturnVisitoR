"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.Switch = function(parent, switchText){

    var parent,
        _frame,
        _box,
        _buttonBase,
        _onButton,
        _isOn,
        RV_GREEN = '#34873b';
    
    function initFrame() {
        _frame = document.createElement('span');
        $(_frame).css({
            width: '105px',
            height: '30px',
            position: 'absolute',
            top : 0,
            left : 0,
            bottom : 0,
            right : 0,
            margin : 'auto'
        });

        parent.appendChild(_frame);

        initBox();
        initText();

        _frame.addEventListener('click', onClickFrame);
    }

    function onClickFrame(e) {

        $(_frame).fadeTo(200, 0.3, function() {
            $(_frame).fadeTo(200, 1);
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
    
    function initBox() {

        _box = document.createElement('span');
        $(_box).css({
            width: '45px',
            height: '30px',
            position: 'absolute',
            top : 0,
            left : 0
        });

        _frame.appendChild(_box);

        initRail();
        initButtonBase();
    }

    function initRail() {
        var _rail = document.createElement('span');
        $(_rail).css({
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            height: '5px',
            width: '35px',
            backgroundColor: 'gray',
            borderRadius: '2px',
            margin: 'auto',
            position: 'absolute'
        });

        _box.appendChild(_rail);
    }

    function initButtonBase() {
        _buttonBase = document.createElement('span');
        $(_buttonBase).css({
            width: '20px',
            height: '20px',
            top: 0,
            bottom: 0,
            position: 'absolute',
            margin: 'auto',
            left: '5px'
        });
        _box.appendChild(_buttonBase);

        initButton();
        initOnButton();
    }

    function initButton() {
        var _button = document.createElement('span');
        $(_button).css({
            width: '20px',
            height: '20px',
            borderRadius: '10px',
            backgroundColor: 'darkgray',
            top: 0,
            bottom: 0,
            position: 'absolute',
        });
        _buttonBase.appendChild(_button);
    }

    function initOnButton() {
        _onButton = document.createElement('span');
        $(_onButton).css({
            width: '20px',
            height: '20px',
            borderRadius: '10px',
            backgroundColor: RV_GREEN,
            top: 0,
            bottom: 0,
            position: 'absolute',
            opacity: 0
        });
        _buttonBase.appendChild(_onButton);
    }

    function initText() {
        var _text = document.createElement('span');
        $(_text).css({
            width: '60px',
            height: '30px',
            lineHeight: '30px',
            color: '#333',
            fontSize: '10px',
            position: 'absolute',
            top : 0,
            left : 45
        });

        _text.innerText = switchText;
        _frame.appendChild(_text);
    }

    initFrame();

}

