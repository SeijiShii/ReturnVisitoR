"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.EditButton = function(parent) {

    var _this = this,
        buttonFrame,
        dotStyle = {
            backgroundColor: 'gray',
            width: '4px',
            height: '4px',
            borderRadius: '2px',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            position: 'absolute',
            margin: 'auto',
        };

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

        initDots();

        buttonFrame.addEventListener('click', onClickButton);

        parent.appendChild(buttonFrame);
    }

    function initDots() {

        var dot = document.createElement('span');
        $(dot).css(dotStyle);

        buttonFrame.appendChild(dot);

        var leftDot = document.createElement('span');
        $(leftDot).css(dotStyle);
        leftDot.style.marginLeft = '11px';

        buttonFrame.appendChild(leftDot);

        var rightDot = document.createElement('span');
        $(rightDot).css(dotStyle);
        rightDot.style.marginLeft = '25px';

        buttonFrame.appendChild(rightDot);
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

