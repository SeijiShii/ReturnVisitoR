"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.MenuSelector = function(parent, optionObject, initialSelectedKey) {

    var _this = this,
        _parent = parent,
        selectorDiv,
        overlay,
        menuList,
        menuOptions,
        OPTION_HEIGHT_NUM = 30,
        OPTION_HEIGHT = OPTION_HEIGHT_NUM + 'px',
        OPTION_ID_PREFIX = 'option_',
        keys = Object.keys(optionObject),
        _selectedKey = initialSelectedKey,
        _selectedOption;
    
    // Callback
    this.onSelectOption;

    function initSelectorDiv() {
        selectorDiv = document.createElement('div');
        $(selectorDiv).css({
            width : '90%',
            height : '30px',
            textAlign : 'right',
            fontSize : '15px',
            lineHeight : '30px',
            border: 'solid 1px gray',
            borderRadius : '5px',
            backgroundColor : 'whitesmoke',
            paddingRight: '10px'
        });

        selectorDiv.innerText = getSelectorDivText();

        selectorDiv.addEventListener('click', onClickSelectorDiv);

        _parent.appendChild(selectorDiv);
    }


    function getSelectorDivText() {

        var text;

        if (_selectedKey === undefined) {
            text = optionObject[keys[0]];
        } else {
            for ( var i = 0 ; i < keys.length ; i++ ) {
                if ( keys[i] === _selectedKey ) {
                    text = optionObject[keys[i]]
                }
            }
        }

        return text + ' ▼';
    }

    function onClickSelectorDiv() {

        clickFade(selectorDiv)

        document.body.appendChild(overlay);

        var rect =  selectorDiv.getBoundingClientRect();

        var topPosition = rect.top - getSelectedKeyIndex() * OPTION_HEIGHT_NUM;

        $(menuList).css({
            top : topPosition + 'px',
            left : rect.left + 'px',
            width : (rect.width - 20) + 'px'

        });

        document.body.appendChild(menuList);

        menuList.style.height = (keys.length * (OPTION_HEIGHT_NUM + 1)) + 'px';
        var menuBottom = parseInt(menuList.style.top) + parseInt(menuList.style.height)
        
        if (parseInt(menuList.style.height) >=  window.innerHeight) {
            menuList.style.height = (window.innerHeight - 30) + 'px';
            menuList.style.top = '10px';
        } else {

            if (parseInt(menuList.style.top) <= 0) {

                menuList.style.top = '10px';

            } else if (menuBottom >= window.innerHeight) {

                menuList.style.bottom = '10px';

            }
        }

        $(menuList).fadeTo(100, 1);
    }

    function getSelectedKeyIndex() {
        if (_selectedKey === undefined) {
            return 0;
        }

        for ( var i = 0 ; i < keys.length ; i++ ) {
            if (_selectedKey === keys[i]) {
                return i;
            }
        }
    }

    function initOverlay() {

        overlay = document.createElement('div');
        $(overlay).css({
            width : '100%',
            height : '100%',
            position: 'absolute',
            top : 0,
            left: 0,

        });

        overlay.addEventListener('click', function(e) {

            e.stopPropagation();
            dismiss();
           
        }, true);

    }

    function dismiss() {

        overlay.parentNode.removeChild(overlay);

        $(menuList).fadeTo(100, 0, function(){
            menuList.parentNode.removeChild(menuList);
        });
    }

    function initMenuList() {
        menuList = document.createElement('ul');

        $(menuList).css({
            height : (keys.length * (OPTION_HEIGHT_NUM + 1)) + 'px',
            border : 'solid gray 1px',
            position : 'absolute',
            opacity : 0,
            backgroundColor : 'whitesmoke',
            borderRadius : '5px',
            marginTop : 0,
            listStyle : 'none',
            paddingRight : '10px',
            paddingLeft : '10px',
            boxShadow : '3px 3px 3px #00000080',
            overflow : 'auto'
        });

    }

    function initMenuOptions() {

        menuOptions = [];
    
        for ( var i = 0 ; i < keys.length ; i++ ) {
            var option = document.createElement('li');
            $(option).css({
                height : OPTION_HEIGHT,
                fontSize : '15px',
                lineHeight : OPTION_HEIGHT,
                textAlign : 'right',
                borderBottom : 'solid gray 1px',
                position : 'relative'
            });
            if ( i == keys.length - 1 ) {
                option.style.borderBottom = 'none';
            }
            option.innerText = optionObject[keys[i]];
            option.id = OPTION_ID_PREFIX + keys[i]

            option.addEventListener('click', onOptionClick)

            menuList.appendChild(option);

        }
    }

    function onOptionClick(e) {
        
        dismiss();

        _selectedOption = e.srcElement;

        clickFade(_selectedOption);

        _selectedKey = _selectedOption.id.substring(OPTION_ID_PREFIX.length);

        selectorDiv.innerText = getSelectorDivText();

        if ( typeof _this.onSelectOption === 'function' ) {
            _this.onSelectOption(_selectedKey);
        }

    }

    function clickFade(elm) {
        $(elm).fadeTo(100, 0.3, function() {
            $(elm).fadeTo(100, 1);
        })
    }

 
    initSelectorDiv();
    initOverlay();
    initMenuList();
    initMenuOptions();
}