RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place = function(latLng){
    
    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.call(this, 'place');

    this.latLng = latLng;
}

// RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place.prototype = new RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject('place')

// プロトタイプにいろいろプロパティを付け加えたいときはこの文法でまとめてできるらしいけどコンストラクタだけならいらないかな
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype,{
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place,
        writable: true
    }
})