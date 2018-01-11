"use strict"
/**
 * ダイアログのベースとなるクラスオブジェクト。プロトタイプ継承してからダイアログとして用いる。そのまま用いることはない。
 * @param {Array<string>} path 実行しているhtmlの場所からダイアログのコンテンツhtmlなどのあるディレクトリへの相対パス。
 * @param {Object} givenSize 省略可能。
 */
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase = function(contentHtmlPath, givenHeight) {
    
    // console.log('DialogBase called!');

    var _this = this,
        _parent,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile,
        elements = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.elements,
        dialogBaseFrame,
        dialogOverlay,
        dialogFrame,
        FADE_DURATION = 300,
        // DEFAULT_HEIGHT = 300,
        _givenHeight,
        _isDialogElementAvailable = false,
        _dialogElements;
    
    // console.log('givenHeight:', givenHeight);

    // if (givenHeight) {
    //     _givenHeight = givenHeight;
    // } else {
    //     _givenHeight = DEFAULT_HEIGHT;
    // }

    // console.log('_givenHeight:', _givenHeight);
    
    function loadDialogBaseFiles() {

        loadFile.loadCss('./dialogs/dialog_base.css');
        loadFile.loadHtmlAsElement('./dialogs/dialog_base.html', function(divElm) {
            dialogBaseFrame = divElm;

            // console.log(dialogBaseFrame);

            // _dialogElements = elements.getAllOffspring(dialogBaseFrame);
            // console.log(_dialogElements);

            initDialogOverlay();
            initDialogFrame();

            _isDialogElementAvailable = true;
        });
    }

    function initDialogOverlay() {
        dialogOverlay = elements.getElementById(dialogBaseFrame, 'dialog_overlay');

        // console.log(dialogOverlay)

        dialogOverlay.addEventListener('click', function(e) {

            e.stopPropagation();

            // console.log('Dialog overlay clicked!');
            _this.fadeOut(_this.onOverlayClick);
        });
    }

    function initDialogFrame() {
        dialogFrame = elements.getElementById(dialogBaseFrame, 'dialog_frame');

        // console.log(dialogFrame);

        dialogFrame.style.height = _givenHeight + 'px';

        $(dialogFrame).load(contentHtmlPath, function(){
                
            // console.log(dialogFrame);

            if (typeof _this.onDialogBaseReady === 'function') {
                _this.onDialogBaseReady();
            }
        });

        dialogFrame.addEventListener('click', function(){
            // console.log('Touch on dialog frame!');
        });
    }


    /**
     * 
     * @param {*} parent is the node in which dialog base frame will be appended.
     * @param {*} callback is called when dialog base frame is successfully appended to the parent node. 
     */
    function appendDialogToParent(callback) {
     
        var timer = function() {
            if (_isDialogElementAvailable) {
                _parent.appendChild(dialogBaseFrame);
                clearInterval(timerId);

                if (typeof callback === 'function') {
                    callback();
                }
            }
        }

        var timerId = setInterval(timer, 50);
        
    }

    this.fadeIn = function(parent) {

        if (parent === undefined) {
            console.log('DialogBase.fadeIn is called without specifying parent.')
            return;
        }

        _parent = parent;

        appendDialogToParent(function() {
            _fadeIn();
        });
    }

    function _fadeIn() {
        dialogBaseFrame.style.width = '100%';
        dialogBaseFrame.style.height = '100%';
        $(dialogBaseFrame).fadeTo(FADE_DURATION, 1)
    }
 
    function _fadeOut(callback) {
        $(dialogBaseFrame).fadeTo(FADE_DURATION, 0, function() {
            dialogBaseFrame.style.width = '0';
            if (typeof callback === 'function') {
                callback();
            }
        });
    }

    this.fadeOut = function(callback) {

        _fadeOut(function() {
            dialogBaseFrame.parentNode.removeChild(dialogBaseFrame);
            _parent = undefined;

            if (typeof callback === 'function') {
                callback();
            }
        })
    }

    // this.refreshDialogHeight = function() {
        
    //     // append前に呼ばれることがあるので
    //     if (_parent === undefined) {
    //         return;
    //     }

    //     if (_givenHeight > _parent.clientHeight * 0.9 ) {
    //         dialogFrame.style.height = (_parent.clientHeight * 0.9) + 'px';
    //         // console.log('dialogFrame.clientHeight: ', dialogFrame.clientHeight)
    //     } else {
    //         dialogFrame.style.height = _givenHeight + 'px';
    //         // console.log('dialogFrame.clientHeight: ', dialogFrame.clientHeight)
    //     }
    // }

    this.getElementById = function(id) {
        return elements.getElementById(dialogBaseFrame, id);
    }

    loadDialogBaseFiles();

}

