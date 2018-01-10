"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.MinusButton = function(parent) {

    var _this = this,
        buttonFrame;

    function initButtonFrame() {
        buttonFrame = document.createElement('span');
        $(buttonFrame).css({
            width: '40px',
            height: '40px',
            top : 0,
            left : 0,
            right : 0,
            bottom : 0,
            position : 'absolute',
            margin : 'auto'
        });

        initMinus();

        buttonFrame.addEventListener('click', onClickButton);

        parent.appendChild(buttonFrame);
    }

    function initMinus() {

        var minus = document.createElement('span');
        $(minus).css({
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: '25px',
            height: '4px',
            borderRadius: '1px',
            backgroundColor: 'gray',
            margin: 'auto',
        });

        buttonFrame.appendChild(minus);

    }

    function onClickButton() {

        $(buttonFrame).fadeTo(100, 0.3, function(){
            $(buttonFrame).fadeTo(100, 1);
        });

        if (typeof _this.onClickButton === 'function') {
            _this.onClickButton();
        }
    }

    initButtonFrame();

}
