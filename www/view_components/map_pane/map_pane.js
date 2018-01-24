'use strict';

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.mapPane = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        Person = returnvisitor.data.Person,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        markerPaths = common.markerPaths,
        pinMarkerPaths = markerPaths.pinMarkerPaths,
        dbHelper = common.dbHelper,
        mapDiv,
        nativeMap,
        nativeEvent = plugin.google.maps.event,
        browserMap,
        tmpMarker,
        LATITUDE = 'latitude',
        LONGTUDE = 'longitude',
        CAMERA_ZOOM = 'camera_zoom',
        LONG_PRESS_DURATION = 1500,
        _tellOnMapLongClicked,
        _onClickMarker;
        
 
    function initGoogleMap(parent) {
    
        mapDiv = document.createElement('div');
        $(mapDiv).css({
            top : 0,
            left : 0,
            width : '100%',
            height : '100%'
        });
        parent.appendChild(mapDiv);

        var cameraPosition = loadCameraPosition();

        // console.log(cameraPosition);

        if (isBrowser()) {
            loadFile.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDmr4KjAGEvMjcmDdR7G6LdBIutoAAA2Yo&callback=RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.mapPane.onBrowserMapReady');
        } else {
            initNativeMap(cameraPosition);
        }
    }

    function initNativeMap(cameraPosition) {
        var options = {
            'mapType': plugin.google.maps.MapTypeId.HYBRID,
            'controls': {
                'compass': true,
                'zoom': true,
                'myLocationButton': true,
                'mapToolbar' : false
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

        if (cameraPosition) {
            options['camera'] = {
                'target' : {
                    lat: cameraPosition.lat,
                    lng: cameraPosition.lng
                },
                'zoom' : cameraPosition.zoom
            };
        }
    
        nativeMap = plugin.google.maps.Map.getMap(mapDiv, options);
        
        nativeMap.on(nativeEvent.CAMERA_MOVE_END, function() {
            saveCameraPosition(nativeMap.getCameraPosition().target, nativeMap.getCameraPosition().zoom);
        });

        nativeMap.on(nativeEvent.MAP_LONG_CLICK, onLongClickNativeMap);

    }

    function onLongClickNativeMap(latLng) {
        
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
                url: markerPaths.pinMarkerPaths.grayPin,
                size: {
                    width: 25,
                    height: 35
                }
            }

        }, function(marker){
            tmpMarker = marker;
        });


        postMapLongClick(latLng);

    }

    var _onBrowserMapReady = function() {

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

        var cameraPosition = loadCameraPosition();

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

        enableLongClickListenerOnBrowserMap(true);

    };

    function onBrowserMapCameraPositionChange() {
        var latLng = {
            lat : browserMap.getCenter().lat(),
            lng : browserMap.getCenter().lng()
        };
            
        saveCameraPosition(latLng, browserMap.getZoom());
    }

    function enableLongClickListenerOnBrowserMap(enabled) {

        if (enabled) {
            browserMap.addListener('mousedown', onMousedown);
            browserMap.addListener('mouseup', onMouseup);
            browserMap.addListener('dragstart', onDragStart);
    
            var isPressing = false;
                 
        } else {
            var clearListeners = google.maps.event.clearListeners;
            clearListeners(browserMap, 'mousedown');
            clearListeners(browserMap, 'mouseup');
            clearListeners(browserMap, 'dragstart');
            
        }

        function onMousedown(e) {
            isPressing = true;

            var checkPressing = function() {
                if (isPressing) {
                    onLongClickBrowserMap(e.latLng);
                }
            };

            setTimeout(checkPressing, LONG_PRESS_DURATION);
        }

        function onMouseup() {
            isPressing = false;
        }

        function onDragStart() {
            isPressing = false;
        }

    }

    function onLongClickBrowserMap(latLng) {

        var _latLng = {
            lat : latLng.lat(),
            lng : latLng.lng()
        };

        browserMap.panTo(_latLng);

        tmpMarker = new google.maps.Marker({
            position : latLng,
            map : browserMap,
            icon : {
                url : markerPaths.pinMarkerPaths.grayPin,
                size : new google.maps.Size(34, 48),
                scaledSize : new google.maps.Size(25, 35)                  
            }
            
        });

        postMapLongClick(_latLng);
        
    }

    function postMapLongClick(latLng){

        if (typeof _tellOnMapLongClicked === 'function' ) {
            _tellOnMapLongClicked(latLng);
        }
    }

    function saveCameraPosition(latLng, zoom) {

        // console.log(latLng, zoom);

        var storage = window.localStorage;
        storage.setItem(LATITUDE, latLng.lat);
        storage.setItem(LONGTUDE, latLng.lng);
        storage.setItem(CAMERA_ZOOM, zoom);
    }

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
    }


    function removeTmpMarker() {

        if (isBrowser()) {
            tmpMarker.setMap(null);
        } else {
            tmpMarker.remove();
        }
    }

    function isBrowser() {
        return cordova.platformId === 'browser';
    } 

    function addMarkerOnMap(place, interest) {

        var markerPath = pinMarkerPaths.values[Person.interest.indexOfKey(interest)];

        if (cordova.platformId === 'android') {

            nativeMap.addMarker({
                position: {
                    lat: place.latLng.lat,
                    lng: place.latLng.lng
                },
                icon: {
                    url: markerPath,
                    size: {
                        width: 25,
                        height: 35
                    }
                }
    
            }, function(marker){
          
                console.log(marker);
                marker.on(nativeEvent.MARKER_CLICK, onClickNativeMarker);
                
            }); 
        } else {

            var marker = new google.maps.Marker({
                position : place.latLng,
                map : browserMap,
                icon : {
                    url : markerPath,
                    size : new google.maps.Size(34, 48),
                    scaledSize : new google.maps.Size(25, 35)                  
                }
            });

            // marker.placeId = place.id;
            // console.log(marker);

            marker.addListener('click', onClickBrowserMarker);
        }
    }

    function onClickBrowserMarker(e) {

        var latLng = {
            lat : e.latLng.lat(),
            lng : e.latLng.lng()
        };

        dbHelper.loadPlaceByLatLng(latLng, function(dbData){
            
            console.log(dbData);
        });
    }

    function onClickNativeMarker(latLng) {

        dbHelper.loadPlaceByLatLng(latLng, function(dbData){
            
            console.log(dbData);
        });
    }

    // TODO: dialog to show place data.

    function _enableGestures(enabled) {

        if (cordova.platformId === 'android' ) {

            if (enabled) {
                nativeMap.setOptions({
                    'gestures': {
                        'scroll': true,
                        'tilt': true,
                        'rotate': true,
                        'zoom': true
                    },
                    'controls': {
                        'compass': true,
                        'myLocationButton': true,
                        'indoorPicker': true,
                        'zoom': true // Only for Android
                    },
                });
            } else {
                nativeMap.setOptions({
                    'gestures': {
                        'scroll': false,
                        'tilt': false,
                        'rotate': false,
                        'zoom': false
                    },
                    'controls': {
                        'compass': false,
                        'myLocationButton': false,
                        'indoorPicker': false,
                        'zoom': false // Only for Android
                    },
                });
            }
    
        } else {

            if (enabled) {

                browserMap.setOptions({
                    zoomControl: true,
                    clickableIcons : true,
                    disableDoubleClickZoom : true,
                    draggable : true,
                });
                enableLongClickListenerOnBrowserMap(true);
                
            } else {

                browserMap.setOptions({
                    zoomControl: false,
                    clickableIcons : false,
                    disableDoubleClickZoom : false,
                    draggable : false,
                });
                enableLongClickListenerOnBrowserMap(false);
            }
        }
    }


    function _initialize(parent) {

        loadCameraPosition();
        initGoogleMap(parent);
    }

 
    return {

        initialize : _initialize,
        onBrowserMapReady : _onBrowserMapReady,
     
        set onMapLongClick(f) {
            _tellOnMapLongClicked = f;
        },

        set onClickMarker(f) {
            _onClickMarker = f;
        },

        enableGestures : _enableGestures,
        
    };

}());
