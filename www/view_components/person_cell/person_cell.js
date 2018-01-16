"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.PersonCell = function(parent, person, blocked) {

    var _this = this,
        _person = person,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = returnvisitor.common.loadFile,
        elements = returnvisitor.common.elements,
        raterColors = returnvisitor.common.raterColors,
        Person = returnvisitor.data.Person,
        SmallSquareButton = returnvisitor.viewComponents.SmallSquareButton,
        cellFrame;
        // _isFrameReady = false;

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
            initBlockOverlay();
            initTouchListener();
            
            parent.appendChild(cellFrame);

            // _isFrameReady = true;

            if ( typeof _this.onReadyCell === 'function' ) {
                _this.onReadyCell();
            }

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

        editButton.onClickButton = function() {
            console.log('edit button click!');
        }
    }

    function initBlockOverlay() {
        var blockOverlay = elements.getElementByClassName(cellFrame, 'block_overlay');

        if (blocked) {
            $(blockOverlay).css({
                display : 'block'
            });
        } else {
            $(blockOverlay).css({
                display : 'none'
            });
        }
    }

    function initTouchListener() {
        
        if (blocked) {

        } else {
            cellFrame.addEventListener('click', _onClickCell);
        }
    }

    function _onClickCell(e) {

        console.log('cell frame click!');

        $(cellFrame).fadeTo(100, 0.3, function(){
            $(cellFrame).fadeTo(100, 1);
        });

        if ( typeof _this.onClickCell === 'function' ) {
            _this.onClickCell(_person);
        }

    }

    initialize();

}