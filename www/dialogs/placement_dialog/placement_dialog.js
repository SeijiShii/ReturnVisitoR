'use strict';
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.PlacementDialog = function() {

    var _this = this,
        returnvisitor   = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements,
        viewComponents  = returnvisitor.viewComponents,
        pubPane         = viewComponents.publicationPane,
        pubDataPane     = viewComponents.publicationDataPane,
        pubPaneBase;

    function initialize() {
        loadFile.loadCss('./dialogs/placement_dialog/placement_dialog.css');
        returnvisitor.DialogBase.call(_this, './dialogs/placement_dialog/placement_dialog.html', _onDialogBaseReadyCallback);
    }

    function _onDialogBaseReadyCallback() {
        
        initPubPane();
        initPubDataPane();
        initCancelButton();
    }

    function initPubPane() {

        pubPaneBase = _this.getElementByClassName('publication_pane_base');
        pubPane.initialize(function() {
            pubPaneBase.appendChild(pubPane.paneFrame);
            _this.refreshDialogHeight();
        });

        pubPane.onClickGeneralItem = function(category) {
            switchPane(false);
        };
    }

    function initPubDataPane() {

        pubDataPane.initialize(function(){
            pubPaneBase.appendChild(pubDataPane.paneFrame);
        });

    }
    
    function initCancelButton() {
        var cancelButton = _this.getElementByClassName('cancel_button');
        cancelButton.addEventListener('click', onCancelClick);
    }

    function onCancelClick() {
        _this.fadeOut();
    }

    function switchPane(toList) {

        if (toList) {
            
            pubPane.fadeIn();
            pubDataPane.fadeOut();

        } else {

            pubPane.fadeOut();
            pubDataPane.fadeIn();

        }
    }

    initialize();
};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.PlacementDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.PlacementDialog,
        writable: true
    }
});