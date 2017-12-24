"use strict"

var returnvisitor = RETURNVISITOR_APP.namespace('work.c_kogyo.returnvisitor'); 
returnvisitor.DialogBase = function(parent) {

    console.log('DialogBase called!');

    var dialogOverlay,
        dialogFrame,
        FADE_DURATION = 300;
    
    this._parent = parent;

    this.initDialogOverlay = function() {
        dialogOverlay = document.createElement('div');
        dialogOverlay.id = 'dialog_overlay'

        this._parent.appendChild(dialogOverlay);
        
    }

    this.initDialogFrame = function() {
        dialogFrame = document.createElement('div');
        dialogFrame.id = 'dialog_frame';

        dialogOverlay.appendChild(dialogFrame);
    }

    this.fade = function(fadeIn) {
        if (fadeIn) {
            dialogOverlay.style.width = '100%';
            dialogOverlay.style.height = '100%';
            $(dialogOverlay).fadeTo(FADE_DURATION, 1)
        } else {
            $(dialogOverlay).fadeTo(FADE_DURATION, 0, function() {
                dialogOverlay.style.width = 0;
                dialogOverlay.style.height =0;
            });
        }
    }

    this.initDialogOverlay();
    this.initDialogFrame();
}

