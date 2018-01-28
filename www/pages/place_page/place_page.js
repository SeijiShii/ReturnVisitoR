'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.placePage = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        elements = common.elements,
        viewComponents = returnvisitor.viewComponents,
        MapPane = viewComponents.MapPane,
        pageFrame,
        mapPaneBase,
        mapPane,
        // mapDiv,
        addressText,
        placeNameText,
        primaryFrame,
        secondaryFrame,
        // _mapOptions,
        _pageOptions,
        placeActionPane,
        _onCancelClick;

    function _initialize(onReadyCallback, pageOptions) {

        _pageOptions = pageOptions;

        loadFile.loadCss('./pages/place_page/place_page.css');
        loadFile.loadHtmlAsElement('./pages/place_page/place_page.html', function(elm){

            pageFrame = elm;

            initFrames();
            initMap();

            loadPlaceActionPaneIfNeeded();

            if ( typeof onReadyCallback === 'function' ) {
                onReadyCallback();
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

        mapPaneBase = _getElementById('map_pane_base');
        mapPane = new MapPane(mapPaneBase, false, _pageOptions.latLng);
         
        // mapDiv = _getElementById('map_div');

        // if (isBrowser()) {

        //     initBrowserMap();
        // } else {

        //     initNativeMap();
        // }
    }

    // function initBrowserMap() {

    //     var browserMap = new google.maps.Map(mapDiv, {
    //         center: {
    //             lat : _mapOptions.latLng.lat,
    //             lng : _mapOptions.latLng.lng
    //         },
    //         zoom : _mapOptions.zoom,
    //         mapTypeId : google.maps.MapTypeId.HYBRID,
    //         streetViewControl : false,
    //         mapTypeControl: false,
    //         fullscreenControl: false,
    //         draggable : false
    //     });
    // }

    // function initNativeMap() {

    //     var options = {
    //         'mapType': plugin.google.maps.MapTypeId.HYBRID,
    //         'controls': {
    //             'compass': false,
    //             'zoom': false,
    //             'myLocationButton': false,
    //             'mapToolbar' : false
    //         },
    //         'camera': {
    //             'target': {
    //                 lat: _mapOptions.latLng.lat,
    //                 lng: _mapOptions.latLng.lng
    //             },
    //             'zoom': _mapOptions.zoom
    //         },
    //         'gestures': {
    //             'scroll': false,
    //             'tilt': false,
    //             'rotate': false,
    //             'zoom': false
    //         },
    //     };
    
    //     var nativeMap = plugin.google.maps.Map.getMap(mapDiv, options);
    // }

    function _getElementById(id) {

        return elements.getElementById(pageFrame, id);
    }

    function isBrowser() {
        return cordova.platformId === 'browser';
    } 

    function loadPlaceActionPaneIfNeeded() {

        if (placeActionPane) {

            initPlaceActionPane();
        } else {
            loadFile.loadScript('./view_components/place_action_pane/place_action_pane.js', function(){
                initPlaceActionPane();
            });
        }
    }

    function initPlaceActionPane() {

        placeActionPane = viewComponents.placeActionPane;
        placeActionPane.initialize(function(frame){
            primaryFrame.appendChild(frame);
            $(primaryFrame).css({
                height : frame.style.height
            });
        });

        placeActionPane.onNewPlaceClick = function() {

        };

        placeActionPane.onCancelClick = function() {

            if ( typeof _onCancelClick === 'function' ) {
                _onCancelClick();
            }
        };

        $(secondaryFrame).css({
            height : 0
        });
    }

    return {
        initialize          : _initialize,
        get pageFrame() {
            return pageFrame;
        },

        fireMapReloadIfNeeded : function(){
            if (isBrowser()) {
                initMap();
            }
        },

        set onCancelClick(f) {

            _onCancelClick = f;
        }
    };

})();