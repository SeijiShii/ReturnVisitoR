'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.publicationDataPane = (function(){

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        viewComponents = returnvisitor.viewComponents,
        MenuSelector    = viewComponents.MenuSelector,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements,
        elementsEffect  = common.elementsEffect,
        data            = returnvisitor.data,
        Publication     = data.Publication,
        paneFrame,
        pubNameText,
        numberRow,
        yearText,
        selectorBase,
        menuSelector,
        pubNoteText,
        _publication,
        _onClickOk;

    loadFile.loadCss('./view_components/publication_data_pane/publication_data_pane.css');
    loadFile.loadHtmlAsElement('./view_components/publication_data_pane/publication_data_pane.html', function(elm){

        paneFrame = elm;

        initElements();
        initOkButton();

        $(paneFrame).css({
            opacity : 0,
            width : 0
        });
    });

    function _initialize(param) {

        if (typeof param === 'string') {
            _publication = new Publication(param); 

        } else if (param instanceof Publication) {
            
            _publication = param.clone();
        }
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
        if (_publication.hasNumber) {
            yearText.value = _publication.year;
        } else {
            yearText.value = '';
        }
    }

    function refreshNumberSelector() {

        selectorBase.innerHTML = '';

        if (!_publication.hasNumber) {
            return;
        }

        var selectorOptions,
            selectedIndex;

        if (_publication.hasNumericNumber) {
            selectorOptions = [1, 2, 3];
            selectedIndex = _publication.numericNumber - 1; 
        } else if (_publication.hasMonthNumber) {

            var month = new Date();
            selectorOptions = [];
            for (var i = 0 ; i < 12 ; i++) {
                month.setMonth(i);
                selectorOptions.push(month.monthString());
            }
            selectedIndex = _publication.monthNumber;
        }

        menuSelector = new MenuSelector(selectorBase, selectorOptions, selectedIndex);
        menuSelector.onSelectOption = function(index) {

            if (_publication.hasNumericNumber) {

                _publication.numericNumber = index + 1;

            } else if (_publication.hasMonthNumber) {

                _publication.monthNumber = index;
            }
        };
    }

    function refreshPubNoteText() {
        pubNoteText.value = _publication.note;
    }

    function _getElementByClassName(className) {
        return elements.getElementByClassName(paneFrame, className);
    }

    function initOkButton() {
        var okButton = _getElementByClassName('ok_button');
        new elementsEffect.Blink(okButton);
        okButton.addEventListener('click', onClickOk);
    }

    function onClickOk() {

        _publication.year = yearText.value;
        _publication.note = pubNoteText.value;

        if ( typeof _onClickOk === 'function' ) {
            _onClickOk(_publication);
        }
    }
    

    return {
        initialize : _initialize,
        get paneFrame() {
            return paneFrame;
        },

        set onClickOk(f) {
            _onClickOk = f;
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