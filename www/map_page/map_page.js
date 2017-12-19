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

var mapPage = RETURNVISITOR_APP.namespace('work.c_kogyo.returnvisitor.mapPage');

mapPage.initialize = function() {

    console.log('mapPage.initialize called!');

    mapPage.mapFrame = document.getElementById('map_frame');

    document.addEventListener('deviceready', mapPage.onDeviceReady, false);

    window.addEventListener('resize', mapPage.onResizeScreen);
}

mapPage.onDeviceReady = function() {
    console.log('onDeviceReady called!');
    mapPage.refreshMapFrame();
    mapPage.initGoogleMap();
}

mapPage.onResizeScreen = function() {
    console.log('onResiseScreen called!');
    if (resizeTimer !== false) {
        clearTimeout(resizeTimer);
    }
    var resizeTimer = setTimeout(function () {
        console.log('Window resized!');
        // this.refreshContentHeight();
        mapPage.refreshMapFrame();
    }, 200);
}

mapPage.refreshMapFrame = function() {
    console.log('window.innerHeight: ' + window.innerHeight);
    mapPage.mapFrame.style.height = (window.innerHeight - 40) + 'px';
    
}

mapPage.initGoogleMap = function() {
    mapPage.mapCanvas = document.getElementById('map_canvas');
    mapPage.map = plugin.google.maps.Map.getMap(mapPage.mapCanvas);
}

mapPage.initialize();