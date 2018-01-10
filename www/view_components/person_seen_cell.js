"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.PersonSeenCell = function(parent, person) {
    var cellFrame,
        midColumn,
        switchBox,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        markerPaths = returnvisitor.common.markerPaths,
        viewComponents = returnvisitor.viewComponents,
        SwitchView = viewComponents.SwitchView,
        EditButton = viewComponents.EditButton,
        MinusButton = viewComponents.MinusButton,
        _person = {};

    _person.interest = 'STRONGLY_INTERESTED';
    _person.data = '四伊清司 男性 31~40 丸刈り'

    function initCellFrame() {
        cellFrame = document.createElement('div');
        $(cellFrame).css({
            position: 'relative',
            width: '100%',
            minHeight: '70px',
            height: 'auto !important',
            borderBottom: 'solid 1px gray',
        });

        parent.appendChild(cellFrame);

        initButtonMark();
        initMidColumn();
        initRemoveButton();
        addAnchor();
    }

    function initButtonMark() {

        var markDiv = document.createElement('div');
        $(markDiv).css({
            width: '30px',
            height: '100%',
            minHeight: '40px',
            float: 'left',
            position: 'relative'
        });

        var mark = document.createElement('img');
        $(mark).css({
            position: 'absolute',
            width: '20px',
            height: '20px',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: 'auto'
        });

        mark.src = markerPaths.buttonMarkerPaths.orangeButton;

        markDiv.appendChild(mark);

        cellFrame.appendChild(markDiv);

    }

    function initMidColumn() {

        midColumn = document.createElement('div');
        $(midColumn).css({
            minHeight: '70px',
            float: 'left'
        });

        initPersonData();
        initSwitchBox();

        cellFrame.appendChild(midColumn);
    }

    function initPersonData() {
         
        var personData = document.createElement('p');
        $(personData).css({
            fontSize: '12px',
            color: '#333',
            textAlign: 'center',
            position: 'relative',
            height: '30px',
            lineHeight: '30px',
            margin: 0,
            marginLeft: '20px',
            marginRight: '20px'
        });

        personData.innerText = _person.data;

        midColumn.appendChild(personData);

    }

    function initSwitchBox() {
        
        switchBox = document.createElement('div');
        $(switchBox).css({
            position: 'relative',
            minHeight: '40px'
        });

        midColumn.appendChild(switchBox);

        initRVSwitch();
        initStudySwitch();
        initEditButton();
    }

    function initRVSwitch() {
        var rvSwitchBase = document.createElement('span');
        $(rvSwitchBase).css({
            width: '105px',
            height: '40px',
            float: 'left',
            position: 'relative'
        });

        var rvSwitch = new SwitchView(rvSwitchBase, 'Return Visit');

        switchBox.appendChild(rvSwitchBase);
    }

    function initStudySwitch() {
        var studySwitchBase = document.createElement('span');
        $(studySwitchBase).css({
            width: '105px',
            height: '40px',
            float: 'left',
            position: 'relative'
        });

        var stSwitch = new SwitchView(studySwitchBase, 'Study');

        switchBox.appendChild(studySwitchBase);

    }

    function initEditButton() {
        var editButtonBase = document.createElement('span');
        $(editButtonBase).css({
            width: '40px',
            height: '40px',
            float: 'left',
            position: 'relative'
        });

        var editButton = new EditButton(editButtonBase);

        switchBox.appendChild(editButtonBase);

    }

    function initRemoveButton() {
        var removeButtonBase = document.createElement('span');
        $(removeButtonBase).css({
            width: '40px',
            height: '40px',
            float: 'right',
            position: 'relative'
        });

        var removeButton = new MinusButton(removeButtonBase);

        cellFrame.appendChild(removeButtonBase);
    }

    function addAnchor() {
        var anchor = document.createElement('div');
        $(anchor).css({
            width : '100%',
            clear : 'both',
            position : 'relative'
        });
        cellFrame.appendChild(anchor);
    }

    initCellFrame();
}





