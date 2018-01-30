'use strict';
/**
 * ダイアログのベースとなるクラスオブジェクト。プロトタイプ継承してからダイアログとして用いる。そのまま用いることはない。
 * @param {Array<string>} path 実行しているhtmlの場所からダイアログのコンテンツhtmlなどのあるディレクトリへの相対パス。
 * @param {Object} givenSize 省略可能。
 */
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase = function(contentHtmlPath) {
    
    // console.log('DialogBase called!');

    var _this = this,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile,
        elements = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.elements,
        dialogBaseFrame,
        dialogOverlay,
        dialogFrame,
        _contentHeight,
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

            var appFrame = document.getElementById('app_frame');
            appFrame.appendChild(dialogBaseFrame);

            console.log('elm.clientHeight:', elm.clientHeight);
            elm.style.position = 'relative';
            appFrame.appendChild(elm);
            console.log('elm.clientHeight:', elm.clientHeight);
            _contentHeight = elm.clientHeight;
            elm.parentNode.removeChild(elm);

            dialogFrame.appendChild(elm);

            if (typeof _this.onDialogBaseReady === 'function') {
                _this.onDialogBaseReady();
            }

            // dialogBaseFrame.style.opacity = 1;
            // dialogBaseFrame.style.visibility = 'hidden';

            _this.refreshDialogHeight();

            // dialogBaseFrame.style.opacity = 0;
            // dialogBaseFrame.style.visibility = 'visible';
            
            $(dialogBaseFrame).fadeTo(FADE_DURATION, 1);

        });

    }
 
    this.refreshDialogHeight = function() {

        $(dialogFrame).css({
            height : _contentHeight + 10
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

