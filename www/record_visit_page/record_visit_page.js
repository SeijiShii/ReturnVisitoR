
"use strict"

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.recordVisitPage = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile,
        Place = returnvisitor.data.Place,
        logoButton,
        addressText,
        nameText,
        roomText,
        personContainer,
        addPersonButton,
        AD_FRAME_HEIGHT = 50,
        WIDTH_BREAK_POINT = 500,
        LOGO_BUTTON_SIZE = '40px',
        ROOM_TEXT_HEIGHT = '30px',
        _place,
        // _isWideScreen,
        _options,
        addPersonDialog,
        personDialog,
        appFrame = document.getElementById('app_frame');
    
    function initPlaceData() {

        if (_options.method === 'NEW_PLACE_VISIT') {
            _place = new Place(_options.latLng, 'PLACE')
        }
    }
        
    
    function initLogoButton() {
        // console.log('initLogoButton called!')
        logoButton = document.getElementById('logo_button');
        logoButton.addEventListener('click', onClickLogoButton);
    };

    function onClickLogoButton() {

    }


    function initAddressText() {
        addressText = document.getElementById('address_text');
    }

    function requestReverseGeocoding() {

        if (_place.address) {
            return;
        }

        // Latitude, longitude -> address
        plugin.google.maps.Geocoder.geocode({
            "position": _place.latLng
          }, function(results) {
  
            if (results.length === 0) {
              // Not found
              return;
            }
  
            // console.dir(results);

            var address = results[0].extra.lines[0];
            if (!address) {
                [
                results[0].subThoroughfare || "",
                results[0].thoroughfare || "",
                results[0].locality || "",
                results[0].adminArea || "",
                results[0].postalCode || "",
                results[0].country || ""].join(", ");
            }

            addressText.value = address;
            _place.address = address;

          });
    }

    function initAddPersonButton() {
        addPersonButton = document.getElementById('add_person_button');
        addPersonButton.addEventListener('click', onClickAddPersonButton);
    }

    function onClickAddPersonButton() {

        addPersonDialog.fadeIn(appFrame);

    }

    function initRoomText() {
        roomText = document.getElementById('room_text');
    }

    function refreshRoomText() {
        if ( _place.category === 'ROOM') {
            roomText.className = 'text_input';
        } else {
            roomText.className = 'text_input_invisible';        }
    }

    function loadDialogFiles() {
        loadFile.loadScript('./dialogs/dialog_base.js', function(){
            loadAddPersonDialogScript();
            loadPersonDialogScript();
        });
    }

    function loadAddPersonDialogScript() {
        loadFile.loadScript('./dialogs/add_person_dialog/add_person_dialog.js', function(){
            addPersonDialog = new returnvisitor.AddPersonDialog();
            addPersonDialog.onNewPersonClick = function() {
                personDialog.fadeIn(appFrame);
            };
        });
    }

    function loadPersonDialogScript() {
        loadFile.loadScript('./dialogs/person_dialog/person_dialog.js', function(){
            personDialog = new returnvisitor.PersonDialog();
        });
    }

    function fadeIn() {
        $('#record_visit_page_frame').fadeTo('slow', 1);
    }

    initAddressText();
    initAddPersonButton();
    initRoomText();

    loadDialogFiles();

    return {
        // refreshElements : function(isWideScreen) {
        //     _isWideScreen = isWideScreen;
            
        // },

        initialize : function(options) {
            _options = options;
            initPlaceData();
            requestReverseGeocoding();
            refreshRoomText();

            fadeIn();
        }
    }
}());
