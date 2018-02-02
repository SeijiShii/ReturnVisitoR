'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.PlacementCell = function(parent, placement) {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements, 
        // elementsEffect  = common.elementsEffect,
        viewComponents  = returnvisitor.viewComponents,
        SmallSquareButton = viewComponents.SmallSquareButton,
        cellFrame,
        _placement = placement,
        _this = this;


    function initialize(){

        loadFile.loadCss('./view_components/placement_cell/placement_cell.css');
        loadFile.loadHtmlAsElement('./view_components/placement_cell/placement_cell.html', function(elm){

            cellFrame = elm;
            cellFrame.style.height = 0;

            initPlcData();
            initRemoveButton();

            parent.appendChild(elm);
            extract();
        });
    }

    function initPlcData() {
        var plcDataText = elements.getElementByClassName(cellFrame, 'placement_data');
        plcDataText.innerText = placement.publication.data;
    }

    function initRemoveButton() {

        var removeButtonBase = elements.getElementByClassName(cellFrame, 'remove_button_base');

        var removeButton = new SmallSquareButton(removeButtonBase, './view_components/minus_button/minus_button.html', './view_components/minus_button/minus_button.css');

        removeButton.onClickButton = onClickRemoveButton;
    }

    function onClickRemoveButton() {
        collapse();
    }

    function extract() {
        $(cellFrame).animate({
            height : 41
        }, 300);
    }

    function collapse() {

        $(cellFrame).animate({
            height : 0
        }, 300, function(){

            cellFrame.parentNode.removeChild(cellFrame);

            if (typeof _this.postCollapseCell === 'function' ) {
                _this.postCollapseCell(_placement);
            }
        });
    }

    initialize();
};