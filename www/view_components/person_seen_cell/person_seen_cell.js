"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.PersonSeenCell = function(parent, person) {

    var _this = this,
        cellFrame,
        midColumn,
        switchBox,
        returnvisitor   = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile        = returnvisitor.common.loadFile,
        elements        = returnvisitor.common.elements,
        markerPaths     = returnvisitor.common.markerPaths,
        viewComponents  = returnvisitor.viewComponents,
        SwitchView      = viewComponents.SwitchView,
        SmallSquareButton = viewComponents.SmallSquareButton;
    
    
    function initialize() {
        loadFile.loadCss('./view_components/person_seen_cell/person_seen_cell.css');
        loadFile.loadHtmlAsElement('./view_components/person_seen_cell/person_seen_cell.html', function(div){
            cellFrame = div;

            initButtonMark();
            initPersonData();
            initRVSwitch();
            initStudySwitch();
            initEditButton();
            initRemoveButton();

            parent.appendChild(cellFrame);

        });
    }


    function initButtonMark() {

        var mark = elements.getElementByClassName(cellFrame, 'button_mark');

        // mark.src = markerPaths.buttonMarkerPaths[Person.interest.indexOfKey(person.interest)];
        mark.src = markerPaths.buttonMarkerPaths.orangeButton;
    }


    function initPersonData() {
         
        var personData = elements.getElementByClassName(cellFrame, 'person_data');
        // personData.innerText = person.data;

    }

    function initRVSwitch() {
        var rvSwitchBase = elements.getElementByClassName(cellFrame, 'rv_switch_base');
        var rvSwitch = new SwitchView(rvSwitchBase, 'Return Visit');
    }

    function initStudySwitch() {
        var studySwitchBase = elements.getElementByClassName(cellFrame, 'study_switch_base');
        var stSwitch = new SwitchView(studySwitchBase, 'Study');
    }

    function initEditButton() {
        var editButtonBase = elements.getElementByClassName(cellFrame, 'edit_button_base');
        
        var editButton = new SmallSquareButton(editButtonBase, './view_components/edit_button/edit_button.html', './view_components/edit_button/edit_button.css');
    }

    function initRemoveButton() {
        var removeButtonBase = elements.getElementByClassName(cellFrame, 'remove_button_base');

        var removeButton = new SmallSquareButton(removeButtonBase, './view_components/minus_button/minus_button.html', './view_components/minus_button/minus_button.css');
    }
   
    initialize();
}





