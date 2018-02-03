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

'use strict';

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.app = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        viewComponents = returnvisitor.viewComponents,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elementsEffect  = common.elementsEffect,
        Swipe           = common.Swipe,
        adFrame,
        appFrame,
        slideFrame,
        AD_FRAME_HEIGHT = 50,
        WIDTH_BREAK_POINT = 500,
        LAUNCH_DURATION = 300,
        launcher,
        mapPage,
        placePage,
        _isBrowserMapReady = false;

    function initFrames() {
        appFrame        = document.getElementById('app_frame');
        slideFrame      = document.getElementById('slide_frame');
        adFrame         = document.getElementById('ad_frame');
    }

    // resize frames

    function resizeAppFrame() {

        appFrame.style.height = (window.innerHeight - AD_FRAME_HEIGHT) + 'px';
    }
    
    function onDeviceReady() {
        
        document.addEventListener('backbutton', onClickBackButton, false);

        prepareBrowserMap();
        initFrames();

        resizeFrames();

        loadMapPageIfNeeded();
        
    }
    
    function onResizeScreen() {
        cordova.fireDocumentEvent('plugin_touch', {});
    
        if (cordova.platform === 'browser') {
            // ブラウザでは連続的に呼ばれるので
            if (resizeTimer !== false) {
                clearTimeout(resizeTimer);
            }

            var resizeTimer = setTimeout(resizeFrames, 200);

        } else {
            resizeFrames();
        }
    }
    
    function resizeFrames() {

        resizeAppFrame();

        if (mapPage) {
            mapPage.resizePage(isWideScreen());
        }

    }

    function isWideScreen() {
        return window.innerWidth > WIDTH_BREAK_POINT;
    }

    function prepareBrowserMap() {

        if (isBrowser()) {

            loadFile.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDmr4KjAGEvMjcmDdR7G6LdBIutoAAA2Yo&callback=RETURNVISITOR_APP.work.c_kogyo.returnvisitor.app.onBrowserMapReady');
        }
    }

    function _onBrowserMapReady() {
        _isBrowserMapReady = true;
    }

    function isBrowser() {
        return cordova.platformId === 'browser';
    } 

    function loadMapPageIfNeeded() {

        if (mapPage) {

            initMapPage();
        } else {

            loadFile.loadCss('./pages/map_page/map_page.css');
            loadFile.loadScript('./pages/map_page/map_page.js', function(){
    
                initMapPage();
            });
        }


    }

    function initMapPage() {

        mapPage = returnvisitor.mapPage;
        
        if (isBrowser()) {

            var wait = function() {
                if (_isBrowserMapReady) {
                    clearInterval(timerId);
                    doInitializeMapPage();
                }
            };

            var timerId = setInterval(wait, 20);

        } else {

            doInitializeMapPage();
        }
        
        function doInitializeMapPage() {

            mapPage.initialize(function(){

                launcher.launchUpPage(mapPage);
            }, isWideScreen());
    
            mapPage.onMapLongClick = function(latLng) {
    
                loadPlacePageFilesIfNeeded(latLng);
            };
        }
    }

    // function setInitialContent(content) {

    //     $(content).css({
    //         top : 0,
    //         left : 0,
    //         height : '50%'
    //     });
    //     slideFrame.appendChild(content);
    // }

    // function launchNextContent(content, oldContent, callback) {

    //     var $new = $(content);
    //     $new.css({
    //         top : '50%',
    //         left : 0,
    //         height : '50%'

    //     });
    //     slideFrame.appendChild(content);

    //     var $slide = $(slideFrame);
    //     $slide.animate({
    //         top : '-100%'
    //     }, LAUNCH_DURATION, function(){

    //         if (oldContent) {
    //             slideFrame.removeChild(oldContent);
    //         }

    //         $slide.css({
    //             top : 0
    //         });
    //         $new.css({
    //             top : 0
    //         });

    //         if ( typeof callback === 'function' ) {
    //             callback();
    //         }
    //     });
    // }

    function loadPlacePageFilesIfNeeded(latlng) {

        if (placePage) {
            
            initPlacePage(latlng);

        } else {

            loadFile.loadScript('./pages/place_page/place_page.js', function(){
                initPlacePage(latlng);
            });
        }
    }

    function initPlacePage(latLng) {

        placePage = returnvisitor.placePage;
    
        var pageOptions = {
            latLng : {
                lat : latLng.lat,
                lng : latLng.lng
            },
            zoom : mapPage.mapZoomLevel
        };
        placePage.initialize(function(){

            launcher.launchUpPage(placePage, function() {
                placePage.fireMapReloadIfNeeded();
            });
        }, pageOptions);

        placePage.onCancelClick = function() {

            launcher.launchDownPage();
        };

        placePage.onFinishRecordVisit = function(place) {

            launcher.launchDownPage(function(){
                mapPage.addNewPlaceMarker(place);
            });
        };
    }

    launcher = (function(){

        var pageStack = [];

        function _launchUpPage(page, callback) {

            pageStack.unshift(page);

            if (pageStack.length <= 1) {

                setInitialPage(page);

            } else {

                launchNextPage(page, callback);
            }
        }

        function setInitialPage(page) {

            $(page.pageFrame).css({
                top : 0,
                left : 0,
                height : '50%'
            });
            slideFrame.appendChild(page.pageFrame);
        }

        function launchNextPage(page, callback) {

            var frame = page.pageFrame;
            var $frame = $(frame);
            $frame.css({
                top : '50%',
                left : 0,
                height : '50%'
    
            });
            slideFrame.appendChild(frame);
    
            var $slide = $(slideFrame);
            $slide.animate({
                top : '-100%'
            }, LAUNCH_DURATION, function(){
    
                slideFrame.removeChild(slideFrame.firstChild);
    
                $slide.css({
                    top : 0
                });
                $frame.css({
                    top : 0
                });
    
                if ( typeof callback === 'function' ) {
                    callback();
                }
            });
        }
    
        function _launchDownPage(postLaunchFunc) {

            var currentPage = pageStack.shift();

            if ( pageStack.length <= 0 ) {
                navigator.Backbutton.goBack();
            } else {


                var $slide = $(slideFrame);

                $slide.css({
                    top : '-100%'
                });

                $(currentPage.pageFrame).css({
                    top : '-50%'
                });

                var nextPage = pageStack[0];

                if (nextPage === mapPage) {
                    mapPage.onRelaunch();
                }
                var nextFrame = nextPage.pageFrame;

                var $next = $(nextFrame);
                $next.css({
                    top : 0
                });

                slideFrame.appendChild(nextFrame);

                $slide.animate({
                    top : 0
                }, LAUNCH_DURATION, function(){
                    
                    slideFrame.removeChild(slideFrame.firstChild);

                    if (typeof postLaunchFunc === 'function') {
                        postLaunchFunc();
                    }    

                });

            }
        }

        return {
            launchUpPage : _launchUpPage,
            launchDownPage : _launchDownPage,
            pageStack : pageStack
        };
    })();
 
    // function loadRecordVisitPageFiles(options, postFadeInCallback) {
    //     loadFile.loadCss('./record_visit_page/record_visit_page.css');
    //     loadFile.appendHtmlToAppFrame('./record_visit_page/record_visit_page.html', function() {
    //         loadFile.loadScript('./record_visit_page/record_visit_page.js', function() {
    //             recordVisitPage = returnvisitor.recordVisitPage;
    //             recordVisitPage.initialize(options, postFadeInCallback);
    //             recordVisitPage.onOkClicked = function(_place) {
    //                 mapPage.onFinishEditVisit(_place);
    //             };
    //             recordVisitPage.beforeFadeOutPage = function() {
    //                 mapPage.hideFrame(false);
    //             };
    //         });
    //     }, 0);
    // }

    // function onNewPlaceVisit(latLng) {

    //     var options = {
    //         method: 'NEW_PLACE_VISIT',
    //         latLng: {
    //             lat: latLng.lat,
    //             lng: latLng.lng
    //         }
    //     };

    //     var postFadeInRVPage = function() {
    //         mapPage.hideFrame(true);
    //     };

    //     if (recordVisitPage) {
    //         recordVisitPage.initialize(options, postFadeInRVPage);
    //     } else {
    //         loadRecordVisitPageFiles(options, postFadeInRVPage);
    //     }
    // }

    //test
    // function testPersonDialog() {
    //     loadFile.loadScript('./dialogs/dialog_base/dialog_base.js', function(){
    //         loadPersonDialogScript();
    //     });
    // }

    // function loadPersonDialogScript() {
    //     loadFile.loadScript('./dialogs/person_dialog/person_dialog.js', function(){
    //         var newPersonDialog = new returnvisitor.PersonDialog();
    //     });
    // }

    function onClickBackButton() {
       
        launcher.launchDownPage();
    }

    document.addEventListener('deviceready', onDeviceReady, false);
    
    window.addEventListener('resize', onResizeScreen);

    return {
        onBrowserMapReady : _onBrowserMapReady,
        get isBrowserMapReady() {
            return _isBrowserMapReady;
        }

    };
   
}());


