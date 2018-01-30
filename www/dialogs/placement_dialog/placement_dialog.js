'use strict';
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.PlacementDialog = function() {

    var _this = this,
        returnvisitor   = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements,
        viewComponents  = returnvisitor.viewComponents,
        pubPane         = viewComponents.publicationPane;

    function initialize() {
        loadFile.loadCss('./dialogs/placement_dialog/placement_dialog.css');
        returnvisitor.DialogBase.call(_this, './dialogs/placement_dialog/placement_dialog.html', _onDialogBaseReadyCallback);
    }

    function _onDialogBaseReadyCallback() {
        
        initPubPane();
        initCancelButton();
    }

    function initPubPane() {

        var pubPaneBase = _this.getElementByClassName('publication_pane_base');
        pubPane.initialize(function() {
            pubPaneBase.appendChild(pubPane.paneFrame);
            _this.refreshDialogHeight();
        });
    }
    
    function initCancelButton() {
        var cancelButton = _this.getElementByClassName('cancel_button');
        cancelButton.addEventListener('click', onCancelClick);
    }

    function onCancelClick() {
        _this.fadeOut();
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