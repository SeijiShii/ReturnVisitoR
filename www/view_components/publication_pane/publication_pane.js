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
        touchEventFilter = common.touchEventFilter,
        data            = returnvisitor.data,
        Publication     = data.Publication,
        paneFrame,
        hFrame,
        historyTab,
        generalTab,
        flag,
        _isInHistory = true,
        historyPubs = [],
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

        historyTab = _getElementByClassName('history');
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

        generalTab = _getElementByClassName('general');
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
        var generalListFrame = _getElementByClassName('general_list_frame'),
            $glFrame = $(generalListFrame);

        var keys = Object.keys(Publication.category);
        for (var i = 0 ;  i < keys.length ; i++) {
            var cell = generateGeneralListCell(keys[i]);
            generalListFrame.appendChild(cell);
        }

        var gFrameSwipe = new Swipe(generalListFrame);
        gFrameSwipe.xSwipeEnabled = false;
        gFrameSwipe.ySwipeEnabled = true;
        var topLimit;

        gFrameSwipe.onYSwipe = function(stroke){

            topLimit = -(generalListFrame.clientHeight - generalListFrame.parentNode.clientHeight);
            var oldTop = elements.positionInParent(generalListFrame).top;
            var newTop = stroke + oldTop;
            if (newTop > 0) {
                newTop = 0;
            }

            
            if (newTop < topLimit) {
                newTop = topLimit;
            }

            $glFrame.css({
                top : newTop
            });
        };

        gFrameSwipe.onYSwipeEnd = function(stroke, speed) {

            topLimit = -(generalListFrame.clientHeight - generalListFrame.parentNode.clientHeight);
            var currentTop = elements.positionInParent(generalListFrame).top, 
                distance,
                time;

            if (stroke > 0) {

                time = currentTop / speed;

                $glFrame.animate({
                    top : 0
                }, time);


            } else if (stroke < 0) {

                distance = Math.abs(currentTop - topLimit);
                time = distance / speed;

                $glFrame.animate({
                    top : topLimit
                }, time);
            }
        };

    }

    function generateGeneralListCell(name) {

        var cell = document.createElement('div');
        cell.classList.add('general_list_cell');
        cell.innerText  = Publication.category[name];
        cell.name = name;
        elementsEffect.blinker(cell);
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