"use strict"

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase = function(parent, givenSize) {

    // console.log('DialogBase called!');

    var _parent = parent,
        dialogBaseFrame,
        dialogOverlay,
        dialogFrame,
        FADE_DURATION = 300,
        DEFAULT_WIDTH = 200,
        DEFAULT_HEIGHT = 300,
        givenWidth,
        givenHeight;
    
    if (givenSize) {
        if (givenSize.width) {
            givenWidth = givenSize.width;
        } else {
            givenWidth = DEFAULT_WIDTH;
        }

        if (givenSize.height) {
            givenHeight = givenSize.height;
        } else {
            givenHeight = DEFAULT_HEIGHT;
        }
    } else {
        givenWidth = DEFAULT_WIDTH;
        givenHeight = DEFAULT_HEIGHT;
    }
    
    function initDialogBaseFrame () {
        dialogBaseFrame = document.createElement('div');
        dialogBaseFrame.id = 'dialog_base_frame';

        _parent.appendChild(dialogBaseFrame);
    }

    function initDialogOverlay() {
        dialogOverlay = document.createElement('div');
        dialogOverlay.id = 'dialog_overlay'

        dialogBaseFrame.appendChild(dialogOverlay);

        dialogOverlay.addEventListener('click', fadeOut.bind(this));
    }

    function fadeOut() {
        this.fade(false);
    }

    function initDialogFrame() {
        dialogFrame = document.createElement('div');
        dialogFrame.id = 'dialog_frame';

        dialogFrame.style.width = givenWidth + 'px';
        dialogFrame.style.height = givenHeight + 'px';

        dialogBaseFrame.appendChild(dialogFrame);
    }

    this.fade = function(fadeIn) {
        if (fadeIn) {
            dialogBaseFrame.style.width = '100%';
            dialogBaseFrame.style.height = '100%';
            $(dialogBaseFrame).fadeTo(FADE_DURATION, 1)
        } else {
            $(dialogBaseFrame).fadeTo(FADE_DURATION, 0, function() {
                dialogBaseFrame.style.width = 0;
                dialogBaseFrame.style.height =0;
            });
        }
    }

    this.refreshDialogSize = function() {
        
        console.log('window.innerHeight: ' + window.innerHeight);
        console.log('_parent.clientHeight: ' + _parent.clientHeight);

        if (givenWidth > _parent.clientWidth * 0.9 ) {
            dialogFrame.style.width = (_parent.clientWidth * 0.9) + 'px';
        } else {
            dialogFrame.style.width = givenWidth
        }

        if (givenHeight > _parent.clientHeight * 0.9 ) {
            dialogFrame.style.height = (_parent.clientHeight * 0.9) + 'px';
        } else {
            dialogFrame.style.height = givenHeight;
        }
    }

    initDialogBaseFrame();
    initDialogOverlay.call(this);
    initDialogFrame();
}

