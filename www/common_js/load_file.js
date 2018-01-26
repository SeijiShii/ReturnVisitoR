"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile = (function(){

    var htmlCache = {};

    function _htmlToElement(html, callback, className) {

        var node = document.createElement('div');
        node.innerHTML = html;
        var elm = node.getElementsByTagName('div')[0];

        if (className) {
            elm.classList.add(className);
        }

        if (typeof callback === 'function') {
            callback(elm);
        }
    }

    return {
        /**
         * @param callback callback has 1 param which returns div element made from html file.
         */
        loadHtmlAsElement: function(filePath, callback, className) {

            if (htmlCache[filePath] === undefined) {
                $.get(filePath, function(data){
                    // console.log(data);

                    htmlCache[filePath] = data;

                    _htmlToElement(data, callback, className);

                });
            } else {

                _htmlToElement(htmlCache[filePath], callback, className);
            }
        },

        // appendHtmlToAppFrame: function(filePath, callback, opacity) {

        //     this.loadHtmlAsElement(filePath, function(divElem) {

        //         if (opacity !== undefined) {
        //             divElem.style.opacity = opacity;
        //         }

        //         document.getElementById('app_frame').appendChild(divElem);

        //         if (typeof callback === 'function') {
        //             callback();
        //         }
        //     });
        // },

        loadCss: function(filePath) {
            // すでにロードされているlink pathであればキャンセルする。
            var linkTags = document.getElementsByTagName('head')[0].getElementsByTagName('link');
            for (var i = 0 ; i < linkTags.length ; i++) {
                if (linkTags[i].href === filePath) {
                    return;
                }
            }
            var fileElement = document.createElement('link');
            fileElement.setAttribute('rel', 'stylesheet');
            fileElement.setAttribute('type', 'text/css');
            fileElement.setAttribute('href', filePath);

            document.getElementsByTagName('head')[0].appendChild(fileElement);
        },

        loadScript: function(filePath, callback) {

            // $.getScript(filePath, callback);

            // すでにロードされているfilePathであればキャンセルする。
            var scriptTags = document.body.getElementsByTagName('script');
            for (var i = 0 ; i < scriptTags.length ; i++) {
                if (scriptTags[i].src === filePath) {
                    return;
                }
            }

            var script = document.createElement('script');
            script.src = filePath;
            script.onload = function() {
                // console.log(filePath + ' is loaded!');

                if (typeof callback === 'function') {
                    callback();
                }
            };

            document.body.appendChild(script);
           
        }
    } 
})();