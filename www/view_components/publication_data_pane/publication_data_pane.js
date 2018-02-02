'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.publicationDataPane = (function(){

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        viewComponents = returnvisitor.viewComponents,
        MenuSelector    = viewComponents.MenuSelector,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements,
        paneFrame,
        pubNameText,
        numberRow,
        yearText,
        numberSelector,
        pubNoteText,
        placement;


    function _initialize(onReadyCallback) {

        loadFile.loadCss('./view_components/publication_data_pane/publication_data_pane.css');
        loadFile.loadHtmlAsElement('./view_components/publication_data_pane/publication_data_pane.html', function(elm){

            paneFrame = elm;

            $(paneFrame).css({
                opacity : 0,
                width : 0
            });

            if (typeof onReadyCallback === 'function' ) {
                onReadyCallback();
            }

        });
    }

    function initFrames() {

    }

    function initPubNameText() {
        pubNameText = _getElementByClassName('pub_name');
    }

    function initNumberRow() {
        numberRow = _getElementByClassName('number_row');
    }

    function initYearText() {
        yearText = _getElementByClassName('year_text');
    }

    function initNumberSelector() {

        var selectorBase = _getElementByClassName('selector_base');
        numberSelector = new MenuSelector()
    }

    function _getElementByClassName(className) {
        return elements.getElementByClassName(paneFrame, className);
    }

    return {
        initialize : _initialize,
        get paneFrame() {
            return paneFrame;
        },
        
        fadeIn : function() {

            var $frame = $(paneFrame);
            $frame.css({
                width : '100%'
            });
            $frame.fadeTo(300, 1);
        },

        fadeOut : function() {

            var $frame = $(paneFrame);
            
            $frame.fadeTo(300, 0, function(){
                $frame.css({
                    width : 0
                });
            });
        }

    };
})();