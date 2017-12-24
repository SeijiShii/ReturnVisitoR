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
        dialogOverlay.style.position = 'absolute';
        dialogOverlay.style.left = 0;
        dialogOverlay.style.top = 0;
        
        dialogOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        dialogOverlay.style.width = 0;
        dialogOverlay.style.height = 0;
        dialogOverlay.style.opacity = 0;

        this._parent.appendChild(dialogOverlay);
        
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
}

