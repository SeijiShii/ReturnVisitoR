'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.placePage = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        elements = common.elements,
        pageFrame,
        mapDiv,
        addressText,
        placeNameText,
        primaryFrame,
        secondaryFrame,
        _mapOptions;

    function _initialize(callback, mapOptions) {

        _mapOptions = mapOptions;

        loadFile.loadCss('./pages/place_page/place_page.css');
        loadFile.loadHtmlAsElement('./pages/place_page/place_page.html', function(elm){

            pageFrame = elm;

            initFrames();
            initMap();

            if ( typeof callback === 'function' ) {
                callback(pageFrame);
            }

        });        
    }

    function initFrames() {
            
        addressText     = _getElementById('address_text');
        placeNameText   = _getElementById('place_name_text');
        primaryFrame    = _getElementById('primary_frame');
        secondaryFrame  = _getElementById('secondary_frame');
    }

    function initMap() {
         
        mapDiv = _getElementById('map_div');

        if (isBrowser()) {

            initBrowserMap();
        } else {

            initNativeMap();
        }
    }

    function initBrowserMap() {

        var browserMap = new google.maps.Map(mapDiv, {
            center: {
                lat : _mapOptions.latLng.lat,
                lng : _mapOptions.latLng.lng
            },
            zoom : _mapOptions.zoom,
            mapTypeId : google.maps.MapTypeId.HYBRID,
            streetViewControl : false,
            mapTypeControl: false,
            fullscreenControl: false,
            draggable : false
        });
    }

    function initNativeMap() {

        var options = {
            'mapType': plugin.google.maps.MapTypeId.HYBRID,
            'controls': {
                'compass': false,
                'zoom': false,
                'myLocationButton': false,
                'mapToolbar' : false
            },
            'camera': {
                'target': {
                    lat: _mapOptions.latLng.lat,
                    lng: _mapOptions.latLng.lng
                },
                'zoom': _mapOptions.zoom
            },
            'gestures': {
                'scroll': false,
                'tilt': false,
                'rotate': false,
                'zoom': false
            },
        };
    
        var nativeMap = plugin.google.maps.Map.getMap(mapDiv, options);
    }

    function _getElementById(id) {

        return elements.getElementById(pageFrame, id);
    }

    function isBrowser() {
        return cordova.platformId === 'browser';
    } 

    return {
        initialize          : _initialize,
        get pageFrame() {
            return pageFrame;
        },
        fireMapReloadIfNeeded : function(){
            if (isBrowser()) {
                initBrowserMap();
            }
        }
    };

})();