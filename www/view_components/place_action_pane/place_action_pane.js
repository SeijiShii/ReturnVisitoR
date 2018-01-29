'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.placeActionPane = (function(){

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        elements = common.elements,
        elementsEffect = common.elementsEffect,
        paneFrame,
        newPlaceButton,
        hcButton,
        nhButton,
        cancelButton,
        _onNewPlaceClick,
        _onCancelClick;
    
    function _initialize(callback) {

        loadFile.loadCss('./view_components/place_action_pane/place_action_pane.css');
        loadFile.loadHtmlAsElement('./view_components/place_action_pane/place_action_pane.html', function(elm) {

            paneFrame = elm;

            initNewPlaceButton();
            initCancelButton();
      
            if ( typeof callback === 'function' ) {
                callback(paneFrame);
            }
        });
    } 

    function initNewPlaceButton() {
    
        newPlaceButton = _getElementById('new_place_button');
        elementsEffect.blinker(newPlaceButton);
        newPlaceButton.addEventListener('click', onNewPlaceButtonClick);
    }

    function onNewPlaceButtonClick() {

        if ( typeof _onNewPlaceClick === 'function' ) {
            _onNewPlaceClick();
        }
    }

    
    function initCancelButton() {

        cancelButton = _getElementById('cancel_button');
        elementsEffect.blinker(cancelButton);
        cancelButton.addEventListener('click', onCancelButtonClick);
    }

    function onCancelButtonClick() {

        if ( typeof _onNewPlaceClick === 'function' ) {
            _onCancelClick();
        }
        
    }

    function _getElementById(id) {
        return elements.getElementById(paneFrame, id);
    }

    

    return {
        initialize : _initialize,
        set onNewPlaceClick(f) {
            _onNewPlaceClick = f;
        },

        set onCancelClick(f) {
            _onCancelClick = f;
        },

        get paneFrame() {
            return paneFrame;
        }
    };

})();