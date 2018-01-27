'use strict';

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.mapPage = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        viewComponents = returnvisitor.viewComponents,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements,
        elementsEffect  = common.elementsEffect,
        Swipe           = common.Swipe,
        mapPageFrame,
        horizontalFrame,
        toolHeader,
        toolHeaderLogo,
        mapPaneBase,
        mapOverlay,
        drawerFrame,
        drawerSwipe,
        drawerHeader,
        DRAWER_WIDTH = 200,
        DRAWER_DURATION = 300,

        mapPane,
        _isDrawerOpen   = false,
        _isMapOverlaySet = false,
        _isWideScreen = false,
        _onMapLongClick;

    function _initialize(onReadyCallback) {

        loadFile.loadHtmlAsElement('./pages/map_page/map_page.html', function(elm){

            mapPageFrame = elm;

            initFrames();
            initDrawerFrame();
            initMaOverlay();
            initToolHeaderLogo();
            initToolHeader();
            initDrawerHeader();
    
            _resizeFrames();
    
            initMapPane();
            
            if ( typeof onReadyCallback === 'function' ) {
                onReadyCallback();                
            }

        });
    }

    function _getElementById(id) {

        return elements.getElementById(mapPageFrame, id);
    }

    function initFrames() {

        horizontalFrame = _getElementById('horizontal_frame');
        mapPaneBase     = _getElementById('map_pane_base');

    }

    function initDrawerFrame() {

        drawerFrame     = _getElementById('drawer_frame');

        drawerSwipe = new Swipe(drawerFrame);
        drawerSwipe.onXSwipeEnd = function(stroke) {

            if (stroke < 0) {
                openCloseDrawer();
            } 
        };

        drawerSwipe.onXSwipe = function(stroke) {

            $(horizontalFrame).css({
                left : parseInt(horizontalFrame.style.left) + stroke
            });

            if (parseInt(horizontalFrame.style.left) > 0) {
                drawerSwipe.cancel();
            }
        };

        drawerSwipe.onSwipeCancel = function(){

            animateDrawer();
        };

    }

    // resize frames

    function resizeHorizontalFrame() {

        var $hFrame = $(horizontalFrame);

        if (_isWideScreen) {

            $hFrame.css({
                width : window.innerWidth + DRAWER_WIDTH,
                left : 0
            });

        } else {

            $hFrame.css({
                width : window.innerWidth + DRAWER_WIDTH,
                left : -DRAWER_WIDTH
            });
        }


    }

    function resizeMapPaneBase() {

        var $mapPaneBase = $(mapPaneBase);

        $mapPaneBase.css({
            width : window.innerWidth,
        });

        if (_isMapOverlaySet) {
            switchMapOverlay(false);
        }
    }

    function _resizeFrames() {

        resizeHorizontalFrame();
        resizeMapPaneBase();

        drawerSwipe.swipeEnabled = !_isWideScreen;
        fadeToolHeaderLogo(!_isWideScreen, false);

    }

    function initMapPane() {

        loadFile.loadScript('./view_components/map_pane/map_pane.js', function(){

            mapPane = viewComponents.mapPane;
            mapPane.initialize(mapPaneBase);
            
            mapPane.onMapLongClick = function(latLng) {

                if ( typeof _onMapLongClick === 'function' ) {
                    _onMapLongClick(latLng);
                }
            };

            mapPane.onClickMarker = function(place) {

            };

        });
    }

    function initMaOverlay() {

        mapOverlay = _getElementById('map_overlay');
        mapOverlay.addEventListener('click', onClickMapOverlay);
    }

    function onClickMapOverlay() {

        openCloseDrawer();
    }

    function switchMapOverlay(set) {

        var $overlay = $(mapOverlay);

        if (set) {

            $overlay.css({
                width : '100%'
            });

        } else {

            $overlay.css({
                width : 0
            });

        }

        _isMapOverlaySet = set;
    }

    function initToolHeader() {

        toolHeader = _getElementById('tool_header');
    }

    function initToolHeaderLogo() {

        toolHeaderLogo  = _getElementById('tool_header_logo');
        toolHeaderLogo.addEventListener('click', onClickToolHeaderLogo);
    }

    function fadeToolHeaderLogo(fadeIn, animated) {

        var $logo = $(toolHeaderLogo);

        if (animated) {

            if (fadeIn) {

                $logo.css({
                    width : '50px'
                });
                $logo.fadeTo(DRAWER_DURATION, 1);

            } else {

                $logo.fadeTo(DRAWER_DURATION, 0, function(){
                    $logo.css({
                        width : 0
                    });
                });
            }
        } else {

            if (fadeIn) {

                $logo.css({
                    opacity : 1,
                    width : '50px'
                }, DRAWER_DURATION);

            } else {

                $logo.css({ 
                    opacity : 0,
                    width : 0

                });   

            }
        }
    }

    function onClickToolHeaderLogo() {

        if (_isWideScreen) {
            return;
        }

        openCloseDrawer();
    }


    function initDrawerHeader() {

        drawerHeader = _getElementById('drawer_header');
        drawerHeader.addEventListener('click', onClickDrawerHeader);

    }

    function onClickDrawerHeader() {

        if (_isWideScreen) {
            return;
        }

        elementsEffect.blink(drawerHeader);
        openCloseDrawer();
    }

    function openCloseDrawer() {

        _isDrawerOpen = !_isDrawerOpen;
        animateDrawer();
        switchMapOverlay(_isDrawerOpen);
        
    }

    function animateDrawer() {

        // But one animated is horizontalFrame
        var $hFrame = $(horizontalFrame);

        if (_isDrawerOpen) {

            fadeToolHeaderLogo(false, true);
            $hFrame.animate({
                left : 0
            }, DRAWER_DURATION);

        } else {

            $hFrame.animate({
                left : -DRAWER_WIDTH
            }, DRAWER_DURATION, function(){
                fadeToolHeaderLogo(true, true);
            });

        }

    }

    // function onNewPlaceVisit(latLng) {

    //     var options = {
    //         method: 'NEW_PLACE_VISIT',
    //         latLng: {
    //             lat: latLng.lat,
    //             lng: latLng.lng
    //         }
    //     };

    //     var postFadeInRVPage = function() {
    //         mapPage.hideFrame(true);
    //     };

    //     if (recordVisitPage) {
    //         recordVisitPage.initialize(options, postFadeInRVPage);
    //     } else {
    //         loadRecordVisitPageFiles(options, postFadeInRVPage);
    //     }
    // }

    return {

        initialize : _initialize,

        onRelaunch : function(){
            initMapPane();
        },
        
        resizePage : function(isWide) {

            _isWideScreen = isWide;
            _resizeFrames();
        },

        get pageFrame() {
            return mapPageFrame;
        },

        set onMapLongClick(f) {
            _onMapLongClick = f;
        },

        get mapZoomLevel() {
            return mapPane.mapZoomLevel;
        },
        
    };

}());
