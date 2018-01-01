"use strict"
/**
 * ダイアログのベースとなるクラスオブジェクト。プロトタイプ継承してからダイアログとして用いる。そのまま用いることはない。
 * @param {Array<string>} path 実行しているhtmlの場所からダイアログのコンテンツhtmlなどのあるディレクトリへの相対パス。
 * @param {Object} givenSize 省略可能。
 */
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase = function(contentHtmlPath, givenHeight) {
    
    // console.log('DialogBase called!');

    var _this = this,
        appFrame = document.getElementById('app_frame'),
        dialogBaseFrame,
        dialogOverlay,
        dialogFrame,
        FADE_DURATION = 300,
        DEFAULT_HEIGHT = 300,
        _givenHeight,
        _loadHtmlCallback,
        _overlayClickCallback;
    
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
        dialogOverlay.addEventListener('click', function(e) {

            e.stopPropagation();

            // console.log('Dialog overlay clicked!');
            _this.fadeOut(_overlayClickCallback);
        });
    }

    function initDialogFrame() {
        dialogFrame = document.getElementById('dialog_frame');

        dialogFrame.style.height = _givenHeight + 'px';

        if (contentHtmlPath.match(/\.html$/)) {
            $(dialogFrame).load(contentHtmlPath, function(){
                
                if (typeof _loadHtmlCallback === 'function') {
                    _loadHtmlCallback();
                }
            });
        }

        dialogFrame.addEventListener('click', function(){
            // console.log('Touch on dialog frame!');
        });
    }

    this.fadeIn = function() {
        dialogBaseFrame.style.width = '100%';
        dialogBaseFrame.style.height = '100%';
        $(dialogBaseFrame).fadeTo(FADE_DURATION, 1)
    }
 
    this.fadeOut = function(callback) {
        $(dialogBaseFrame).fadeTo(FADE_DURATION, 0, function() {
            dialogBaseFrame.style.width = '0';
            if (typeof callback === 'function') {
                callback();
            }
        });
    }

    this.fadeOutAndRemove = function(callback) {
        $(dialogBaseFrame).fadeTo(FADE_DURATION, 0, function() {
            dialogBaseFrame.style.width = '0';
            dialogBaseFrame.parentNode.removeChild(dialogBaseFrame);
            if (typeof callback === 'function') {
                callback();
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
        _loadHtmlCallback = callback;
    }

    this.setOverlayClickCallback = function(callback) {
        _overlayClickCallback = callback;
    }

    initDialogBaseFrame();
    initDialogOverlay.call(this);
    initDialogFrame();
}

