'use strict';
/**
 * ダイアログのベースとなるクラスオブジェクト。プロトタイプ継承してからダイアログとして用いる。そのまま用いることはない。
 * @param {Array<string>} path 実行しているhtmlの場所からダイアログのコンテンツhtmlなどのあるディレクトリへの相対パス。
 * @param {Object} givenSize 省略可能。
 */
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase = function(contentHtmlPath, dialogBaseReadyCallback) {
    
    // console.log('DialogBase called!');

    var _this = this,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile,
        elements = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.elements,
        appFrame,
        dialogBaseFrame,
        dialogOverlay,
        dialogFrame,
        FADE_DURATION = 300;
    
    function loadDialogBaseFiles() {

        loadFile.loadCss('./dialogs/dialog_base/dialog_base.css');
        loadFile.loadHtmlAsElement('./dialogs/dialog_base/dialog_base.html', function(divElm) {
            dialogBaseFrame = divElm;

            initDialogOverlay();
            loadDialogContent();

        });
    }

    function initDialogOverlay() {
        dialogOverlay = elements.getElementByClassName(dialogBaseFrame, 'dialog_overlay');

        dialogOverlay.addEventListener('click', function(e) {

            e.stopPropagation();

            _this.fadeOut(_this.onOverlayClick);
        });
    }

    function loadDialogContent() {
        dialogFrame = elements.getElementByClassName(dialogBaseFrame, 'dialog_frame');

        loadFile.loadHtmlAsElement(contentHtmlPath, function(elm){

            appFrame = document.getElementById('app_frame');
            appFrame.appendChild(dialogBaseFrame);
            dialogFrame.appendChild(elm);

            if (typeof dialogBaseReadyCallback === 'function') {
                dialogBaseReadyCallback();
            }

            _this.refreshDialogHeight();

            $(dialogBaseFrame).fadeTo(FADE_DURATION, 1);

        });
    }

    // function measureDialogHeight(elm) {

    //     elm.parentNode.removeChild(elm);
    //     // console.log('elm.clientHeight:', elm.clientHeight);
    //     elm.style.position = 'relative';
    //     appFrame.appendChild(elm);
    //     // console.log('elm.clientHeight:', elm.clientHeight);
    //     _contentHeight = elm.clientHeight;
    //     elm.parentNode.removeChild(elm);
    //     dialogFrame.appendChild(elm);
    // }
 
    this.refreshDialogHeight = function() {

        var content = _this.getElementByClassName('dialog_content');

        content.parentNode.removeChild(content);
        // console.log('elm.clientHeight:', elm.clientHeight);
        content.style.position = 'relative';
        appFrame.appendChild(content);
        // console.log('elm.clientHeight:', elm.clientHeight);
        var contentHeight = content.clientHeight;
        content.parentNode.removeChild(content);
        dialogFrame.appendChild(content);

        $(dialogFrame).css({
            height : contentHeight + 10
        });

        if ( typeof _this.onDialogResize === 'function' ) {
            _this.onDialogResize();
        }
        
    };

    this.fadeOut = function(callback, arg) {

        $(dialogBaseFrame).fadeOut(FADE_DURATION, function(){
            dialogBaseFrame.parentNode.removeChild(dialogBaseFrame);

            if (typeof callback === 'function') {
                callback(arg);
            }

            _this = undefined;
        });

    };

    this.getElementByClassName = function(id) {
        return elements.getElementByClassName(dialogBaseFrame, id);
    };


    loadDialogBaseFiles();

};

