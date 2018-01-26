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
        mapFrame,
        toolHeader,
        toolHeaderLogo,
        mapPaneBase,
        mapOverlay,
        controlFrame,
        drawerFrame,
        drawerSwipe,
        drawerHeader,
        pageTitle,
        AD_FRAME_HEIGHT = 50,
        WIDTH_BREAK_POINT = 500,
        DRAWER_WIDTH = 200,
        DRAWER_DURATION = 300,

        mapPane,
        recordVisitPane,
        _isDrawerOpen   = false,
        _isMapOverlaySet = false,
        _isControlShowing = false;
    
    function initFrames() {
        appFrame        = document.getElementById('app_frame');
        slideFrame      = document.getElementById('slide_frame');
        mapFrame        = document.getElementById('map_frame');
        mapPaneBase     = document.getElementById('map_pane_base');
        controlFrame    = document.getElementById('control_frame');
        adFrame         = document.getElementById('ad_frame');
        pageTitle       = document.getElementById('page_title');
    }

    function initDrawerFrame() {

        drawerFrame     = document.getElementById('drawer_frame');

        drawerSwipe = new Swipe(drawerFrame);
        drawerSwipe.onXSwipeEnd = function(stroke) {

            if (stroke < 0) {
                openCloseDrawer();
            } 
        };

        drawerSwipe.onXSwipe = function(stroke) {

            $(mapFrame).css({
                left : parseInt(mapFrame.style.left) + stroke
            });

            if (parseInt(mapFrame.style.left) > 0) {
                drawerSwipe.cancel();
            }
        };

        drawerSwipe.onSwipeCancel = function(){

            animateDrawer();
        };

    }

    // resize frames

    function resizeAppFrame() {

        appFrame.style.height = (window.innerHeight - AD_FRAME_HEIGHT) + 'px';
    }

    function resizeMapFrame() {

        var $mapFrame = $(mapFrame);

        if (isWideScreen()) {

            $mapFrame.css({
                width : window.innerWidth + DRAWER_WIDTH,
                left : 0
            });

        } else {

            $mapFrame.css({
                width : window.innerWidth + DRAWER_WIDTH,
                left : -DRAWER_WIDTH
            });
        }


    }

    function resizeMapPaneBase() {

        var $mapPaneBase = $(mapPaneBase);

        $mapPaneBase.css({
            width : window.innerWidth,
        });

        if (_isMapOverlaySet) {
            switchMapOverlay(false);
        }
    }
    
    function onDeviceReady() {
        // console.log('onDeviceReady called!');

        initFrames();
        initDrawerFrame();
        initMaOverlay();
        initToolHeaderLogo();
        initToolHeader();
        initDrawerHeader();

        resizeFrames();

        loadMapPaneFiles();
        
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
        resizeMapFrame();
        resizeMapPaneBase();

        drawerSwipe.swipeEnabled = !isWideScreen();
        fadeToolHeaderLogo(!isWideScreen(), false);

    }

    function isWideScreen() {
        return window.innerWidth > WIDTH_BREAK_POINT;
    }

    function loadMapPaneFiles() {

        loadFile.loadScript('./view_components/map_pane/map_pane.js', function(){

            mapPane = viewComponents.mapPane;
            mapPane.initialize(mapPaneBase);
            
            mapPane.onMapLongClick = function(latLng) {

            };

            mapPane.onClickMarker = function(place) {

            };

        });
    }

    function initMaOverlay() {

        mapOverlay = document.getElementById('map_overlay');
        mapOverlay.addEventListener('click', onClickMapOverlay);
    }

    function onClickMapOverlay() {

        openCloseDrawer();
    }

    function switchMapOverlay(set) {

        var $overlay = $(mapOverlay);

        if (set) {

            $overlay.css({
                width : '100%'
            });

        } else {

            $overlay.css({
                width : 0
            });

        }

        _isMapOverlaySet = set;
    }

    function initToolHeader() {

        toolHeader = document.getElementById('tool_header');
    }

    function initToolHeaderLogo() {

        toolHeaderLogo  = document.getElementById('tool_header_logo');
        toolHeaderLogo.addEventListener('click', onClickToolHeaderLogo);
    }

    function fadeToolHeaderLogo(fadeIn, animated) {

        var $logo = $(toolHeaderLogo);

        if (animated) {

            if (fadeIn) {

                $logo.css({ 
                    display : 'block',
                    opacity : 0
                });
                $logo.fadeTo(DRAWER_DURATION, 1);
    
            } else {
    
                $logo.fadeTo(DRAWER_DURATION, 0, function(){
                    $logo.css({ display : 'none' });                
                });
    
            }
        } else {

            if (fadeIn) {

                $logo.css({ 
                    display : 'block', 
                    opacity : 1
                });
    
            } else {
    
                $logo.css({ 
                    display : 'none',
                    opacity : 0 
                });   
    
            }
        }
    }

    function onClickToolHeaderLogo() {

        if (isWideScreen()) {
            return;
        }

        elementsEffect.blink(toolHeaderLogo);
        openCloseDrawer();
    }


    function initDrawerHeader() {

        drawerHeader = document.getElementById('drawer_header');
        drawerHeader.addEventListener('click', onClickDrawerHeader);

    }

    function onClickDrawerHeader() {

        if (isWideScreen()) {
            return;
        }

        elementsEffect.blink(drawerHeader);
        openCloseDrawer();
    }

    function openCloseDrawer() {

        _isDrawerOpen = !_isDrawerOpen;
        animateDrawer();
        switchMapOverlay(_isDrawerOpen);
    }

    function animateDrawer() {

        // But one animated is mapFrame
        var $mapFrame = $(mapFrame);

        if (_isDrawerOpen) {

            $mapFrame.animate({
                left : 0
            }, DRAWER_DURATION);

        } else {

            $mapFrame.animate({
                left : -DRAWER_WIDTH
            }, DRAWER_DURATION);

        }

        fadeToolHeaderLogo(!_isDrawerOpen, true);

    }


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


    document.addEventListener('deviceready', onDeviceReady, false);
    window.addEventListener('resize', onResizeScreen);

   
}());


