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
        Publication     = data.Publication,
        paneFrame,
        pubNameText,
        numberRow,
        yearText,
        selectorBase,
        numberSelector,
        pubNoteText,
        _publication;

    loadFile.loadCss('./view_components/publication_data_pane/publication_data_pane.css');
    loadFile.loadHtmlAsElement('./view_components/publication_data_pane/publication_data_pane.html', function(elm){

        paneFrame = elm;

        initElements();

        $(paneFrame).css({
            opacity : 0,
            width : 0
        });
    });

    function _initialize(category) {

        _publication = new Publication(category);
        refreshElements();

    }

    function initElements() {
        pubNameText     = _getElementByClassName('pub_name');
        numberRow       = _getElementByClassName('number_row');
        yearText        = _getElementByClassName('year_text');
        selectorBase    = _getElementByClassName('selector_base');
        pubNoteText     = _getElementByClassName('pub_note_text');

    }

    function refreshElements() {
        refreshPubNameText();
        refreshNumberRow();
        refreshYearText();
        refreshNumberSelector();
        refreshPubNoteText();
    }

    function refreshPubNameText() {
        pubNameText.innerText = Publication.category[_publication.category];
    }

    function refreshNumberRow() {
        
        if (_publication.hasNumber) {
            numberRow.style.display = 'block';
        } else {
            numberRow.style.display = 'none';
        }
    }

    function refreshYearText() {
        yearText.value = new Date().getFullYear();
    }

    function refreshNumberSelector() {

        selectorBase.innerHTML = '';

        if (!_publication.hasNumber) {
            return;
        }

        var selectorOptions,
            selectedIndex,
            month = new Date();

        if (_publication.hasNumericNumber) {
            selectorOptions = [1, 2, 3];
            selectedIndex = parseInt(month.getMonth() / 4); 
        } else if (_publication.hasMonthNumber) {

            selectorOptions = [];
            for (var i = 0 ; i < 12 ; i++) {
                month.setMonth(i);
                selectorOptions.push(month.monthString());
            }
            selectedIndex = month.getMonth();
        }

        numberSelector = new MenuSelector(selectorBase, selectorOptions, selectedIndex);
    }

    function refreshPubNoteText() {
        pubNoteText.value = _publication.note;
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