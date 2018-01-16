'use strict'
Array.prototype.includesId = function(id) {
    for ( var i = 0 ; i < this.length ; i++ ) {
        if (this[i].id === id) {
            return true;
        }
    }
    return false;
}

Array.prototype.includesData = function(data) {

    return this.includesId(data.id);
}

Array.prototype.indexOfData = function(data) {
    for (var i = 0 ; i < this.length ; i++) {
        if (this[i].equals(data)) {
            return i;
        }
    }

    return null;
}

Array.prototype.removeData = function(data) {
    if (this.indexOfData(data) >= 0) {
        this.splice(this.indexOfData(data), 1);
    }
}

Array.prototype.removeArray = function(array) {
    for (var i = 0 ; i < array.length ; i++) {
        this.removeData(array[i]);
    }
}

Array.prototype.indexOfId = function(id) {
    for (var i = 0 ; i < this.length ; i++) {
        if (this[i].id === id) {
            return i;
        }
    }
    return null;
}

Array.prototype.removeById = function(id) {
    if (this.indexOfId(id) >= 0) {
        this.splice(this.indexOfId(id), 1);
    }
}

Array.prototype.removeByIds = function(ids) {
    for (var i = 0 ; i < array.length ; i++) {
        this.removeById(ids[i]);
    }
}

Array.prototype.addData = function(data) {
    if (this.includesData(data)) {
        this.removeData(data);
    } 
    this.push(data);
}

Array.prototype.addElement = function(element) {
    if (!this.includes(element)) {
        this.push(element);
    } 
}