<!--

function DatabaseUser (iUserLabel) {
    this.label=iUserLabel;
    this.actions = [];
}

function DatabaseMap (iDatabaseLabel) {
    this.label=iDatabaseLabel;
    this.source = [];
    this.users = [];
}

function Database_getDatabaseName(iDatabase){
    
    return iDatabase.label;
}

function Database_getSourceList(iDatabase){
    var wList = [];
    
    for (var i = 0; i < iDatabase.source.length; ++i){
        wList.push(iDatabase.source[i]);
    }

    return wList;
}

function Database_getUserList(iDatabase){
    var wList = [];
    
    for (var i = 0; i < iDatabase.users.length; ++i){
        wList.push(iDatabase.users[i].label);
    }

    return wList;
}

function Database_getUserObj(iDatabase, iUserLabel){
    
    for (var i = 0; i < iDatabase.users.length; ++i){
        if (iUserLabel == iDatabase.users[i].label){
            return iDatabase.users[i];
        }
    }
    
    alert("Database user <" + iUserLabel + "> already exist in database"); 
    return null;
}

function Database_getUserActionList(iDatabase, iUserLabel){

    var wUser = Database_getUserObj(iDatabase, iUserLabel);
    var wList = [];
    
    if (null != wUser) {

        for (var i = 0; i < wUser.actions.length; ++i){
            wList.push(wUser.actions[i]);
        }
    }

    return wList;
}

function Database_getSourceCount(iDatabase){
    return iDatabase.source.length;
}

function Database_getUserCount(iDatabase){
    return iDatabase.users.length;
}

function Database_changeLabel(iDatabase, iNewLabel){
    iDatabase.label = iNewLabel;
}

function Database_addSource(iDatabase, iSourceName){

    for (var i = 0; i < iDatabase.source.length; ++i){
        if (iSourceName == iDatabase.source[i]){
            alert("Database source <" + iSourceName + "> already exist in database"); 
            return;
        }
    }
    iDatabase.source.push(iSourceName);
}

function Database_removeSource(iDatabase, iSourceName){

    var wStart = false;
    for (var i = 0; i < iDatabase.source.length; ++i){
        if (iSourceName == iDatabase.source[i]){
            wStart = true;
        }
        if (true == wStart){
            if ((i+1) != iDatabase.source.length){
                iDatabase.source[i] = iDatabase.source[i + 1];
            }
        }
    }

    if (true == wStart){
        iDatabase.source.length = iDatabase.source.length - 1;
    }
    else{
        alert("Database source <" + iSourceName + "> not found in database"); 
    }
}

function Database_editSource(iDatabase, iSourceNameOrginal, iSourceNameNew){

    for (var i = 0; i < iDatabase.source.length; ++i){
        if (iSourceNameOrginal == iDatabase.source[i]){
            iDatabase.source[i] = iSourceNameNew;
            return;
        }
    }
    
    alert("Database source <" + iSourceNameOrginal + "> not found in database"); 
}

function Database_addUser(iDatabase, iUserLabel){

    for (var i = 0; i < iDatabase.users.length; ++i){
        if (iUserLabel == iDatabase.users[i].label){
            alert("Database user <" + iUserLabel + "> already exist in database"); 
            return;
        }
    }
    iDatabase.users.push(new DatabaseUser(iUserLabel));
}

function Database_removeUser(iDatabase, iUserLabel){

    var wStart = false;
    for (var i = 0; i < iDatabase.users.length; ++i){
        if (iUserLabel == iDatabase.users[i].label){
            wStart = true;
        }
        if (true == wStart){
            if ((i+1) != iDatabase.users.length){
                iDatabase.users[i] = iDatabase.users[i + 1];
            }
        }
    }

    if (true == wStart){
        iDatabase.users.length = iDatabase.users.length - 1;
    }
    else{
        alert("Database user <" + iUserLabel + "> not found in database"); 
    }
}

function Database_editUserLabel(iDatabase, iUserLabelOrginal, iUserLabelNew){

    for (var i = 0; i < iDatabase.users.length; ++i){
        if (iUserLabelOrginal == iDatabase.users[i].label){
            iDatabase.users[i].label = iUserLabelNew;
            return;
        }
    }
    
    alert("Database user <" + iUserLabelOrginal + "> not found in database"); 
}

function Database_addUserAction(iDatabase, iUserLabel, iAction){

    var wUser = Database_getUserObj(iDatabase, iUserLabel);
    
    if (null != wUser) {

        for (var i = 0; i < wUser.actions.length; ++i){
            if (iAction == wUser.actions[i]){
                alert("Database user action <" + iAction + "> already exist"); 
                return;
            }
        }

        wUser.actions.push(iAction);
    }

}

function Database_removeUserAction(iDatabase, iUserLabel, iAction){
    
    var wUser = Database_getUserObj(iDatabase, iUserLabel);
    
    if (null != wUser) {
        var wStart = false;
        for (var i = 0; i < wUser.actions.length; ++i){
            if (iAction == wUser.actions[i]){
                wStart = true;
            }
            if (true == wStart){
                if ((i+1) != wUser.actions.length){
                    wUser.actions[i] = wUser.actions[i + 1];
                }
            }
        }

        if (true == wStart){
            wUser.actions.length = wUser.actions.length - 1;
        }
        else{
            alert("Database user action <" + iAction + "> not found in database"); 
        }
    }
}

function Database_editUserAction(iDatabase, iUserLabel, iUserActionOriginal, iUserActionNew){
    
    var wUser = Database_getUserObj(iDatabase, iUserLabel);
    
    if (null != wUser) {

        for (var i = 0; i < wUser.actions.length; ++i){
            if (iUserActionOriginal == wUser.actions[i]){
                wUser.actions[i] = iUserActionNew;
                return;
            }
        }
    
        alert("Database user action <" + iUserActionOriginal + "> not found in database"); 
    }
}

-->