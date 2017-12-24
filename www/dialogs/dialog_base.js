"use strict"

var returnvisitor = RETURNVISITOR_APP.namespace('work.c_kogyo.returnvisitor'); 
returnvisitor.DialogBase = function(parent) {

    // console.log('DialogBase called!');

    var _this = this,
        dialogBaseFrame,
        dialogOverlay,
        dialogFrame,
        FADE_DURATION = 300;
    
    this._parent = parent;

    this.initDialogBaseFrame = function() {
        dialogBaseFrame = document.createElement('div');
        dialogBaseFrame.id = 'dialog_base_frame';

        this._parent.appendChild(dialogBaseFrame);
    }

    this.initDialogOverlay = function() {
        dialogOverlay = document.createElement('div');
        dialogOverlay.id = 'dialog_overlay'

        dialogBaseFrame.appendChild(dialogOverlay);

        dialogOverlay.addEventListener('click', function(){
            _this.fade(false);
        });
    }

    this.initDialogFrame = function() {
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

    this.initDialogBaseFrame();
    this.initDialogOverlay();
    this.initDialogFrame();
}

