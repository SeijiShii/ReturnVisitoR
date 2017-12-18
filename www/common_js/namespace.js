var RETURNVISITOR_APP = RETURNVISITOR_APP || {};

RETURNVISITOR_APP.namespace = function(ns_string){
  var parts = ns_string.split('.'), // . で区切った配列
      parent = RETURNVISITOR_APP, // グローバルオブジェクトのアプリ名
      i;

  // 先頭のグローバルを取り除く
  if ( parts[0] === "RETURNVISITOR_APP"){
    parts = parts.slice(1); // 先頭を削除
  }

  for ( i = 0; i < parts.length; i += 1){
    // プロパティが存在しなければ作成する
    if ( typeof parent[parts[i]] === "undefined"){
      parent[parts[i]] = {}; // モジュールのオブジェクト生成
    }
    parent = parent[parts[i]];
  }
};