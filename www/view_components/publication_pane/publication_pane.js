'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.publicationPane = (function(){

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        viewComponents = returnvisitor.viewComponents,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements,
        elementsEffect  = common.elementsEffect,
        SwipeElement    = common.SwipeElement,
        touchEventFilter = common.touchEventFilter,
        data            = returnvisitor.data,
        Publication     = data.Publication,
        paneFrame,
        hFrame,
        historyTab,
        generalTab,
        flag,
        _isInHistory = true,
        historyPubs = ['hoge'],
        _onClickGeneralItem;

    function isHistoryEnabled() {
        return historyPubs.length > 0;
    }

    function _initialize(readyCallback){

        if (!isHistoryEnabled()) {
            _isInHistory = false;
        }

        loadFile.loadCss('./view_components/publication_pane/publication_pane.css');
        loadFile.loadHtmlAsElement('./view_components/publication_pane/publication_pane.html', function(elm){

            paneFrame = elm;

            initHorizontalFrame();
            initHistroyTab();
            initGeneralTab();
            initFlag();
            initGeneralFrame();

            if ( typeof readyCallback === 'function' ) {
                readyCallback();
            }
        });
    }

    function initHorizontalFrame() {
        hFrame = _getElementByClassName('horizontal_frame');

        setHFrameInitialLeft();

        if (cordova.platformId === 'android') {
            return;
        }

        var hSwipe = new SwipeElement(hFrame, {
            swipeEnabled : isHistoryEnabled(),
            xSwipeEnabled : true,
            ySwipeEnabled : false,
            swipeThru : true

        });
        
        hSwipe.onEndSwipe = function(pos) {

            animateFlagOnPosition(pos);
        };

        hSwipe.onSwipeCancel = function(pos) {

            animateFlagOnPosition(pos);
        };

        function animateFlagOnPosition(pos) {

            if (pos.left == 0) {
                // console.log('Swipe to right: left:', pos.left);
                _isInHistory = true;

            } else {
                // console.log('Swipe to left: left:', pos.left);
                _isInHistory = false;
            }
            animateFlag();
        }
    }

    function setHFrameInitialLeft() {
        
        var left;
        if (isHistoryEnabled()) {
            left = 0;
        } else {
            left = '-100%';
        }
        hFrame.style.left = left;
    }
    
    function initHistroyTab() {

        historyTab = _getElementByClassName('history');
        refreshHitoryTab();
    }

    function refreshHitoryTab() {

        historyTab.blink = new elementsEffect.Blink(historyTab, isHistoryEnabled());
        if (isHistoryEnabled()) {
            historyTab.addEventListener('click', onClickHistoryTab);
            historyTab.style.opacity = 1;
        } else {
            historyTab.removeEventListener('click', onClickHistoryTab);
            historyTab.style.opacity = 0.3;
        }
    }

    function onClickHistoryTab() {

        if (_isInHistory) {
            return;
        }

        _isInHistory = true;
        animateHFrame();
        animateFlag();
        
    }

    function initGeneralTab() {

        generalTab = _getElementByClassName('general');
        generalTab.blink = new elementsEffect.Blink(generalTab);
        generalTab.addEventListener('click', onClickGeneralTab);
    }

    function onClickGeneralTab() {

        if (!_isInHistory) {
            return;
        }

        _isInHistory = false;
        animateHFrame();
        animateFlag();

    }

    function initFlag() {

        flag = _getElementByClassName('tab_flag');
        refreshFlag();
    }

    function refreshFlag() {

        var left;
        if (_isInHistory) {
            left = 0;
        } else {
            left = '50%';
        }

        $(flag).css({
            left : left
        });
    }

    function animateFlag() {

        var left;
        if (_isInHistory) {
            left = 0;
        } else {
            left = '50%';
        }

        $(flag).animate({
            left : left
        }, 300);
    }

    function animateHFrame() {

        var $frame = $(hFrame);

        if (_isInHistory) {

            $frame.animate({
                left : 0
            }, 300);
            

        } else {

            $frame.animate({
                left : '-100%'
            }, 300);
            
        }

    }

    function initGeneralFrame() {
        var generalListFrame = _getElementByClassName('general_list_frame');

        var keys = Object.keys(Publication.category);
        for (var i = 0 ;  i < keys.length ; i++) {
            var cell = generateGeneralListCell(keys[i]);
            generalListFrame.appendChild(cell);
        }

        new SwipeElement(generalListFrame, {
            xSwipeEnabled   : false,
            ySwipeEnabled   : true,
            swipeThru       : false
        });

    }

    function generateGeneralListCell(name) {

        var cell = document.createElement('div');
        cell.classList.add('general_list_cell');
        cell.innerText  = Publication.category[name];
        cell.name = name;
        cell.blink = new elementsEffect.Blink(cell);
        cell.addEventListener('click', onClickGeneralCell);

        return cell;
    }

    function onClickGeneralCell(e) {

        var cell = touchEventFilter.getTarget(e, 'general_list_cell');
        // console.log(cell.name);

        if ( typeof _onClickGeneralItem === 'function' ) {
            _onClickGeneralItem(cell.name);
        }
        
    }

    function _getElementByClassName(className) {
        return elements.getElementByClassName(paneFrame, className);
    }

    return {
        initialize : _initialize,
        get paneFrame() {
            return paneFrame;
        },
        set onClickGeneralItem(f) {
            _onClickGeneralItem = f;
        },

        fadeIn : function() {

            var $frame = $(paneFrame);
            $frame.css({
                width : '100%',
                opacity : 0
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