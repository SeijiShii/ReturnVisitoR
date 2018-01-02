
"use strict"

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.recordVisitPage = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile,
        logoButton,
        addressText,
        nameText,
        roomText,
        personContainer,
        addPersonButton,
        AD_FRAME_HEIGHT = 50,
        WIDTH_BREAK_POINT = 500,
        LOGO_BUTTON_SIZE = '40px',
        place,
        _isWideScreen,
        _options,
        addPersonDialog,
        newPersonDialog,
        appFrame = document.getElementById('app_frame');
    
    function initPlaceData() {

        if (_options.method === 'NEW_PLACE_VISIT') {
            place = new returnvisitor.data.Place(_options.latLng)
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

        if (place.address) {
            return;
        }

        // Latitude, longitude -> address
        plugin.google.maps.Geocoder.geocode({
            "position": place.latLng
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
            place.address = address;

            // console.log('place.id:', place.id)
            // console.log('address:', place.address);
          });
    }

    function initAddPersonButton() {
        addPersonButton = document.getElementById('add_person_button');
        addPersonButton.addEventListener('click', onClickAddPersonButton);
    }

    function onClickAddPersonButton() {

        addPersonDialog.fadeIn(appFrame);

    }

    function loadDialogFiles() {
        loadFile.loadScript('./dialogs/dialog_base.js', function(){
            loadAddPersonDialogScript();
            loadNewPersonDialogScript();
        });
    }

    function loadAddPersonDialogScript() {
        loadFile.loadScript('./dialogs/add_person_dialog/add_person_dialog.js', function(){
            addPersonDialog = new returnvisitor.AddPersonDialog();
        });
    }

    function loadNewPersonDialogScript() {
        loadFile.loadScript('./dialogs/new_person_dialog/new_person_dialog.js', function(){
            newPersonDialog = new returnvisitor.NewPersonDialog();
        });
    }

    initAddressText();
    initAddPersonButton();

    loadDialogFiles();

    return {
        refreshElements : function(isWideScreen) {
            _isWideScreen = isWideScreen;
            
        },

        setOptions : function(options) {
            _options = options;
            initPlaceData();
            requestReverseGeocoding();
        }
    }
}());
