/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// 171220 DONE 現在位置の保存と読み出し機能を追加する。
// 171221 DONE refreshAdFrame() adFrameの位置更新メソッドを追加
// 171221 TODO オーバレイとドロワーを追加する。
//          DONE オーバレイをまず実装する。
//          DONE 次いでドロワーを実装する。
//              DONE ドロワーに左スワイプ閉じを実装
// 171222 DONE 幅広画面の時、ドロワーのメニューが常時表示されるようにする。

"use strict"

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.recordVisitPage = (function() {

    var adFrame,
        appFrame,
        logoButton,
        addressText,
        AD_FRAME_HEIGHT = 50,
        WIDTH_BREAK_POINT = 500,
        LOGO_BUTTON_SIZE = '40px',
        args,
        place;

        function setArgs() {
        
            args = {};
            var pairs = location.search.substring(1).split('&');
    
            for (var i = 0 ; i < pairs.length ; i++) {
                var kv = pairs[i].split('=');
                args[kv[0]] = kv[1]
            }
        }
    
        function initPlaceData() {
            if (args.method === 'RECORD_NEW_PLACE') {
                var latLng = {
                    lat : args.lat,
                    lng : args.lng
                }
                place = new RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place(latLng)
            }
        }
        
    function initAppFrame() {
        appFrame = document.getElementById('app_frame');
    }

    function onDeviceReady() {
        // console.log('onDeviceReady called!');
    
        setArgs();
        initPlaceData();

        initAdFrame();
        refreshAdFrame();

        initAppFrame();
        refreshAppFrame();

        initAddressText();
        requestReverseGeocoding();

        // initLogoButton();
        // refreshLogoButton(false);
    }

    function onResizeScreen() {
        // console.log('onResiseScreen called!');
        cordova.fireDocumentEvent('plugin_touch', {});
    
        if (cordova.platform === 'browser') {
            // ブラウザでは連続的に呼ばれるので
            if (resizeTimer !== false) {
                clearTimeout(resizeTimer);
            }

            var resizeTimer = setTimeout(refreshScreenElements, 200);

        } else {
            refreshScreenElements();
        }
    }
    
    function refreshScreenElements() {

        refreshAppFrame();
        refreshAdFrame();
        // refreshLogoButton(true);

    }

    function refreshAppFrame() {
        // console.log('window.innerHeight: ' + window.innerHeight);
        appFrame.style.height = (window.innerHeight - AD_FRAME_HEIGHT) + 'px';
        
        // console.log('appFrame.style.height: ' + appFrame.style.height);
        
    }
    
    function initLogoButton() {
        // console.log('initLogoButton called!')
        logoButton = document.getElementById('logo_button');
        logoButton.addEventListener('click', onClickLogoButton);
    };

    function onClickLogoButton() {

    }

    // function refreshLogoButton(animated) {
    //     if (isWideScreen()) {
    //         if (animated) {
    //             $(logoButton).fadeTo(DRAWER_DURATION, 0, function(){
    //                 logoButton.style.width = 0;
    //             });   
    //         } else {
    //             logoButton.style.opacity = 0;
    //             logoButton.style.width = 0;
    //         }
    //     } else {
    //         logoButton.style.width = LOGO_BUTTON_SIZE;
    //         if (animated) {
    //             $(logoButton).fadeTo(DRAWER_DURATION, 1);
    //         } else {
    //             logoButton.style.opacity = 1;
    //         }
    //     }
    // }

    function initAdFrame() {
        adFrame = document.getElementById('ad_frame');
    }

    function refreshAdFrame() {
        adFrame.style.top = (window.innerHeight - AD_FRAME_HEIGHT) + 'px';
    }


    function isWideScreen() {
        return window.innerWidth > WIDTH_BREAK_POINT;
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

    var dataObject = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile('../data/data_object.js');
    document.getElementsByTagName('head')[0].appendChild(dataObject);

    var placeOject = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile('../data/place.js');
    document.getElementsByTagName('head')[0].appendChild(placeOject);

    document.addEventListener('deviceready', onDeviceReady, false);
    window.addEventListener('resize', onResizeScreen);

}());
