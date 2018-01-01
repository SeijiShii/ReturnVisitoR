"use strict"
/**
 * ダイアログのベースとなるクラスオブジェクト。プロトタイプ継承してからダイアログとして用いる。そのまま用いることはない。
 * @param {Array<string>} path 実行しているhtmlの場所からダイアログのコンテンツhtmlなどのあるディレクトリへの相対パス。
 * @param {Object} givenSize 省略可能。
 */
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase = function(contentHtmlPath, givenHeight) {
    
    // console.log('DialogBase called!');

    var dialogBaseFrame,
        dialogOverlay,
        dialogFrame,
        FADE_DURATION = 300,
        DEFAULT_HEIGHT = 300,
        _givenHeight,
        loadHtmlCallback;
    
    // console.log('givenHeight:', givenHeight);

    if (givenHeight) {
        _givenHeight = givenHeight;
    } else {
        _givenHeight = DEFAULT_HEIGHT;
    }

    // console.log('_givenHeight:', _givenHeight);
    
    function initDialogBaseFrame () {
        dialogBaseFrame = document.getElementById('dialog_base_frame');
    }

    function initDialogOverlay() {
        dialogOverlay = document.getElementById('dialog_overlay');
        dialogOverlay.addEventListener('click', this.fadeOut.bind(this));
    }

    function initDialogFrame() {
        dialogFrame = document.getElementById('dialog_frame');

        dialogFrame.style.height = _givenHeight + 'px';

        if (contentHtmlPath.match(/\.html$/)) {
            $(dialogFrame).load(contentHtmlPath, function(){
                
                if (typeof loadHtmlCallback === 'function') {
                    loadHtmlCallback();
                }
            });
        }
    }

    this.fadeIn = function() {
        dialogBaseFrame.style.width = '100%';
        dialogBaseFrame.style.height = '100%';
        $(dialogBaseFrame).fadeTo(FADE_DURATION, 1)
    }

    // this.setFadeOutCallback = function(callback) {
    //     fadeOutCallback = callback;
    // }

    this.fadeOut = function(fadeOutCallback) {
        $(dialogBaseFrame).fadeTo(FADE_DURATION, 0, function() {
            dialogBaseFrame.parentNode.removeChild(dialogBaseFrame);
            if (typeof fadeOutCallback === 'function') {
                fadeOutCallback();
            }
        });
    }

    this.refreshDialogHeight = function() {
        
        if (_givenHeight > appFrame.clientHeight * 0.9 ) {
            dialogFrame.style.height = (appFrame.clientHeight * 0.9) + 'px';
            // console.log('dialogFrame.clientHeight: ', dialogFrame.clientHeight)
        } else {
            dialogFrame.style.height = _givenHeight + 'px';
            // console.log('dialogFrame.clientHeight: ', dialogFrame.clientHeight)
        }
    }

    this.setLoadHtmlCallback = function(callback) {
        loadHtmlCallback = callback;
    }

    initDialogBaseFrame();
    initDialogOverlay.call(this);
    initDialogFrame();
}

