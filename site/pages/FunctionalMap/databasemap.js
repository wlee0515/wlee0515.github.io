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


function Database_clearDatabase(iDatabase){
    iDatabase.label = "Database";
    iDatabase.source = [];
    iDatabase.users = [];
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
    
    alert("Database user <" + iUserLabel + "> does not exist in database"); 
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

function Database_editDatabaseName(iDatabase, iNewLabel){
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

function Database_loadObjFromJSONObj(iDatabase, iJSONObj) {
    if (null != iJSONObj){
        
        Database_clearDatabase(iDatabase);

        var wName = Database_getDatabaseName(iJSONObj);
        Database_editDatabaseName(iDatabase, wName);

        var wSourceList = Database_getSourceList(iJSONObj);
        for(var i = 0; i < wSourceList.length; ++i){
            Database_addSource(iDatabase, wSourceList[i]);
        }

        var wUserList = Database_getUserList(iJSONObj);
        for(var i = 0; i < wUserList.length; ++i){
            Database_addUser(iDatabase, wUserList[i]);

            var wActionList = Database_getUserActionList(iJSONObj,wUserList[i]);
            for(var j = 0; j < wActionList.length; ++j){
                Database_addUserAction(iDatabase,wUserList[i],wActionList[j]);
            }
        }
    }
}

function Database_loadObjFromJSONString(iDatabase, iJSONString) {
    
    var wObj = JSON.parse(iJSONString);
    if (null != wObj) {

        Database_loadObjFromJSONObj(iDatabase, wObj);
    }
}

function Database_cleanLocalStorage(iKey){
    localStorage.removeItem(iKey);
}

function Database_saveToLocalStorage(iDatabase, iKey){

    localStorage.setItem(iKey, JSON.stringify(iDatabase));
}

function Database_loadFromLocalStorage(iDatabase, iKey){

    var wMem = localStorage.getItem(iKey);
    Database_clearDatabase(iDatabase);
    if (null != wMem){
        Database_loadObjFromJSONString(iDatabase, wMem);
        return true;
    }
    return false;

}

function drawImageCenteredAt(iCtx, iImage, iCenterX, iCenterY, iWidth, iHeight) {

    var wDBCornerX = iCenterX - iWidth / 2;
    var wDBCornerY = iCenterY - iHeight / 2;

    iCtx.drawImage(iImage, wDBCornerX, wDBCornerY, iWidth, iHeight);
}

function drawRectCenteredAt(iCtx, iCenterX, iCenterY, iWidth, iHeight) {

    iCtx.fillRect(iCenterX - iWidth / 2, iCenterY - iHeight / 2, iWidth, iHeight);
    iCtx.strokeRect(iCenterX - iWidth / 2, iCenterY - iHeight / 2, iWidth, iHeight);

}

function drawTextCenteredAt(iCtx, iCenterX, iCenterY, iText) {

    iCtx.textAlign = "center";
    iCtx.textBaseline = "middle";
    iCtx.fillText(iText, iCenterX, iCenterY);

}

function drawLabelTextAt(iCtx, iCenterX, iCenterY, iText, iBackColor, iTextColor) {

    if ("" != iBackColor) {
        iCtx.fillStyle = iBackColor;
        iCtx.strokeStyle = iTextColor;
        drawRectCenteredAt(iCtx, iCenterX, iCenterY - 0.1 * parseInt(iCtx.font), iCtx.measureText(iText).width + 10, parseInt(iCtx.font) + 5);
    }

    iCtx.fillStyle = iTextColor;
    iCtx.strokeStyle = iTextColor;
    drawTextCenteredAt(iCtx, iCenterX, iCenterY, iText);

}

function Database_drawMap(iCtx, iDatabase, iDatabaseImg, iUserImg , iCanvasWidth, iCavasHeight) {

    var wBaseLength = 1000;
    if ((null == iCtx) || (null == iDatabase) || (null == iDatabaseImg) || (null == iUserImg)) {
        return;
    }
     
    var wCanvasWidth = iCanvasWidth;
    var wCanvasHeight = iCavasHeight;

    if (null == wCanvasWidth) wCanvasWidth = wBaseLength;
    if (null == wCanvasHeight) wCanvasHeight = wCanvasWidth;

    var wCanvasRefLength = wCanvasWidth;
    if (wCanvasRefLength > wCanvasHeight) {
        wCanvasRefLength = wCanvasHeight;
    }
    
    var wImageScale = wCanvasRefLength / wBaseLength;
    iCtx.scale(wImageScale, wImageScale);

    var wRelativeWidth = wCanvasWidth/wImageScale;
    
    var wIconSize = 50;
    var wUserRadius = wBaseLength / 2 - 2.25 * wIconSize;
    var wFont = "12pt Arial";
    var wLabelColor = "white";
    var wTextColor = "black"
    var wCenterYOffset = wIconSize;
    var wSourceYOffset = wUserRadius - wCenterYOffset - wIconSize;

    var wDatabaseName = Database_getDatabaseName(iDatabase);
    var wDatabaseSourceList = Database_getSourceList(iDatabase);
    var wDatabaseUserList = Database_getUserList(iDatabase);

    iCtx.font = wFont;
    var wLabelHeight = parseInt(iCtx.font);

    if (0 != wDatabaseSourceList.length) {
        var wSubDBIconSize = wIconSize * 0.6;
        var wSubIconBox = 2.0 * wSubDBIconSize;

        var wMaxTextSize = 0;
        for (var i = 0; i < wDatabaseSourceList.length; ++i) {
            var wMeasure = iCtx.measureText(wDatabaseSourceList[i]).width;
            if (wMaxTextSize < wMeasure) {
                wMaxTextSize = wMeasure;
            }
        }
        wMaxTextSize += wSubDBIconSize;

        var wCountPerLine = Math.floor(wRelativeWidth / (wMaxTextSize));

        if (wDatabaseSourceList.length < wCountPerLine) {
            wCountPerLine = wDatabaseSourceList.length;
        }

        var wSpacing = wRelativeWidth / (wCountPerLine + 1);
        var wXOffset = wRelativeWidth / 2;
        var wLineCount =  Math.ceil(wDatabaseSourceList.length/wCountPerLine);

        for (var i = 0; i < wDatabaseSourceList.length; ++i) {
            var wCenterX = (i % wCountPerLine + 1) * wSpacing - wXOffset;
            var wRow = Math.floor(i / wCountPerLine);
            var wCenterY = (Math.floor(i / wCountPerLine)) * wSubIconBox - wSourceYOffset - wLineCount*wIconSize;

            drawImageCenteredAt(iCtx, iDatabaseImg, wCenterX, wCenterY, wSubDBIconSize, wSubDBIconSize);
            drawLabelTextAt(iCtx, wCenterX, wCenterY + wSubDBIconSize / 2 + wLabelHeight, wDatabaseSourceList[i], wLabelColor, wTextColor);

        }

    }

    iCtx.translate(0, wCenterYOffset);

    if (0 != wDatabaseUserList.length) {

        var wUserIconAngle = ((2 / 4) * Math.PI + Math.PI) / wDatabaseUserList.length;
        var wAngleOff = wUserIconAngle / 2 - (1 / 4) * Math.PI;

        for (var i = 0; i < wDatabaseUserList.length; ++i) {
            var wAngle = wAngleOff + i * wUserIconAngle;

            var wUserRadiusWithSign = wUserRadius;
            var wRotateAngle = wAngle;
            var wRadius = 0.5 * (wUserRadius - wIconSize / 2) + wIconSize / 2;
            var wInflectRad_1 = wRadius - wRadius/2;
            var wInflectRad_2 = wRadius + wRadius/2;

            if (Math.PI / 2 < Math.abs(wRotateAngle)) {
                wRotateAngle += Math.PI;
                wRadius *= -1;
                wUserRadiusWithSign *= -1;
                wInflectRad_1 *= -1;
                wInflectRad_2 *= -1;
            }

            iCtx.rotate(wRotateAngle);

            var wUserActionList = Database_getUserActionList(gFunctionalMapObject, wDatabaseUserList[i]);

            if (0 != wUserActionList.length) {
                var wSpacing = parseInt(iCtx.font) * 2.0;
                var wTotalHeight = wUserActionList.length * wSpacing;
                var wStart = -(wTotalHeight - wSpacing) / 2;

                for (var j = 0; j < wUserActionList.length; ++j) {
                    var wHeight = wStart + j * wSpacing;

                    iCtx.beginPath();
                    iCtx.moveTo(0, 0);
                    iCtx.quadraticCurveTo(wInflectRad_1, wHeight, wRadius, wHeight);
                    iCtx.moveTo(wUserRadiusWithSign, 0);
                    iCtx.quadraticCurveTo(wInflectRad_2, wHeight, wRadius, wHeight);

                    iCtx.strokeStyle = wTextColor;
                    iCtx.stroke();

                    drawLabelTextAt(iCtx, wRadius, wHeight, wUserActionList[j], wLabelColor, wTextColor);
                }

            }

            iCtx.rotate(-wRotateAngle);


            var wCenterX = Math.cos(wAngle) * wUserRadius;
            var wCenterY = Math.sin(wAngle) * wUserRadius;

            iCtx.beginPath();
            iCtx.arc(wCenterX, wCenterY, wIconSize, 0, 2 * Math.PI);
            iCtx.closePath();
            iCtx.fillStyle = wLabelColor;
            iCtx.strokeStyle = wTextColor;
            iCtx.fill();
            iCtx.stroke();

            drawImageCenteredAt(iCtx, iUserImg, wCenterX, wCenterY - wLabelHeight, wIconSize, wIconSize);
            drawLabelTextAt(iCtx, wCenterX, wCenterY + wIconSize / 2, wDatabaseUserList[i], wLabelColor, wTextColor);
            
        }
    }

    iCtx.beginPath();
    iCtx.arc(0, 0, 1.5 * wIconSize, 0, 2 * Math.PI);
    iCtx.closePath();
    iCtx.fillStyle = wLabelColor;
    iCtx.strokeStyle = wTextColor;
    iCtx.fill();
    iCtx.stroke();

    drawImageCenteredAt(iCtx, iDatabaseImg, 0,-wLabelHeight, wIconSize, wIconSize);
    drawLabelTextAt(iCtx, 0,wIconSize / 2, wDatabaseName, wLabelColor, wTextColor);
    
    iCtx.translate(0, -wCenterYOffset);

    iCtx.scale(1 / wImageScale, 1 / wImageScale);
}
-->