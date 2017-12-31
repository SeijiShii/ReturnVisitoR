"use strict"
/**
 * ダイアログのベースとなるクラスオブジェクト。プロトタイプ継承してからダイアログとして用いる。そのまま用いることはない。
 * @param {HtmlElement} parent ダイアログをapendChildする親エレメント。
 * @param {Array<string>} path 実行しているhtmlの場所からダイアログのコンテンツhtmlなどのあるディレクトリへの相対パス。
 * @param {Object} givenSize 省略可能。
 */
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase = function(parent, loadFiles, givenHeight) {
    
    // console.log('DialogBase called!');

    var _parent = parent,
        dialogBaseFrame,
        dialogOverlay,
        dialogFrame,
        FADE_DURATION = 300,
        DEFAULT_HEIGHT = 300,
        _givenHeight,
        fadeOutCallback,
        loadHtmlCallback;
    
    // console.log('givenHeight:', givenHeight);

    if (givenHeight) {
        _givenHeight = givenHeight;
    } else {
        _givenHeight = DEFAULT_HEIGHT;
    }

    // console.log('_givenHeight:', _givenHeight);
    
    function initDialogBaseFrame () {
        dialogBaseFrame = document.createElement('div');
        dialogBaseFrame.id = 'dialog_base_frame';

        _parent.appendChild(dialogBaseFrame);
    }

    function initDialogOverlay() {
        dialogOverlay = document.createElement('div');
        dialogOverlay.id = 'dialog_overlay'

        dialogBaseFrame.appendChild(dialogOverlay);

        dialogOverlay.addEventListener('click', this.fadeOut.bind(this));
    }

    function initDialogFrame() {
        dialogFrame = document.createElement('div');
        dialogFrame.id = 'dialog_frame';

        dialogFrame.style.height = _givenHeight + 'px';

        dialogBaseFrame.appendChild(dialogFrame);

        for (var i = 0 ; i < loadFiles.length ; i++ ) {
            if (loadFiles[i].match(/\.html$/)) {
                $(dialogFrame).load(loadFiles[i], function(){
                    
                    if (typeof loadHtmlCallback === 'function') {
                        loadHtmlCallback();
                    }
                });
            }
        }
    }

    this.fadeIn = function() {
        dialogBaseFrame.style.width = '100%';
        dialogBaseFrame.style.height = '100%';
        $(dialogBaseFrame).fadeTo(FADE_DURATION, 1)
    }

    this.setFadeOutCallback = function(callback) {
        fadeOutCallback = callback;
    }

    this.fadeOut = function() {
        $(dialogBaseFrame).fadeTo(FADE_DURATION, 0, function() {
            _parent.removeChild(dialogBaseFrame)
            if (fadeOutCallback) {
                fadeOutCallback.call();
            }
        });
    }

    this.refreshDialogHeight = function() {
        
        // console.log('givenHeight > _parent.clientHeight * 0.9: ', givenHeight > _parent.clientHeight * 0.9)
        if (_givenHeight > _parent.clientHeight * 0.9 ) {
            dialogFrame.style.height = (_parent.clientHeight * 0.9) + 'px';
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

