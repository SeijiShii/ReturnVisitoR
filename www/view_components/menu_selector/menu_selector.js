'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.MenuSelector = function(parent, optionArray, selectedIndex) {

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
        _optionArray = optionArray,
        _selectedIndex = selectedIndex !== undefined ? selectedIndex : 0,
        OPTION_HEIGHT_NUM = 30,
        OPTION_ID_PREFIX = 'option_',
        _selectedOption;

    function initialize() {

        loadFile.loadCss('./view_components/menu_selector/menu_selector.css');

        initSelectorFrame();
        initOverlay();
        initMenuList();
        refreshMenuOptions();
    }

    this.refresh = function(optionArray, selectedIndex) {

        _optionArray = optionArray;
        _selectedIndex = selectedIndex !== undefined ? selectedIndex : 0,

        refreshSelectorFrame();
        refreshMenuList();
        refreshMenuOptions();
    };

    function initSelectorFrame() {
        selectorFrame = document.createElement('div');
        selectorFrame.classList.add('menu_selector_frame');
        selectorFrame.blink = new elementsEffect.Blink(selectorFrame);
        selectorFrame.addEventListener('click', onClickSelectorFrame);
        _parent.appendChild(selectorFrame);

        refreshSelectorFrame();
    }

    function refreshSelectorFrame() {
        selectorFrame.innerText = getSelectedText();
    }


    function getSelectedText() {

        if (_selectedIndex === undefined) {
            _selectedIndex = 0;
        } 
        return _optionArray[_selectedIndex] + ' ▼';
    }

    function onClickSelectorFrame() {

        document.body.appendChild(overlay);

        var rect =  selectorFrame.getBoundingClientRect();

        var topPosition = rect.top - _selectedIndex * OPTION_HEIGHT_NUM;

        $(menuList).css({
            top : topPosition,
            left : rect.left,
            width : rect.width - 20

        });

        document.body.appendChild(menuList);

        menuList.style.height = (_optionArray.length * (OPTION_HEIGHT_NUM + 1)) + 'px';
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

        overlay.addEventListener('click', function() {
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

        refreshMenuList();
    }

    function refreshMenuList() {
        $(menuList).css({
            height : _optionArray.length * (OPTION_HEIGHT_NUM + 1) 
        });
    }

    function refreshMenuOptions() {

        menuList.innerHTML = '';

        for ( var i = 0 ; i < _optionArray.length ; i++ ) {
            var option = document.createElement('li');
            option.classList.add('option');
            new elementsEffect.Blink(option);
            
            if ( i == _optionArray.length - 1 ) {
                option.style.borderBottom = 'none';
            }
            option.innerText = _optionArray[i];
            option.id = OPTION_ID_PREFIX + i;

            option.addEventListener('click', onOptionClick);

            menuList.appendChild(option);

        }
    }

    function onOptionClick(e) {
        
        dismiss();

        _selectedOption = touchEventFilter.getTarget(e, 'option');
        _selectedIndex = _selectedOption.id.substring(OPTION_ID_PREFIX.length);

        selectorFrame.innerText = getSelectedText();

        if ( typeof _this.onSelectOption === 'function' ) {
            _this.onSelectOption(_selectedIndex);
        }

    }

    initialize();
};