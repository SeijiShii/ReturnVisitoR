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
        _onNewPlaceClick;
    
    function _initialize(primaryFrame, secondaryFrame, callback) {

        loadFile.loadCss('./view_components/place_action_pane/place_action_pane.css');
        loadFile.loadHtmlAsElement('./view_components/place_action_pane/place_action_pane.html', function(elm) {

            paneFrame = elm;

            initButtons();

            primaryFrame.appendChild(paneFrame);
            $(primaryFrame).css({
                height : paneFrame.style.height
            });

            $(secondaryFrame).css({
                height : 0
            });

      
            if ( typeof callback === 'function' ) {
                callback(paneFrame);
            }
        });
    } 

    function initButtons() {

        newPlaceButton = _getElementById('new_place_button');
        newPlaceButton.addEventListener('click', onNewPlaceButtonClick);


    }

    function onNewPlaceButtonClick() {

        elementsEffect.blink(newPlaceButton);

        if ( typeof _onNewPlaceClick === 'function' ) {
            _onNewPlaceClick();
        }
    }

    function _getElementById(id) {
        return elements.getElementById(paneFrame, id);
    }

    

    return {
        initialize : _initialize,
        set onNewPlaceClick(f) {
            _onNewPlaceClick = f;
        }
    };

})();