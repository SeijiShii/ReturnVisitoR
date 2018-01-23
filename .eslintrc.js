module.exports = {
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            2,
            4
        ],
        "linebreak-style": [
            2,
            "windows"
        ],
        "quotes": [
            2,
            "single"
        ],
        "semi": [
            2,
            "always"
        ],
        "no-empty-function" : 2,

    },
    "globals" : {
        "$"                 : false,
        "RETURNVISITOR_APP" : false,
        "cordova"           : false,
        "plugin"            : false,
        "google"            : false,
    }
};