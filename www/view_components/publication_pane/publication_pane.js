'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.publicationPane = (function(){

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        viewComponents = returnvisitor.viewComponents,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements,
        elementsEffect  = common.elementsEffect,
        Swipe           = common.Swipe,
        paneFrame,
        hFrame,
        historyTab,
        generalTab,
        flag,
        _isInHistory = true,
        historyPubs = ['hoge'];

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

            if ( typeof readyCallback === 'function' ) {
                readyCallback();
            }
        });
    }

    function initHorizontalFrame() {
        hFrame = elements.getElementByClassName(paneFrame, 'horizontal_frame');

        setHFrameInitialLeft();

        var hSwipe = new Swipe(hFrame);
        hSwipe.swipeEnabled = isHistoryEnabled();

        var $frame = $(hFrame);
        
        hSwipe.onXSwipe = function(stroke) {

            var oldLeft = elements.positionInParent(hFrame).left;
            var newLeft = oldLeft + stroke;

            if (newLeft > 0) {
                newLeft = 0;
            } 

            if (newLeft < -hFrame.clientWidth / 2) {
                newLeft = -hFrame.clientWidth / 2;
            }

            $frame.css({
                left : newLeft
            });

        };

        hSwipe.onXSwipeEnd = function(stroke, speed) {

            var currentLeft = elements.positionInParent(hFrame).left, 
                goalLeft,
                distance,
                time;

            if (stroke < 0) {
                // Stroke to left.
                _isInHistory = false;

                goalLeft = hFrame.clientWidth / 2;
                distance = Math.abs(goalLeft - currentLeft);

                time = distance / speed;

                if (stroke < 0) {
                    $frame.animate({
                        left : '-100%'
                    }, time);
                }

            } else {
                // Stroke to right.
                _isInHistory = true;

                distance = Math.abs(currentLeft);
                time = distance / speed;

                if (stroke > 0) {
                    $frame.animate({
                        left : 0
                    }, time);
                }
            }
            animateFlag();

        };

        hSwipe.onSwipeCancel = function() {

            if (_isInHistory) {

                $frame.animate({
                    left : 0
                }, 300);

            } else {

                $frame.animate({
                    left : '-100%'
                }, 300);
            }
        };
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

        historyTab = elements.getElementByClassName(paneFrame, 'history');
        refreshHitoryTab();
    }

    function refreshHitoryTab() {

        elementsEffect.blinker(historyTab, isHistoryEnabled());
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

        generalTab = elements.getElementByClassName(paneFrame, 'general');
        elementsEffect.blinker(generalTab);
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

        flag = elements.getElementByClassName(paneFrame, 'tab_flag');
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

    return {
        initialize : _initialize,
        get paneFrame() {
            return paneFrame;
        }
    };

})();