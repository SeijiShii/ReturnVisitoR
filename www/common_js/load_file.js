/**
 */

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile = (function(){

    return {
        appendHtmlToAppFrame: function(filePath, callback) {

            $.get(filePath, function(data){
                // console.log(data);

                var node = document.createElement('div');
                node.innerHTML = data;

                var pageFrame = node.getElementsByTagName('div')[0];

                document.getElementById('app_frame').appendChild(pageFrame);

                if (typeof callback === 'function') {
                    callback();
                }

            });

        },

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
                console.log(filePath + ' is loaded!');
                callback();
            }
            document.body.appendChild(script);
           
        }
    } 
})();