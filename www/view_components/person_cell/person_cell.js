"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.PersonCell = function(parent, person) {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = returnvisitor.common.loadFile,
        elements = returnvisitor.common.elements,
        raterColors = returnvisitor.common.raterColors,
        Person = returnvisitor.data.Person,
        SmallSquareButton = returnvisitor.viewComponents.SmallSquareButton,
        cellFrame;

    if (parent === undefined) {
        throw new Error('Argument parent must not be undefined.')
    }

    if (person === undefined) {
        throw new Error('Argument person must not be undefined.')
    }

    function initialize() {
        loadFile.loadCss('./view_components/person_cell/person_cell.css');
        loadFile.loadHtmlAsElement('./view_components/person_cell/person_cell.html', function(div){
            cellFrame = div;

            initButtonMark();
            initPersonData();
            initEditButton();
            
            // _isFrameReady = true;

            parent.appendChild(cellFrame);

        });

    }

    function initButtonMark() {
        var buttonMark = elements.getElementByClassName(cellFrame, 'button_mark');
        buttonMark.style.backgroundColor = raterColors.interestColors[Person.interest.indexOfKey(person.interest)];
    }

    function initPersonData() {
        var personData = elements.getElementByClassName(cellFrame, 'person_data');
        personData.innerText = person.data;
    }

    function initEditButton() {
        var editButtonBase = elements.getElementByClassName(cellFrame, 'edit_button_base');
        
        var editButton = new SmallSquareButton(editButtonBase, './view_components/edit_button/edit_button.html', './view_components/edit_button/edit_button.css');
    }


    initialize();

}