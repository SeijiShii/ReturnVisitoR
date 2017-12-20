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

var returnvisitor = RETURNVISITOR_APP.namespace('work.c_kogyo.returnvisitor'); 
// var mapPage = RETURNVISITOR_APP.namespace('work.c_kogyo.returnvisitor.mapPage');
returnvisitor.mapPage = function() {

    var _this = this,
        mapFrame,
        mapDiv,
        map;

    this.initialize = function() {

        console.log('mapPage.initialize called!');
    
        mapFrame = document.getElementById('map_frame');
    
        document.addEventListener('deviceready', _this.onDeviceReady, false);
    
        window.addEventListener('resize', _this.onResizeScreen);
    }
    
    this.onDeviceReady = function() {
        console.log('onDeviceReady called!');
    
        _this.refreshMapFrame();
        _this.initGoogleMap();
        _this.refreshMapDiv();
    }
    
    this.onResizeScreen = function() {
        console.log('onResiseScreen called!');
        cordova.fireDocumentEvent('plugin_touch', {});
    
        if (resizeTimer !== false) {
            clearTimeout(resizeTimer);
        }
        var resizeTimer = setTimeout(function () {
            console.log('Window resized!');
            _this.refreshMapFrame();
            _this.refreshMapDiv();
        }, 200);
    }
    
    this.refreshMapFrame = function() {
        // console.log('window.innerHeight: ' + window.innerHeight);
        mapFrame.style.height = (window.innerHeight - 40) + 'px';
        // mapFrame.style.width = window.innerWidth + 'px';

        console.log('mapFrame.style.height: ' + mapFrame.style.height);
        // console.log('mapFrame.style.width: ' + mapFrame.style.width);
        
    }
    
    this.initGoogleMap = function() {
    
        mapDiv = document.getElementById('map_div');

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
    
        map = plugin.google.maps.Map.getMap(mapDiv, options);
    }
    
    this.refreshMapDiv = function() {
    
        console.log('refreshMapDiv called!');
    
        mapDiv.style.height = (window.innerHeight - 40) + 'px';
        // mapDiv.style.width = window.innerWidth + 'px';
        // plugin.google.maps.Map.getMap(mapDiv);
    
        console.log('mapDiv.style.height: ' + mapDiv.style.height);
        // console.log('mapDiv.style.width: ' + mapDiv.style.width);

        
    }
}

new returnvisitor.mapPage().initialize();