"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.SmallSquareButton = function(parent, htmlPath, cssPath) {

    var _this = this,
        buttonFrame,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile;

    function initButtonFrame() {
        loadFile.loadCss(cssPath)
        loadFile.loadHtmlAsElement(htmlPath, function(div){
            buttonFrame = div;
            buttonFrame.addEventListener('click', onClickButton);
            parent.appendChild(buttonFrame);
        });
        
    }

    function onClickButton(e) {

        e.stopPropagation();

        $(buttonFrame).fadeTo(100, 0.3, function(){
            $(buttonFrame).fadeTo(100, 1);
        });

        if (typeof _this.onClickButton === 'function') {
            _this.onClickButton();
        }
    }

    initButtonFrame();

}

