'use strict';
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.PlacementDialog = function() {

    var _this = this,
        returnvisitor   = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements,
        elementsEffect  = common.elementsEffect,
        viewComponents  = returnvisitor.viewComponents,
        pubPane         = viewComponents.publicationPane,
        pubDataPane     = viewComponents.publicationDataPane,
        data            = returnvisitor.data,
        Placement       = data.Placement,
        _showPubPane    = true,
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
            pubDataPane.initialize(category);
            switchPane();
        };
    }

    function initPubDataPane() {

        pubPaneBase.appendChild(pubDataPane.paneFrame);
        pubDataPane.onClickOk = function(pub) {
            
            // console.log(pub);

            var placement = new Placement(pub);

            _this.fadeOut(_this.onCreatePlacement, placement);
        };
    }
    
    function initCancelButton() {
        var cancelButton = _this.getElementByClassName('cancel_button');
        new elementsEffect.Blink(cancelButton);
        cancelButton.addEventListener('click', onCancelClick);
    }

    function onCancelClick() {
        if (_showPubPane) {
            _this.fadeOut();
        } else {
            switchPane();
        }
    }

    function switchPane() {

        _showPubPane = !_showPubPane;

        if (_showPubPane) {
            
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