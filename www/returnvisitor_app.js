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

"use strict"

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.app = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        adFrame,
        appFrame,
        AD_FRAME_HEIGHT = 50,
        WIDTH_BREAK_POINT = 500,
        DRAWER_WIDTH = 240,
        loadFile = returnvisitor.common.loadFile,
        mapPage,
        recordVisitPage;
    
    function initAppFrame() {
        appFrame = document.getElementById('app_frame');
    }

    function refreshAppFrame() {
        appFrame.style.height = (window.innerHeight - AD_FRAME_HEIGHT) + 'px';        
    }    

    
    function initAdFrame() {
        adFrame = document.getElementById('ad_frame');
    }

    function refreshAdFrame() {
        adFrame.style.top = (window.innerHeight - AD_FRAME_HEIGHT) + 'px';
    }


    function onDeviceReady() {
        // console.log('onDeviceReady called!');
    
        initAdFrame();
        refreshAdFrame();

        initAppFrame();
        refreshAppFrame();

        loadMapPageFiles();
    }
    
    function onResizeScreen() {
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

        if (mapPage !== undefined) {
            mapPage.refreshElements(isWideScreen(), true);
        } 
    }

    function isWideScreen() {
        return window.innerWidth > WIDTH_BREAK_POINT;
    }

    function loadMapPageFiles() {

        loadFile.loadCss('./map_page/map_page.css');
        loadFile.appendHtmlToAppFrame('./map_page/map_page.html', function(){
            loadFile.loadScript('./map_page/map_page.js', function() {
                mapPage = returnvisitor.mapPage;
                mapPage.refreshElements(isWideScreen(), false);
                mapPage.setNewPlaceVisitCallback(onNewPlaceVisit);

            });
        });

    }

    function loadRecordVisitPageFiles(options) {
        loadFile.loadCss('./record_visit_page/record_visit_page.css');
        loadFile.appendHtmlToAppFrame('./record_visit_page/record_visit_page.html', function() {
            loadFile.loadScript('./record_visit_page/record_visit_page.js', function() {
                recordVisitPage = returnvisitor.recordVisitPage;
                recordVisitPage.setOptions(options);
            });
        });
    }

    function onNewPlaceVisit(latLng) {
        loadRecordVisitPageFiles({
            method: 'NEW_PLACE_VISIT',
            latLng: {
                lat: latLng.lat,
                lng: latLng.lng
            }
        });
    }

    document.addEventListener('deviceready', onDeviceReady, false);
    window.addEventListener('resize', onResizeScreen);

}());