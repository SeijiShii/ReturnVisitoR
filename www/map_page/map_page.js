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
// 171222 TODO 幅広画面の時、ドロワーのメニューが常時表示されるようにする。

var returnvisitor = RETURNVISITOR_APP.namespace('work.c_kogyo.returnvisitor'); 
// var MapPage = RETURNVISITOR_APP.namespace('work.c_kogyo.returnvisitor.MapPage');
returnvisitor.MapPage = function() {

    var _this = this,
        adFrame,
        appFrame,
        mapDiv,
        map,
        logoButton,
        drawerOverlay,
        isDrawerOverlayShowing = false,
        drawer,
        drawerSwipeStartX,
        drawerSwipeMoveX,
        drawerLogoButton,
        AD_FRAME_HEIGHT = 50,
        WIDTH_BREAK_POINT = 500,
        DRAWER_WIDTH = 240,
        DRAWER_DURATION = 300,
        LOGO_BUTTON_SIZE = '40px',
        LATITUDE = 'latitude',
        LONGTUDE = 'longitude',
        CAMERA_ZOOM = 'camera_zoom';

    this.initialize = function() {

        // console.log('MapPage.initialize called!');
    
        appFrame = document.getElementById('app_frame');
    
        document.addEventListener('deviceready', _this.onDeviceReady, false);
    
        window.addEventListener('resize', _this.onResizeScreen);
    }
    
    this.onDeviceReady = function() {
        // console.log('onDeviceReady called!');
    
        _this.initAdFrame();
        _this.refreshAdFrame();

        _this.refreshAppFrame();
        _this.initGoogleMap();
        _this.refreshMapDiv();

        _this.initLogoButton();
        _this.refreshLogoButton(false);

        _this.initDrawerOverlay();
        _this.refreshDrawerOverlay();
        _this.initDrawer();
        _this.refreshDrawer();

        _this.initDrawerLogoButton();

    }
    
    this.onResizeScreen = function() {
        // console.log('onResiseScreen called!');
        cordova.fireDocumentEvent('plugin_touch', {});
    
        if (cordova.platform === 'browser') {
            // ブラウザでは連続的に呼ばれるので
            if (resizeTimer !== false) {
                clearTimeout(resizeTimer);
            }

            var resizeTimer = setTimeout(function () {
                _this.refreshScreenElements();
            }, 200);

        } else {
            _this.refreshScreenElements();
        }
    }
    
    this.refreshScreenElements = function() {
        _this.refreshAppFrame();
        _this.refreshAdFrame();
        _this.refreshMapDiv();
        _this.refreshDrawer();
        _this.refreshDrawerOverlay();
        _this.refreshLogoButton(true);
        _this.refreshDrawerLogoButton();
    }

    this.refreshAppFrame = function() {
        // console.log('window.innerHeight: ' + window.innerHeight);
        appFrame.style.height = (window.innerHeight - AD_FRAME_HEIGHT) + 'px';
      
        // console.log('appFrame.style.height: ' + appFrame.style.height);
        
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

    this.refreshMapDiv = function() {

        // console.log('refreshMapDiv called!');
        // console.log('isWideScreen: ' + this.isWideScreen());

        if (_this.isWideScreen()) {
            mapDiv.style.left = DRAWER_WIDTH + 'px';
            mapDiv.style.width = (window.innerWidth - DRAWER_WIDTH) + 'px';

            console.log('mapDiv.style.left: ' + mapDiv.style.left);

        } else {
            mapDiv.style.left = 0;
            mapDiv.style.width = window.innerWidth + 'px';
        }
    }
    
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
        // console.log('initLogoButton called!')
        logoButton = document.getElementById('logo_button');
        logoButton.addEventListener('click', function(){
            // console.log('Logo button clicked!');
            _this.fadeDrawerOverlay(true, true);
            _this.openCloseDrawer(true, true);
        });
    };

    this.refreshLogoButton = function(animated) {
        if (this.isWideScreen()) {
            if (animated) {
                $(logoButton).fadeTo(DRAWER_DURATION, 0, function(){
                    logoButton.style.width = 0;
                });   
            } else {
                logoButton.style.opacity = 0;
                logoButton.style.width = 0;
            }
        } else {
            logoButton.style.width = LOGO_BUTTON_SIZE;
            if (animated) {
                $(logoButton).fadeTo(DRAWER_DURATION, 1);
            } else {
                logoButton.style.opacity = 1;
            }
        }
    }

    this.initAdFrame = function() {
        adFrame = document.getElementById('ad_frame');
    }

    this.refreshAdFrame = function() {
        adFrame.style.top = (window.innerHeight - AD_FRAME_HEIGHT) + 'px';
    }

    // ドロワーオーバレイ関連
    this.initDrawerOverlay = function() {
        drawerOverlay = document.getElementById('drawer_overlay');   
        this.fadeDrawerOverlay(false, false);
    }

    this.refreshDrawerOverlay = function() {
        if (this.isWideScreen()) {
            drawerOverlay.removeEventListener('click', this.onClickDrawerOverlay);
        } else {
            drawerOverlay.addEventListener('click', this.onClickDrawerOverlay);  
        }

        if (isDrawerOverlayShowing) {
            this.fadeDrawerOverlay(false, true);
        } 
    }

    this.onClickDrawerOverlay = function() {
        _this.fadeDrawerOverlay(false, true);
        _this.openCloseDrawer(false, true);
    }

    this.fadeDrawerOverlay = function(fadeIn, animated) {

        // console.log('fadeDrawerOverlay called! fadeIn: ' + fadeIn + ', animated: ' + animated);

        if (animated) {
            if (fadeIn) {
                drawerOverlay.style.width = '100%';
                $(drawerOverlay).fadeTo(DRAWER_DURATION, 1);
                isDrawerOverlayShowing = true;
            } else {
                $(drawerOverlay).fadeTo(DRAWER_DURATION, 0, function(){
                    drawerOverlay.style.width = 0;
                    isDrawerOverlayShowing = false;    
                });
            }
        } else {
            if (fadeIn) {
                drawerOverlay.style.width = '100%';
                drawerOverlay.style.opacity = 1;
                isDrawerOverlayShowing = true;
            } else {
                drawerOverlay.style.opacity = 0;
                drawerOverlay.style.width = 0;
                isDrawerOverlayShowing = false;
            }
        }
    } 

    // ドロワー関連
    this.initDrawer = function() {
        drawer = document.getElementById('drawer');
        _this.openCloseDrawer(false, false);

        drawer.addEventListener('touchstart',function(event){
            // これをすると子要素のクリックイベントが発火しなくなる。
            // event.preventDefault();
            drawerSwipeStartX = event.touches[0].pageX;
            drawerSwipeMoveX = event.touches[0].pageX;
            // console.log('Drawer touch start! x: ' + drawerSwipeStartX);
        }, false);

        drawer.addEventListener('touchmove', function() {
            // これがないとtouchendイベントが発火しない。
            event.preventDefault();
            drawerSwipeMoveX = event.touches[0].pageX;
            // console.log('Drawer touch move! x: ' + drawerSwipeMoveX);
        }, false);

        drawer.addEventListener('touchend', function(event){

            // console.log('Drawer swipe end! x: ' + drawerSwipeMoveX);
            if ((drawerSwipeMoveX + 50) < drawerSwipeStartX) {
                _this.openCloseDrawer(false, true);
                _this.fadeDrawerOverlay(false,true);
            }
        }, false);
    }

    this.openCloseDrawer = function(open, animated) {

        if (this.isWideScreen()) {
            return;
        }

        if (animated) {
            if (open) {
                $(drawer).animate({'left' : '0px'}, DRAWER_DURATION);
            } else {
                $(drawer).animate({'left' : '-' + DRAWER_WIDTH + 'px'}, DRAWER_DURATION);
            }

        } else {
            if (open) {
                drawer.style.left = 0;
            } else {
                drawer.style.left = '-' + DRAWER_WIDTH + 'px';
            }
        }

    }

    this.refreshDrawer = function() {
        
        if (this.isWideScreen()) {
            drawer.style.left = 0;
        } else {
            drawer.style.left = '-' + DRAWER_WIDTH + 'px';
        }
    }

    // ドロワー上のロゴボタン
    this.initDrawerLogoButton = function() {

        // console.log('initDrawerLogoButton called!')

        drawerLogoButton = document.getElementById('drawer_logo_button');
        this.refreshDrawerLogoButton();
        
    }

    this.onDrawerLogoClick = function() {
         // console.log('Drawer logo button clicked!');
         _this.openCloseDrawer(false, true);
         _this.fadeDrawerOverlay(false, true);
    }

    this.refreshDrawerLogoButton = function() {
        if (this.isWideScreen()) {
            drawerLogoButton.removeEventListener('click', this.onDrawerLogoClick);
        } else {
            drawerLogoButton.addEventListener('click', this.onDrawerLogoClick);
        }
    }

    this.isWideScreen = function() {
        return window.innerWidth > WIDTH_BREAK_POINT;
    }


}

new returnvisitor.MapPage().initialize();