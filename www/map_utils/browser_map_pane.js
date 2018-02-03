'use strict';

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.mapUtils');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.mapUtils.BrowserMapPane = function(parent, gestureEnabled, latLng) {

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
        tmpMarker,
        LATITUDE = 'latitude',
        LONGTUDE = 'longitude',
        CAMERA_ZOOM = 'camera_zoom',
        LONG_PRESS_DURATION = 1000;
        // _onMapLongClick;
        
 
    function initGoogleMap() {

        if (_gestureEnabled === undefined) {
            _gestureEnabled = true;
        } 

        parent.innerHTML = '';

        mapDiv = document.createElement('div');
        $(mapDiv).css({
            top : 0,
            left : 0,
            width : '100%',
            height : '100%'
        });
        mapDiv.id = 'map_div';
        parent.appendChild(mapDiv);

        var cameraPosition = loadCameraPosition();

        if (_latLng) {
            cameraPosition.lat = latLng.lat;
            cameraPosition.lng = latLng.lng;
        }

        initBrowserMap(cameraPosition);

    }

    function initBrowserMap(cameraPosition) {

        var options = {
            center: {
                lat : 0,
                lng : 0
            },
            zoom : 4,
            mapTypeId : google.maps.MapTypeId.HYBRID,
            streetViewControl : false,
            mapTypeControl: false,
            fullscreenControl: false,
        };

        if (cameraPosition) {
            options.center = {
                lat : parseFloat(cameraPosition.lat),
                lng : parseFloat(cameraPosition.lng)
            };
            options.zoom =  parseInt(cameraPosition.zoom);
        }

        if (_gestureEnabled) {

            options.zoomControl = true;
            options.clickableIcons = true;
            options.disableDoubleClickZoom = true;
            options.draggable = true;

        } else {

            options.zoomControl = false;
            options.clickableIcons = false;
            options.disableDoubleClickZoom = false;
            options.draggable = false;

        }


        map = new google.maps.Map(mapDiv, options);



        map.addListener('dragend', onBrowserMapCameraPositionChange) ;
        map.addListener('zoom_changed', onBrowserMapCameraPositionChange);

        enableLongClickListenerOnBrowserMap(_gestureEnabled);
    }

    function onBrowserMapCameraPositionChange() {
        var latLng = {
            lat : map.getCenter().lat(),
            lng : map.getCenter().lng()
        };
            
        saveCameraPosition(latLng, map.getZoom());
    }

    function enableLongClickListenerOnBrowserMap(enabled) {

        if (enabled) {
            map.addListener('mousedown', onMousedown);
            map.addListener('mouseup', onMouseup);
            map.addListener('dragstart', onDragStart);
    
            var isPressing = false;
                 
        } else {
            var clearListeners = google.maps.event.clearListeners;
            clearListeners(map, 'mousedown');
            clearListeners(map, 'mouseup');
            clearListeners(map, 'dragstart');
            
        }

        function onMousedown(e) {

            if (isPressing) {
                return;
            }

            // console.log('onMouseDown');

            isPressing = true;

            var checkPressing = function() {
                if (isPressing) {
                    clearTimeout(timerId);
                    isPressing = false;
                    onLongClickBrowserMap(e.latLng);
                }
            };

            var timerId = setTimeout(checkPressing, LONG_PRESS_DURATION);
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

        // map.panTo(_latLng);

        tmpMarker = new google.maps.Marker({
            position : latLng,
            map : map,
            icon : {
                url : markerPaths.pinMarkerPaths.grayPin,
                size : new google.maps.Size(34, 48),
                scaledSize : new google.maps.Size(25, 35)                  
            }
            
        });

        postMapLongClick(_latLng);
        
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

        tmpMarker.setMap(null);
    }

    function addMarkerOnMap(place, interest) {

        var markerPath = pinMarkerPaths.values[Person.interest.indexOfKey(interest)];

        var marker = new google.maps.Marker({
            position : place.latLng,
            map : map,
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

    function onClickBrowserMarker(e) {

        var latLng = {
            lat : e.latLng.lat(),
            lng : e.latLng.lng()
        };

        dbHelper.loadPlaceByLatLng(latLng, function(dbData){
            
            console.log(dbData);
        });
    }

    this.addMarkerOnMap = function(place) {

        place.queryInterest(function(interest){

            addMarkerOnMap(place, interest);
        });  
    };

    // TODO: dialog to show place data.

    function initialize() {

        initGoogleMap();
    }

    this.__mapZoomLevel = function() {

        return map.getZoom();
    };

    initialize();

};

Object.defineProperties(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.mapUtils.BrowserMapPane, {
    
    zoomLevel : {
        get : function() {

            return this.__mapZoomLevel();
        } 
    }

});
