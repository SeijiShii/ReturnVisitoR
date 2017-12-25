"use strict"

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase = function(parent) {

    // console.log('DialogBase called!');

    var _parent = parent,
        dialogBaseFrame,
        dialogOverlay,
        dialogFrame,
        FADE_DURATION = 300;
    
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

    initDialogBaseFrame();
    initDialogOverlay.call(this);
    initDialogFrame();
}

