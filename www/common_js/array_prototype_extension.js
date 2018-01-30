'use strict';
Array.prototype.indexOfId = function(id) {
    for (var i = 0 ; i < this.length ; i++) {
        if (this[i].id === id) {
            return i;
        }
    }
    return -1;
};

Array.prototype.includesId = function(id) {

    return this.indexOfId(id) >= 0;
};

Array.prototype.includesData = function(data) {

    return this.includesId(data.id);
};

Array.prototype.indexOfData = function(data) {
    return this.indexOfId(data.id);
};

Array.prototype.removeData = function(data) {
    if (this.includesData(data)) {
        this.splice(this.indexOfData(data), 1);
    }
};

Array.prototype.removeArray = function(array) {
    for (var i = 0 ; i < array.length ; i++) {
        this.removeData(array[i]);
    }
};

Array.prototype.removeById = function(id) {
    if (this.includesId(id)) {
        this.splice(this.indexOfId(id), 1);
    }
};

Array.prototype.removeByIds = function(ids) {
    for (var i = 0 ; i < array.length ; i++) {
        this.removeById(ids[i]);
    }
};

Array.prototype.addData = function(data) {
    if (this.includesData(data)) {
        this.removeData(data);
    } 
    this.push(data);
};

Array.prototype.includes = function(element) {
    for ( var i = 0 ; i < this.length ; i++ ) {
        if (this[i] === element) {
            return true;
        }
    }
    return false;
};

Array.prototype.addElement = function(element) {
    if (!this.includes(element)) {
        this.push(element);
    } 
};