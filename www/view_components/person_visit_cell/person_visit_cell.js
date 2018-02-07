'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.PersonVisitCell = function(personVisit, parent, animated) {

    if (personVisit === undefined) {
        throw new Error('Argument person must not be undefined!');
    }

    var _this = this,
        _personVisit = personVisit,
        cellFrame,
        // midColumn,
        // switchBox,
        // _isFrameReady = false,
        returnvisitor   = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements,
        raterColors     = common.raterColors,
        waiter          = common.waiter,
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

            // _isFrameReady = true;
            parent.appendChild(cellFrame);
            
            if (animated) {
                extractFrom0();
            }

        });
    }


    function initButtonMark() {

        var mark = elements.getElementByClassName(cellFrame, 'button_mark');

        mark.style.backgroundColor = raterColors.interestColors[Person.interest.indexOfKey(personVisit.person.interest)];
    }


    function initPersonData() {
         
        var personData = elements.getElementByClassName(cellFrame, 'person_data');
        personData.innerText = personVisit.person.data;

    }

    function initRVSwitch() {
        var rvSwitchBase = elements.getElementByClassName(cellFrame, 'rv_switch_base');
        var rvSwitch = new SwitchView(rvSwitchBase, 'Return Visit', _personVisit.isRV);
    }

    function initStudySwitch() {
        var studySwitchBase = elements.getElementByClassName(cellFrame, 'study_switch_base');
        var stSwitch = new SwitchView(studySwitchBase, 'Study', _personVisit.isStudy);
    }

    function initEditButton() {
        var editButtonBase = elements.getElementByClassName(cellFrame, 'edit_button_base');
        
        var editButton = new SmallSquareButton(editButtonBase, './view_components/edit_button/edit_button.html', './view_components/edit_button/edit_button.css');

        // editButton.onClickButton = onClickEditButton;
    }

    function initRemoveButton() {
        var removeButtonBase = elements.getElementByClassName(cellFrame, 'remove_button_base');

        var removeButton = new SmallSquareButton(removeButtonBase, './view_components/minus_button/minus_button.html', './view_components/minus_button/minus_button.css');

        removeButton.onClickButton = onClickRemoveButton;
    }

    function onClickRemoveButton() {

        collapse(function(){
            cellFrame.parentNode.removeChild(cellFrame);
            
            if ( typeof _this.onRemoveCell === 'function' ) {
                _this.onRemoveCell(_personVisit);
            }

            _this = null;
        });
    }

    // function _appendTo(parent) {
    //     parent.appendChild(cellFrame);

    //     if ( typeof _this.appendCallback === 'function' ) {
    //         _this.appendCallback();
    //     }
    // }

    function extractFrom0() {
        cellFrame.style.height = 0;
        $(cellFrame).animate({
            height : EXTRACTED_HEIGHT
        }, 300);
    }

    function collapse(nextFunc) {

        $(cellFrame).animate({
            height : 0
        }, 300, nextFunc());
    }

    // function waitAppendUntilReady(appendFunc, parent) {
        
    //     waiter.wait(function(){
    //         appendFunc(parent);
    //     }, function(){
    //         return _isFrameReady;
    //     });
    // }
   
    // this.appendTo = function(parent) {
    //     waitAppendUntilReady(_appendTo, parent);
    // };

    // this.appendAndExtract = function(parent) {
    //     waitAppendUntilReady(_appendAndExtract, parent);
    // };

    initialize();
};





