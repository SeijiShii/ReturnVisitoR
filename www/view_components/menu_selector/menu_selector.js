'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.MenuSelector = function(parent, keyValueObject, selectedKey) {

    var returnvisitor   = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elementsEffect   = common.elementsEffect,
        touchEventFilter = common.touchEventFilter,
        _this = this,
        _parent = parent,
        selectorFrame,
        overlay,
        menuList,
        _keyValueObject = keyValueObject,
        keys = Object.keys(keyValueObject),
        values = keyValueObject.values,
        OPTION_HEIGHT_NUM = 30,
        OPTION_ID_PREFIX = 'option_',
        _selectedKey = selectedKey,
        _selectedOption;

    function initialize() {

        loadFile.loadCss('./view_components/menu_selector/menu_selector.css');

        initSelectorFrame();
        initOverlay();
        initMenuList();
        initMenuOptions();
    }

    function initSelectorFrame() {
        selectorFrame = document.createElement('div');
        selectorFrame.classList.add('menu_selector_frame');

        selectorFrame.innerText = getSelectedText();
        selectorFrame.blink = new elementsEffect.Blink(selectorFrame);
        selectorFrame.addEventListener('click', onClickSelectorFrame);
        _parent.appendChild(selectorFrame);
    }


    function getSelectedText() {

        var index = 0;

        if (_selectedKey) {
            index = keyValueObject.indexOfKey(_selectedKey);
        } 
        return values[index] + ' ▼';
    }

    function onClickSelectorFrame() {

        document.body.appendChild(overlay);

        var rect =  selectorFrame.getBoundingClientRect();

        var topPosition = rect.top - keyValueObject.indexOfKey(_selectedKey) * OPTION_HEIGHT_NUM;

        $(menuList).css({
            top : topPosition,
            left : rect.left,
            width : rect.width - 20

        });

        document.body.appendChild(menuList);

        menuList.style.height = (keys.length * (OPTION_HEIGHT_NUM + 1)) + 'px';
        var menuBottom = parseInt(menuList.style.top) + parseInt(menuList.style.height);
        
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


    function initOverlay() {

        overlay = document.createElement('div');
        overlay.classList.add('menu_selector_overlay');

        overlay.addEventListener('click', function(e) {
            dismiss();  
        });

    }

    function dismiss() {

        overlay.parentNode.removeChild(overlay);

        $(menuList).fadeTo(100, 0, function(){
            menuList.parentNode.removeChild(menuList);
        });
    }

    function initMenuList() {
        menuList = document.createElement('ul');
        menuList.classList.add('menu_selector_list');

        $(menuList).css({
            height : values.length * (OPTION_HEIGHT_NUM + 1) 
        });

    }

    function initMenuOptions() {

        for ( var i = 0 ; i < values.length ; i++ ) {
            var option = document.createElement('li');
            option.classList.add('option');
            new elementsEffect.Blink(option);
            
            if ( i == values.length - 1 ) {
                option.style.borderBottom = 'none';
            }
            option.innerText = values[i];
            option.id = OPTION_ID_PREFIX + keys[i];

            option.addEventListener('click', onOptionClick);

            menuList.appendChild(option);

        }
    }

    function onOptionClick(e) {
        
        dismiss();

        _selectedOption = touchEventFilter.getTarget(e, 'option');
        _selectedKey = _selectedOption.id.substring(OPTION_ID_PREFIX.length);

        selectorFrame.innerText = getSelectedText();

        if ( typeof _this.onSelectOption === 'function' ) {
            _this.onSelectOption(_selectedKey);
        }

    }

    initialize();
};