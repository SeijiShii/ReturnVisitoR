'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.publicationDataPane = (function(){

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        viewComponents = returnvisitor.viewComponents,
        MenuSelector    = viewComponents.MenuSelector,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements,
        data            = returnvisitor.data,
        Placement       = data.Placement,
        Publication     = data.Publication,
        paneFrame,
        pubNameText,
        numberRow,
        yearText,
        numberSelector,
        pubNoteText,
        _placement;


    function _initialize(onReadyCallback, publication) {

        _placement = new Placement(publication);

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

    function initPubNameText() {
        pubNameText = _getElementByClassName('pub_name');
        pubNameText.value = Publication.category[_placement.publication.category];
    }

    function initNumberRow() {
        numberRow = _getElementByClassName('number_row');

        if (_placement.publication.hasNumver) {

            numberRow.style.display = 'block';

        } else {

            numberRow.style.display = 'none';
        }
    }

    function initYearText() {
        yearText = _getElementByClassName('year_text');
        yearText.value = new Date().getFullYear();
    }

    function initNumberSelector() {

        var selectorBase = _getElementByClassName('selector_base');
        var selectorOptions,
            selectedKey;

        if (_placement.publication.hasNumericNumber) {
            selectorOptions = [1, 2, 3];
        } else if (_placement.publication,hasMonthNumder) {

            selectorOptions = [];
            var month = new Date();
            for (var i = 0 ; i < 12 ; i++) {
                month.setMonth(i);
                selectorOptions.push(month.monthString());
            }
        }

        numberSelector = new MenuSelector(selectorBase, )
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