'use strict';

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.mapPage = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        viewComponents = returnvisitor.viewComponents,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements,
        elementsEffect  = common.elementsEffect,
        SwipeElement    = common.SwipeElement,
        waiter          = common.waiter,
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
        _places = [],
        _isDrawerOpen   = false,
        _isMapOverlaySet = false,
        _isWideScreen = false,
        _onMapLongClick,
        _onClickMarkerOnMap;

    function _initialize(onReadyCallback, isWide) {

        _isWideScreen = isWide;

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

        drawerSwipe = new SwipeElement(drawerFrame, {
            xSwipeEnabled : true,
            ySwipeEnabled : false,
            effectedElement : horizontalFrame,
            leftLimit : -200,
            rightLimit : -200,
            swipeThru : true
        });

        drawerSwipe.onEndSwipe = function(pos) {
            refreshElementOnPosition(pos);
        };

        function refreshElementOnPosition(pos) {

            _isDrawerOpen = pos.left == -200;

            // console.log(_isDrawerOpen);
            switchMapOverlay(_isDrawerOpen);
            fadeToolHeaderLogo(!_isDrawerOpen, true);
        }
    }
    // resize frames

    function resizeHorizontalFrame() {

        var $hFrame = $(horizontalFrame);

        drawerSwipe.swipeEnabled = (!_isWideScreen);
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
        
        drawerHeader.blink.enable(!_isWideScreen);
        fadeToolHeaderLogo(!_isWideScreen, false);

    }

    function initMapPane() {

        if (isBrowser()) {

            loadFile.loadScript('./map_utils/browser_map_pane.js', function(){

                waiter.wait(function(){
                    mapPane = new returnvisitor.mapUtils.BrowserMapPane(mapPaneBase);
                    postInitMap();

                }, function(){
                    return returnvisitor.app.isBrowserMapReady;
                });                
            });

        } else {

            loadFile.loadScript('./map_utils/native_map_pane.js', function(){

                mapPane = new returnvisitor.mapUtils.NativeMapPane(mapPaneBase);
                postInitMap();
    
            });
        }
    }

    

    function postInitMap() {

        mapPane.onMapLongClick = _onMapLongClick;
        mapPane.onClickMarker = function(place) {

            if ( typeof _onClickMarkerOnMap === 'function' ) {
                _onClickMarkerOnMap(place);
            } 
        };
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
        drawerHeader.blink = new elementsEffect.Blink(drawerHeader, !_isWideScreen);
        drawerHeader.addEventListener('click', onClickDrawerHeader);

    }

    function onClickDrawerHeader() {

        if (_isWideScreen) {
            return;
        }
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

    // function _addNewPlaceMarker(place, interest) {
    //     mapPane.addMarker({
    //         latLng : place.latLng,
    //         category : place.category,
    //         interest : interest,
    //         clickable : true
    //     });
    // }

    function isBrowser() {
        return cordova.platformId === 'browser';
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

        // addNewPlaceMarker : _addNewPlaceMarker,

        get pageFrame() {
            return mapPageFrame;
        },

        set onMapLongClick(f) {
            _onMapLongClick = f;
        },

        get mapZoomLevel() {
            return mapPane.mapZoomLevel;
        },

        set onClickMarkerOnMap(f) {
            _onClickMarkerOnMap = f;
        }
        
    };

}());
