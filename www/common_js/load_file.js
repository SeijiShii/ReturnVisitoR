/**
 * @returns file element
 */

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common')
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile = function(filePath){

    console.log('loadFile called!, path: ' + filePath);

    var pathArray = filePath.split('/');
    var fileName = pathArray[pathArray.length - 1];
    var extension = fileName.split('.')[1];

    if (extension) {
        if (extension === 'js') {
            var fileElement = document.createElement('script');
            fileElement.setAttribute('type', 'text/javascript');
            fileElement.setAttribute('src', filePath);

            return fileElement;
        }
    } 
};