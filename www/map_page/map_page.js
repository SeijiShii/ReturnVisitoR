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

}

returnvisitor.mapPage.prototype.initialize = function() {

    console.log('mapPage.initialize called!');

    this.mapFrame = document.getElementById('map_frame');

    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

    window.addEventListener('resize', this.onResizeScreen.bind(this));
}

returnvisitor.mapPage.prototype.onDeviceReady = function() {
    console.log('onDeviceReady called!');

    // thisが変化してしまうのでcallで関数をよびだす。
    this.refreshMapFrame.call(this);
    this.initGoogleMap();
}

returnvisitor.mapPage.prototype.onResizeScreen = function() {
    console.log('onResiseScreen called!');

    // ホントにもうthisがコロコロ変わるの何とかならんかね！
    var self = this;

    if (resizeTimer !== false) {
        clearTimeout(resizeTimer);
    }
    var resizeTimer = setTimeout(function () {
        console.log('Window resized!');
        // this.refreshContentHeight();
        self.refreshMapFrame();
    }, 200);
}

returnvisitor.mapPage.prototype.refreshMapFrame = function() {
    console.log('window.innerHeight: ' + window.innerHeight);
    this.mapFrame.style.height = (window.innerHeight - 40) + 'px';
    
}

returnvisitor.mapPage.prototype.initGoogleMap = function() {
    this.mapCanvas = document.getElementById('map_canvas');

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

    this.map = plugin.google.maps.Map.getMap(this.mapCanvas, options);
}

returnvisitor.mapPage.prototype.refreshMapCanvas = function() {

}

new returnvisitor.mapPage().initialize();