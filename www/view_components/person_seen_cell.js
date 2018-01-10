"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.PersonSeenCell = function(parent, person) {
    var cellFrame,
        midColumn,
        switchBox;

    function initCellFrame() {
        cellFrame = document.createElement('div');
        $(cellFrame).css({
            position: 'relative',
            width: '100%',
            minHeight: '70px',
            height: 'auto !important',
            height: '70px',
            borderBottom: 'solid 1px gray',
            overflow: 'hidden',
        });

        parent.appendChild(cellFrame);
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

        midColumn.appendChild(personData);

    }

    function initSwitchBox() {
        
        switchBox = document.createElement('div');
        $(switchBox).css({
            position: 'relative',
            minHeight: '40px'
        });

        midColumn.appendChild(switchBox);
    }

    function initRVSwitch() {
        var rvSwitchBase = document.createElement('span');
        $(rvSwitchBase).css({
            width: '105px',
            height: '40px',
            float: 'left',
            position: 'relative'
        });
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
        switchBox.appendChild(removeButtonBase);
    }

    initCellFrame();
}





