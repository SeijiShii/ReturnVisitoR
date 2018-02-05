'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.visitRecordPane = (function(){

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        _primaryFrame,
        _secondaryFrame,
        _place;
    
    loadFile.loadCss('./view_components/visit_record_pane.css');
    loadFile.loadHtmlAsElement('./view_components/visit_record_pane_primary.html', function(elm){
        _primaryFrame = elm;
    });
    
    function _initialize(place) {

        _place = place;

    }

    return {

    };
});