"use strict"

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.mapPage = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        _this = this,
        _isWideScreen,
        mapDivBase,
        mapDiv,
        nativeMap,
        browserMap,
        tmpMarker,
        logoButton,
        drawerOverlay,
        isDrawerOverlayShowing = false,
        drawer,
        drawerSwipeStartX,
        drawerSwipeMoveX,
        drawerLogoButton,
        AD_FRAME_HEIGHT = 50,
        WIDTH_BREAK_POINT = 500,
        DRAWER_WIDTH = 240,
        DRAWER_DURATION = 300,
        LOGO_BUTTON_SIZE = '40px',
        LATITUDE = 'latitude',
        LONGTUDE = 'longitude',
        CAMERA_ZOOM = 'camera_zoom',
        mapLongClickDialog,
        loadFile = returnvisitor.common.loadFile,
        _latLng,
        isWebGoogleMapReady;
   
 
    function initGoogleMap() {
    
        mapDiv = document.getElementById('map_div');
        var cameraPosition = loadCameraPosition();

        console.log(cameraPosition);

        if (cordova) {
            if (cordova.platformId === 'browser') {
                initBrowserMap(cameraPosition);
            } else {
                initNativeMap(cameraPosition);
            }
        }
    }

    function initNativeMap(cameraPosition) {
        var options = {
            'mapType': plugin.google.maps.MapTypeId.HYBRID,
            'controls': {
                'compass': true,
                'zoom': true,
                'myLocationButton': true
            },
            'preferences': {
                'padding': {
                    top: 50
                }
            }, 
            'camera': {
                'target': {
                    lat: 0,
                    lng: 0
                },
                'zoom': 4
            }
        };

        if (position) {
            options['camera'] = {
                'target' : {
                    lat: cameraPosition.lat,
                    lng: cameraPosition.lng
                },
                'zoom' : cameraPosition.zoom
            }
        }
    
        nativeMap = plugin.google.maps.Map.getMap(mapDiv, options);
        
        nativeMap.on(plugin.google.maps.event.CAMERA_MOVE_END, function() {
            saveCameraPosition(nativeMap.getCameraPosition().target, nativeMap.getCenter().zoom);
        });

        nativeMap.on(plugin.google.maps.event.MAP_LONG_CLICK, function(latLng){

            _latLng = latLng;

            // console.log('Map long clicked: ' + latLng.toUrlValue());
            nativeMap.animateCamera({
                target: {
                    lat: latLng.lat,
                    lng: latLng.lng
                },
                duration: 500
            });

            nativeMap.addMarker({
                position: {
                    lat: latLng.lat,
                    lng: latLng.lng
                },
                icon: {
                    url: "./img/pin_marker/m/pin_marker_gray.png",
                    size: {
                        width: 25,
                        height: 35
                    }
                }

            }, function(marker){
                tmpMarker = marker;
            });

 
            mapLongClickDialog.fadeIn(mapDiv);

        });
    }

    function initBrowserMap(cameraPosition) {

        browserMap = new google.maps.Map(mapDiv, {
            center: {
                lat : 0,
                lng : 0
            },
            zoom : 4,
            mapTypeId : google.maps.MapTypeId.HYBRID,
            streetViewControl : false,
            mapTypeControl: false,
            fullscreenControl: false,
        });

        if (cameraPosition) {
            browserMap.setOptions({
                center: {
                    lat : parseFloat(cameraPosition.lat),
                    lng : parseFloat(cameraPosition.lng)
                },
                zoom : parseInt(cameraPosition.zoom)
            });
        }

        browserMap.addListener('dragend', onBrowserMapCameraPositionChange) ;
        browserMap.addListener('zoom_changed', onBrowserMapCameraPositionChange);

    }

    function onBrowserMapCameraPositionChange() {
        var latLng = {
            lat : browserMap.getCenter().lat(),
            lng : browserMap.getCenter().lng()
        }
            
        saveCameraPosition(latLng, browserMap.getZoom());
    }

    function initMapDivBase() {

        mapDivBase = document.getElementById('map_div_base');

    }

    function refreshMapDivBase() {

        if (_isWideScreen) {
            mapDivBase.style.left = DRAWER_WIDTH + 'px';
            mapDivBase.style.width = (window.innerWidth - DRAWER_WIDTH) + 'px';

        } else {
            mapDivBase.style.left = 0;
            mapDivBase.style.width = window.innerWidth + 'px';
        }
    }

    function saveCameraPosition(latLng, zoom) {

        console.log(latLng, zoom);

        var storage = window.localStorage;
        storage.setItem(LATITUDE, latLng.lat);
        storage.setItem(LONGTUDE, latLng.lng);
        storage.setItem(CAMERA_ZOOM, zoom);
    };

    function loadCameraPosition() {
        var storage = window.localStorage;
        var lat = storage.getItem(LATITUDE);
        if (!lat) {
            return null;
        }
        var lng = storage.getItem(LONGTUDE);
        if (!lng) {
            return null;
        }
        var zoom = storage.getItem(CAMERA_ZOOM);
        if (!zoom) {
            return null;
        }
        return {
            lat: lat,
            lng: lng,
            zoom: zoom
        };
    };

    function initLogoButton() {
        logoButton = document.getElementById('logo_button');
        logoButton.addEventListener('click', onClickLogoButton);
    };

    function onClickLogoButton() {
        fadeDrawerOverlay(true, true);
        openCloseDrawer(true, true);
    }

    function refreshLogoButton(animated) {
        if (_isWideScreen) {
            if (animated) {
                $(logoButton).fadeTo(DRAWER_DURATION, 0, function(){
                    logoButton.style.width = 0;
                });   
            } else {
                logoButton.style.opacity = 0;
                logoButton.style.width = 0;
            }
        } else {
            logoButton.style.width = LOGO_BUTTON_SIZE;
            if (animated) {
                $(logoButton).fadeTo(DRAWER_DURATION, 1);
            } else {
                logoButton.style.opacity = 1;
            }
        }
    }

    // ドロワーオーバレイ関連
    function initDrawerOverlay() {
        drawerOverlay = document.getElementById('drawer_overlay');   
        fadeDrawerOverlay(false, false);
    }

    function refreshDrawerOverlay() {
        if (_isWideScreen) {
            drawerOverlay.removeEventListener('click', onClickDrawerOverlay);
        } else {
            drawerOverlay.addEventListener('click', onClickDrawerOverlay);  
        }

        if (isDrawerOverlayShowing) {
            fadeDrawerOverlay(false, true);
        } 
    }

    function onClickDrawerOverlay() {
        fadeDrawerOverlay(false, true);
        openCloseDrawer(false, true);
    }

    function fadeDrawerOverlay(fadeIn, animated) {

        // console.log('fadeDrawerOverlay called! fadeIn: ' + fadeIn + ', animated: ' + animated);

        if (animated) {
            if (fadeIn) {
                drawerOverlay.style.width = '100%';
                $(drawerOverlay).fadeTo(DRAWER_DURATION, 1);
                isDrawerOverlayShowing = true;
            } else {
                $(drawerOverlay).fadeTo(DRAWER_DURATION, 0, function(){
                    drawerOverlay.style.width = 0;
                    isDrawerOverlayShowing = false;    
                });
            }
        } else {
            if (fadeIn) {
                drawerOverlay.style.width = '100%';
                drawerOverlay.style.opacity = 1;
                isDrawerOverlayShowing = true;
            } else {
                drawerOverlay.style.opacity = 0;
                drawerOverlay.style.width = 0;
                isDrawerOverlayShowing = false;
            }
        }
    } 

    // ドロワー関連
    function initDrawer() {
        drawer = document.getElementById('drawer');
        openCloseDrawer(false, false);

        drawer.addEventListener('touchstart',function(event){
            // これをすると子要素のクリックイベントが発火しなくなる。
            // event.preventDefault();
            drawerSwipeStartX = event.touches[0].pageX;
            drawerSwipeMoveX = event.touches[0].pageX;
            // console.log('Drawer touch start! x: ' + drawerSwipeStartX);
        }, false);

        drawer.addEventListener('touchmove', function() {
            // これがないとtouchendイベントが発火しない。
            event.preventDefault();
            drawerSwipeMoveX = event.touches[0].pageX;
            // console.log('Drawer touch move! x: ' + drawerSwipeMoveX);
        }, false);

        drawer.addEventListener('touchend', (function(event){

            // console.log('Drawer swipe end! x: ' + drawerSwipeMoveX);
            if ((drawerSwipeMoveX + 50) < drawerSwipeStartX) {
                openCloseDrawer(false, true);
                fadeDrawerOverlay(false,true);
            }
        }), false);
    }

    function openCloseDrawer(open, animated) {

        if (_isWideScreen) {
            return;
        }

        if (animated) {
            if (open) {
                $(drawer).animate({'left' : '0px'}, DRAWER_DURATION);
            } else {
                $(drawer).animate({'left' : '-' + DRAWER_WIDTH + 'px'}, DRAWER_DURATION);
            }

        } else {
            if (open) {
                drawer.style.left = 0;
            } else {
                drawer.style.left = '-' + DRAWER_WIDTH + 'px';
            }
        }

    }

    function refreshDrawer() {
        
        if (_isWideScreen) {
            drawer.style.left = 0;
        } else {
            drawer.style.left = '-' + DRAWER_WIDTH + 'px';
        }
    }

    // ドロワー上のロゴボタン
    function initDrawerLogoButton() {

        // console.log('initDrawerLogoButton called!')

        drawerLogoButton = document.getElementById('drawer_logo_button');
        refreshDrawerLogoButton();
        
    }

    function onDrawerLogoClick() {
            // console.log('Drawer logo button clicked!');
            openCloseDrawer(false, true);
            fadeDrawerOverlay(false, true);
    }

    function refreshDrawerLogoButton() {
        if (_isWideScreen) {
            drawerLogoButton.removeEventListener('click', onDrawerLogoClick);
        } else {
            drawerLogoButton.addEventListener('click', onDrawerLogoClick);
        }
    }

    function startLoadDialogBaseScript() {
        loadFile.loadScript('./dialogs/dialog_base.js', function(){
            loadMapLongClickDialogFiles();

        });
    }

    function loadMapLongClickDialogFiles() {
        loadFile.loadScript('./dialogs/map_long_click_dialog/map_long_click_dialog.js', function(){
            // console.log('MapLongClickDialog loaded!')
            initMapLongClickDialog();
           
        });

    }

    function initMapLongClickDialog() {
        mapLongClickDialog = new returnvisitor.MapLongClickDialog();

        mapLongClickDialog.onCancelClick = function() {
            tmpMarker.remove();
        };

        mapLongClickDialog.onNewPlaceClick = function() {
            tmpMarker.remove();

            nativeMap.remove();
            var mapPageFrame = document.getElementById('map_page_frame');
            $(mapPageFrame).fadeOut('slow', function() {
                mapPageFrame.parentElement.removeChild(mapPageFrame);
            });

            if (typeof _this.onNewPlaceVisitClick === 'function') {
                _this.onNewPlaceVisitClick(_latLng);
            }
        };

        mapLongClickDialog.onOverlayClick = function() {
            tmpMarker.remove();
        };
    }

    var refreshElements = function(isWideScreen, animated) {

        _isWideScreen = isWideScreen;

        refreshMapDivBase();
        refreshDrawer();
        refreshDrawerOverlay();
        refreshLogoButton(animated);
        refreshDrawerLogoButton();

        if (mapLongClickDialog !== undefined) {
            mapLongClickDialog.refreshDialogHeight();
        }
    }


    loadCameraPosition();
    initMapDivBase();
    initGoogleMap();
    initLogoButton();
    initDrawerOverlay();
    initDrawer();
    initDrawerLogoButton();

    startLoadDialogBaseScript();

    // var offspring = returnvisitor.common.elements.getAllOffspring(document.body);
    // console.log(offspring);

    return {
        refreshElements : refreshElements,
        isWebGoogleMapReady : isWebGoogleMapReady
    }

}());
