'use strict';

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.mapUtils');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.mapUtils.NativeMapPane = function(parent, gestureEnabled, latLng) {

    var _this = this,
        _latLng = latLng,
        _gestureEnabled = gestureEnabled,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        Person = returnvisitor.data.Person,
        common = returnvisitor.common,
        markerPaths = common.markerPaths,
        pinMarkerPaths = markerPaths.pinMarkerPaths,
        dbHelper = common.dbHelper,
        mapDiv,
        map,
        nativeEvent = plugin.google.maps.event,
        tmpMarker,
        LATITUDE = 'latitude',
        LONGTUDE = 'longitude',
        CAMERA_ZOOM = 'camera_zoom';
        
 
    function initGoogleMap() {

        if (_gestureEnabled === undefined) {
            _gestureEnabled = true;
        } 

        parent.innerHTML = '';

        var wrapper = document.createElement('div');
        $(wrapper).css({
            top : 0,
            left : 0,
            width : '100%',
            height : '100%'
        });
        wrapper.id = 'map_div_wrapper';

        mapDiv = document.createElement('div');
        $(mapDiv).css({
            top : 0,
            left : 0,
            width : '100%',
            height : '100%'
        });
        mapDiv.id = 'map_div';

        wrapper.appendChild(mapDiv);
        parent.appendChild(wrapper);

        var cameraPosition = loadCameraPosition();

        if (_latLng) {
            cameraPosition.lat = latLng.lat;
            cameraPosition.lng = latLng.lng;
        }

        // console.log(cameraPosition);

        initNativeMap(cameraPosition);

    }

    function initNativeMap(cameraPosition) {

        var options = {
            'mapType': plugin.google.maps.MapTypeId.HYBRID,
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
            },
        };

        if (_gestureEnabled) {

            options.gestures = {
                'scroll': true,
                'tilt': true,
                'rotate': true,
                'zoom': true
            };

            options.controls = {
                'compass': true,
                'myLocationButton': true,
                'indoorPicker': true,
                'zoom': true // Only for Android
            };

        } else {

            options.gestures = {
                'scroll': false,
                'tilt': false,
                'rotate': false,
                'zoom': false
            };

            options.controls = {
                'compass': false,
                'myLocationButton': false,
                'indoorPicker': false,
                'zoom': false // Only for Android
            };
        }

        if (cameraPosition) {
            options['camera'] = {
                'target' : {
                    lat: cameraPosition.lat,
                    lng: cameraPosition.lng
                },
                'zoom' : cameraPosition.zoom
            };
        }
    
        map = plugin.google.maps.Map.getMap(mapDiv, options);

        map.on(nativeEvent.CAMERA_MOVE_END, function() {
            saveCameraPosition(map.getCameraPosition().target, map.getCameraPosition().zoom);
        });

        if (_gestureEnabled) {
            map.on(nativeEvent.MAP_LONG_CLICK, onLongClickNativeMap);
        }

    }

    function onLongClickNativeMap(latLng) {
        
        // console.log('Map long clicked: ' + latLng.toUrlValue());
        // map.animateCamera({
        //     target: {
        //         lat: latLng.lat,
        //         lng: latLng.lng
        //     },
        //     duration: 500
        // });

        map.addMarker({
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


    function postMapLongClick(latLng){

        if (typeof _this.onMapLongClick === 'function' ) {
            _this.onMapLongClick(latLng);
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

        tmpMarker.remove();
    }

    function addMarkerOnMap(place, interest) {

        var markerPath = pinMarkerPaths.values[Person.interest.indexOfKey(interest)];

        map.addMarker({
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
    }

    function onClickNativeMarker(latLng) {

        dbHelper.loadPlaceByLatLng(latLng, function(dbData){
            
            console.log(dbData);
        });
    }

    // TODO: dialog to show place data.

    function initialize() {

        initGoogleMap();
    }

    this.__mapZoomLevel = function() {

        return map.getCameraPosition().zoom;
    };

    initialize();

    // function _animateToCenterLatLng() {
        
    //     console.log('mapDiv.clientHeight:', mapDiv.clientHeight);

    //     if (isBrowser()) {

    //         console.log(browserMap.getBounds());
            
    //         browserMap.panTo(_centerLatLng);

    //     } else {

    //         mapProjectionTest();

    //         // map.animateCamera({
    //         //     target: {
    //         //         lat: _centerLatLng.lat,
    //         //         lng: _centerLatLng.lng
    //         //     },
    //         //     duration: 500
    //         // }, function(){
                
                
    //         // });
    //     }
    // } 

};

Object.defineProperties(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.mapUtils.NativeMapPane, {
    
    zoomLevel : {
        get : function() {

            return this.__mapZoomLevel();
        } 
    }

});
