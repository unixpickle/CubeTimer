var objectIdList = {'ids': ['data']}

// Puzzle Sync Objects
var objectPuzzle = {'id': 'data', 'attributes': {'[string]': 'data'}};
var objectConflict = {'remotePuzzle': objectPuzzle, 'localId': 'data'};
var objectRename = {'id': 'data', 'name': 'string'};

// Session Sync Objects
var objectSolve = {'scramble': 'string', 'date': 'number', 'status': 'int',
                   'time': 'number', 'inspectionTime': 'number'};
var objectSession = {'puzzleId': 'data', 'solves': [objectSolve]};
var objectHashes = {'idPrefix': 'data', 'length': 'int', 'hashes': {'[data]': '[data]'}};

var apiCalls = {
    'puzzles': {
        'add': {'puzzles': [objectPuzzle]},
        'replace': {'remoteId': 'data', 'puzzle': objectPuzzle},
        'renameThenAdd': {'remoteId': 'data', 'name': 'string', 'puzzle': objectPuzzle},
        'rename': {'renames': [objectRename]},
        'deleteThenRename': {'deleteId': 'data', 'rename': objectRename},
        'setValues': {'sets': [{'id': 'data', 'attribute': 'string', 'value': 'data'}]},
        'delete': objectIdList,
        'list': {},
        'myOrder': objectIdList
    },
    'sessions': {
        'delete': objectIdList,
        'add': {'sessions': [objectSession]},
        'getHashes': {'idPrefix': 'data', 'length': 'int'},
        'getDiff': {'idPrefix': 'data', 'ids': ['data']}
    },
    'account': {
        'setValues': {'attributes': [{'attribute': 'string', 'value': 'data'}]},
        'getAccount': {},
        'signin': {'username': 'string', 'hash': 'data'}
    }
};

function lookupAPICall(var name) {
    var list = name.split('.');
    if (list.length != 2) return null;
    if (!apiCalls[list[0]]) {
        return null;
    }
    if (!apiCalls[list[0]][list[1]]) {
        return null;
    }
    return apiCalls[list[0]][list[1]];
}

function validateAPICallType(var name, var obj) {
    var expectedObj = lookupAPICall(name);
    if (!expectedObj) return false;
    
    return validateValue(obj, expectedObj);
}

function validateValue(var object, var type) {
    if (typeof type == 'object') {
        // its a dictionary
        if (typeof object != 'object') {
            return false;
        }
        return validateObject(object, type);
    } else if (typeof type == 'string') {
        if (type == 'data') {
            if (typeof object != 'object') return false;
            if (object.constructor.name != 'KBBuffer') return false;
        } else return (type == typeof object);
    }
}

/*** Validation For Objects ***/

function validateObject(var dict, var types) {
    if (validateObjectIsAttributeList(types)) {
        return validateAttributeList(dict, types);
    } else {
        // confirm each property of `types` on dict
        for (var key in types) {
            if (dict[key] == undefined) return false;
            if (!validateValue(dict[key], types[key])) return false;
        }
        // make sure they didn't send any excess keys
        for (var key in dict) {
            if (types[key] == undefined) return false;
        }
        return true;
    }
}

function validateObjectIsAttributeList(var types) {
    var keys = Object.keys(types);
    if (keys.length == 1) {
        // check if its an array type
        if (keys[0].length > 2) {
            var key = keys[0];
            if (key[0] == '[' && key[key.length - 1] == ']') {
                return true;
            }
        }
    }
    return false;
}

function validateAttributeList(var dict, var types) {
    var key = Object.keys(types)[0];
    var keyType = key.substring(1, key.length);
    var valType = types[key];
    for (var dictKey in dict) {
        if (!validateValue(dictKey, keyType)) return false;
        if (!validateValue(dict[dictKey], valType)) return false;
    }
}

exports.validateCall = validateAPICallType;
