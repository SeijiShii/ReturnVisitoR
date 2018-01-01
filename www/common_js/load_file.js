/**
 * @returns file element
 */

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile = (function(){

    return {
        loadHtmlToAppFrame: function(filePath, success) {
            $('#app_frame').load(filePath, function(){
                    
                if (typeof success === 'function') {
                    success();
                }
            });
        },

        loadCss: function(id, filePath) {
            // すでにロードされているlinkタグであればキャンセルする。
            var scriptTags = document.getElementsByTagName('head')[0].getElementsByTagName('link');
            for (var i = 0 ; i < scriptTags.length ; i++) {
                if (scriptTags[i].id === id) {
                    return;
                }
            }
            var fileElement = document.createElement('link');
            fileElement.setAttribute('rel', 'stylesheet');
            fileElement.setAttribute('type', 'text/css');
            fileElement.setAttribute('href', filePath);
            fileElement.setAttribute('id', id);

            document.getElementsByTagName('head')[0].appendChild(fileElement);
        },

        loadScript: function(filePath, success) {
            $.getScript(filePath, success);
        }
    } 
})();