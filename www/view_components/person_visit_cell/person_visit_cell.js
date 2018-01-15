"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.PersonVisitCell = function(personVisit) {

    if (personVisit === undefined) {
        throw new Error('Argument person must not be undefined!');
    }

    var _this = this,
        cellFrame,
        midColumn,
        switchBox,
        _isFrameReady = false,
        returnvisitor   = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile        = returnvisitor.common.loadFile,
        elements        = returnvisitor.common.elements,
        // markerPaths     = returnvisitor.common.markerPaths,
        raterColors     = returnvisitor.common.raterColors,
        Person          = returnvisitor.data.Person,
        viewComponents  = returnvisitor.viewComponents,
        SwitchView      = viewComponents.SwitchView,
        SmallSquareButton = viewComponents.SmallSquareButton,
        EXTRACTED_HEIGHT = '80px';
    
    
    function initialize() {
        loadFile.loadCss('./view_components/person_visit_cell/person_visit_cell.css');
        loadFile.loadHtmlAsElement('./view_components/person_visit_cell/person_visit_cell.html', function(div){
            cellFrame = div;

            initButtonMark();
            initPersonData();
            initRVSwitch();
            initStudySwitch();
            initEditButton();
            initRemoveButton();

            _isFrameReady = true;

        });
    }


    function initButtonMark() {

        var mark = elements.getElementByClassName(cellFrame, 'button_mark');

        // var pathArray = Object.values(markerPaths.buttonMarkerPaths);
        mark.style.backgroundColor = raterColors.interestColors[Person.interest.indexOfKey(personVisit.interest)];
    }


    function initPersonData() {
         
        var personData = elements.getElementByClassName(cellFrame, 'person_data');
        personData.innerText = personVisit.personData;

    }

    function initRVSwitch() {
        var rvSwitchBase = elements.getElementByClassName(cellFrame, 'rv_switch_base');
        var rvSwitch = new SwitchView(rvSwitchBase, 'Return Visit', false);
    }

    function initStudySwitch() {
        var studySwitchBase = elements.getElementByClassName(cellFrame, 'study_switch_base');
        var stSwitch = new SwitchView(studySwitchBase, 'Study', false);
    }

    function initEditButton() {
        var editButtonBase = elements.getElementByClassName(cellFrame, 'edit_button_base');
        
        var editButton = new SmallSquareButton(editButtonBase, './view_components/edit_button/edit_button.html', './view_components/edit_button/edit_button.css');
    }

    function initRemoveButton() {
        var removeButtonBase = elements.getElementByClassName(cellFrame, 'remove_button_base');

        var removeButton = new SmallSquareButton(removeButtonBase, './view_components/minus_button/minus_button.html', './view_components/minus_button/minus_button.css');

        removeButton.onClickButton = onClickRemoveButton;
    }

    function onClickRemoveButton() {
        $(cellFrame).animate({
            height : 0
        }, 300, function(){
            cellFrame.parentNode.removeChild(cellFrame);
            
            if ( typeof _this.onRemoveCell === 'function' ) {
                _this.onRemoveCell();
            }

            _this = null;
        });
    }

    function _appendTo(parent) {
        parent.appendChild(cellFrame);

        if ( typeof _this.appendCallback === 'function' ) {
            _this.appendCallback();
        }
    }

    function _appendAndExtract(parent) {

        cellFrame.style.height = 0;

        parent.appendChild(cellFrame);

        $(cellFrame).animate({
            height : EXTRACTED_HEIGHT
        }, 300);
    }

    function waitAppendUntilReady(appendFunc, parent) {
        
        var timer = function() {

            if (_isFrameReady) {
                clearInterval(timerId);
                appendFunc(parent);
            } else {
                console.log('Wait for person visit cell ready.');
            }
        }
        var timerId = setInterval(timer, 50);
    }
   
    this.appendTo = function(parent) {
        waitAppendUntilReady(_appendTo, parent);
    }

    this.appendAndExtract = function(parent) {
        waitAppendUntilReady(_appendAndExtract, parent);
    }

    initialize();
}





