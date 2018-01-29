'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.placePage = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        elements = common.elements,
        viewComponents = returnvisitor.viewComponents,
        mapUtils = returnvisitor.mapUtils,
        data = returnvisitor.data,
        Place = data.Place,
        Visit = data.Visit,
        pageFrame,
        mapPaneBase,
        mapPane,
        addressText,
        placeNameText,
        primaryFrame,
        secondaryFrame,
        _pageOptions,
        placeActionPane,
        recordVisitPane,
        _onCancelClick,
        _place,
        FADE_DURATION = 300;

    function _initialize(onReadyCallback, pageOptions) {

        _pageOptions = pageOptions;
        initPlaceData();
        
        loadFile.loadCss('./pages/place_page/place_page.css');
        loadFile.loadHtmlAsElement('./pages/place_page/place_page.html', function(elm){

            pageFrame = elm;

            initFrames();
            requestReverseGeocoding();
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

        if (cordova.platformId === 'browser') {

            var wait = function() {

                if (returnvisitor.app.isBrowserMapReady) {
                    clearInterval(timerId);
                    mapPane = new mapUtils.BrowserMapPane(mapPaneBase, false, _pageOptions.latLng);
                }
            };
            var timerId = setInterval(wait, 20);

        } else {

            mapPane = new mapUtils.NativeMapPane(mapPaneBase, false, _pageOptions.latLng);

        }
    }

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
            fadeOutPanesAndShowNext(loadRecordVisitPaneIfNeeded);
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

    function initPlaceData() {
        _place = _pageOptions.place;
        
        if (!_place) {
            _place = new Place(_pageOptions.latLng);
        }
    }

    function refreshAddressText() {

        addressText.value = _place.address;
    }

    function requestReverseGeocoding() {

        if (_place.address) {
            return;
        }

        // Latitude, longitude -> address
        plugin.google.maps.Geocoder.geocode({
            'position': _place.latLng
        }, function(results) {

            if (results.length === 0) {
                // Not found
                return;
            }

            // console.dir(results);

            var address = results[0].extra.lines[0];
            if (!address) {
                [
                    results[0].subThoroughfare || '',
                    results[0].thoroughfare || '',
                    results[0].locality || '',
                    results[0].adminArea || '',
                    results[0].postalCode || '',
                    results[0].country || ''].join(', ');
            }

            _place.address = address;
            refreshAddressText();

        });
    }

    function fadeOutPanesAndShowNext(showNextPaneFunc) {

        var primaryReady = false,
            secondaryReady = false;

        $(primaryFrame).fadeTo(0, FADE_DURATION, function(){
            if (primaryFrame.children.length > 0) {
                primaryFrame.removeChild(primaryFrame.firstChild);
            } 

            primaryReady = true;

        });

        $(secondaryFrame).fadeTo(0, FADE_DURATION, function(){
            if (secondaryFrame.children.length > 0) {
                secondaryFrame.removeChild(secondaryFrame.firstChild);
            }

            secondaryReady = true;
        });

        var wait = function() {

            if (primaryReady && secondaryReady) {
                clearInterval(timerId);
                showNextPaneFunc();
            }
        };

        var timerId = setInterval(wait, 20);
        
    }

    function loadRecordVisitPaneIfNeeded() {

        if (recordVisitPane) {
            initRecordVisitPane();
        } else {
            loadFile.loadScript('./view_components/record_visit_pane/record_visit_pane.js', function(){
                initRecordVisitPane();
            });
        }
    }

    function initRecordVisitPane() {
        recordVisitPane = viewComponents.recordVisitPane;
        var visit = new Visit(_place);
        recordVisitPane.initialize(function(){
            onReadyRecordVisitPane();
        }, visit);
    }

    function onReadyRecordVisitPane() {

        primaryFrame.appendChild(recordVisitPane.primaryFrame);
        secondaryFrame.appendChild(recordVisitPane.secondaryFrame);

        $(primaryFrame).fadeTo(1, FADE_DURATION);
        $(secondaryFrame).fadeTo(1, FADE_DURATION);
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