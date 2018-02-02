'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.SmallSquareButton = function(parent, htmlPath, cssPath) {

    var _this = this,
        buttonFrame,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        elementsEffect = common.elementsEffect;

    function initButtonFrame() {
        loadFile.loadCss(cssPath);
        loadFile.loadHtmlAsElement(htmlPath, function(div){
            buttonFrame = div;
            buttonFrame.addEventListener('click', onClickButton);
            new elementsEffect.Blink(buttonFrame);
            parent.appendChild(buttonFrame);
        });
        
    }

    function onClickButton(e) {

        e.stopPropagation();

        if (typeof _this.onClickButton === 'function') {
            _this.onClickButton();
        }
    }

    initButtonFrame();

};

