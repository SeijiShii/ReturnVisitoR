"use strict"
/**
 * ダイアログのベースとなるクラスオブジェクト。プロトタイプ継承してからダイアログとして用いる。そのまま用いることはない。
 * @param {Array<string>} path 実行しているhtmlの場所からダイアログのコンテンツhtmlなどのあるディレクトリへの相対パス。
 * @param {Object} givenSize 省略可能。
 */
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase = function(contentHtmlPath, dialogFrameClassName, parent) {
    
    // console.log('DialogBase called!');

    var _this = this,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile,
        elements = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.elements,
        dialogBaseFrame,
        dialogOverlay,
        dialogFrame,
        FADE_DURATION = 300,
        _dialogElements;
    
    function loadDialogBaseFiles() {

        loadFile.loadCss('./dialogs/dialog_base.css');
        loadFile.loadHtmlAsElement('./dialogs/dialog_base.html', function(divElm) {
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

    function loadDialogContent(callback) {
        dialogFrame = elements.getElementByClassName(dialogBaseFrame, 'dialog_frame');
        dialogFrame.classList.add(dialogFrameClassName);

        $(dialogFrame).load(contentHtmlPath, function(){
                
            if (typeof _this.onDialogBaseReady === 'function') {
                _this.onDialogBaseReady();
            }

            if (parent !== undefined) {
                parent.appendChild(dialogBaseFrame);
            } else {
                document.getElementById('app_frame').appendChild(dialogBaseFrame);
            }

            _this.refreshDialogHeight();

            $(dialogBaseFrame).fadeTo(FADE_DURATION, 1)
        });

    }
 
    this.refreshDialogHeight = function() {

        var children = dialogFrame.children;
        var firstChild = children[0];
        var firstRect = firstChild.getBoundingClientRect();
        var top     = firstRect.top,
            bottom  = firstRect.bottom;

        for ( var i = 1 ; i < children.length ; i++ ) {
            var child = children[i];
            var rect = child.getBoundingClientRect();
            // console.log('children[', i, '].getBoundingClientRect():', rect);

            top     = rect.top < top ? rect.top : top;
            bottom  = rect.bottom > bottom ? rect.bottom : bottom;
        }

        // console.log('top:', top, 'bottom:', bottom);

        var contentHeight = bottom - top;
        // console.log('contentHeight:', contentHeight);

        // console.log('dialogBaseFrame.parentNode.clientHeight:', dialogBaseFrame.parentNode.clientHeight);

        var parentHeight = dialogBaseFrame.parentNode.clientHeight;

        if (contentHeight < parentHeight * 0.9) {
            dialogFrame.style.height = (contentHeight + 20) + 'px';
        } else {
            dialogFrame.style.height = (parentHeight * 0.9) + 'px';
        }

    }

    this.fadeOut = function(callback, arg) {

        $(dialogBaseFrame).fadeOut(FADE_DURATION, function(){
            dialogBaseFrame.parentNode.removeChild(dialogBaseFrame);

            if (typeof callback === 'function') {
                callback(arg);
            }

            _this = undefined;
        })

    }

    this.getElementByClassName = function(id) {
        return elements.getElementByClassName(dialogBaseFrame, id);
    }

    loadDialogBaseFiles();

}

