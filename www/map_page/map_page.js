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

var returnvisitor = RETURNVISITOR_APP.namespace('work.c_kogyo.returnvisitor'); 
// var mapPage = RETURNVISITOR_APP.namespace('work.c_kogyo.returnvisitor.mapPage');
returnvisitor.mapPage = function() {

    var _this = this,
        appFrame,
        mapDiv,
        map,
        logoButton,
        WIDTH_BREAK_POINT = 500,
        LATITUDE = 'latitude',
        LONGTUDE = 'longitude',
        CAMERA_ZOOM = 'camera_zoom';

    this.initialize = function() {

        console.log('mapPage.initialize called!');
    
        appFrame = document.getElementById('app_frame');
    
        document.addEventListener('deviceready', _this.onDeviceReady, false);
    
        window.addEventListener('resize', _this.onResizeScreen);
    }
    
    this.onDeviceReady = function() {
        console.log('onDeviceReady called!');
    
        _this.refreshAppFrame();
        _this.initGoogleMap();
        _this.initLogoButton();
        // _this.refreshMapDiv();
    }
    
    this.onResizeScreen = function() {
        console.log('onResiseScreen called!');
        cordova.fireDocumentEvent('plugin_touch', {});
    
        if (resizeTimer !== false) {
            clearTimeout(resizeTimer);
        }
        var resizeTimer = setTimeout(function () {
            console.log('Window resized!');
            _this.refreshAppFrame();
            // _this.refreshMapDiv();
        }, 200);
    }
    
    this.refreshAppFrame = function() {
        // console.log('window.innerHeight: ' + window.innerHeight);
        appFrame.style.height = (window.innerHeight - 40) + 'px';
      
        console.log('appFrame.style.height: ' + appFrame.style.height);
        
    }
    
    this.initGoogleMap = function() {
    
        mapDiv = document.getElementById('map_div');

        var position = this.loadCameraPosition();

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
                    lat: position.target.lat,
                    lng: position.target.lng
                },
                'zoom' : position.zoom
            }
        }
    
        map = plugin.google.maps.Map.getMap(mapDiv, options);
        map.on(plugin.google.maps.event.CAMERA_MOVE_END, function() {
            // console.log('Camera move ended.')
            var cameraPosition = map.getCameraPosition();
            // console.log(JSON.stringify(cameraPosition.target));
            _this.saveCameraPosition(cameraPosition);
        });
    }
    
    // this.refreshMapDiv = function() {
    
    //     console.log('refreshMapDiv called!');
    
    //     mapDiv.style.height = (window.innerHeight - 40) + 'px';
    //     // mapDiv.style.width = window.innerWidth + 'px';
    //     // plugin.google.maps.Map.getMap(mapDiv);
    
    //     console.log('mapDiv.style.height: ' + mapDiv.style.height);
    //     // console.log('mapDiv.style.width: ' + mapDiv.style.width);

        
    // }

    this.saveCameraPosition = function (position) {
        var storage = window.localStorage;
        storage.setItem(LATITUDE, position.target.lat);
        storage.setItem(LONGTUDE, position.target.lng);
        storage.setItem(CAMERA_ZOOM, position.zoom);
    };

    this.loadCameraPosition = function () {
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
            target: {
                lat: lat,
                lng: lng
            },
            zoom: zoom
        };
    };

    this.initLogoButton = function () {
        console.log('initLogoButton called!')
        logoButton = document.getElementById('logo-button');
        logoButton.addEventListener('click', function(){
            console.log('Logo button clicked!');
        });
    };

}

new returnvisitor.mapPage().initialize();