<!--

var gTacticalUnitCount = 0;
function TacticalUnit() {
    this.TacticalUnitID = ++gTacticalUnitCount;
    this.TacticalUnitTgtPosition = [0,0,0];
    this.TacticalUnitTgtAngularPosition = [0,0,0];
}

function TacticalNavigationServer() {

    this.TacticalUnitList = [];
    
    this.addTacticalUnit = function(){
        var wNewUnit = new TacticalUnit();
        
        var isAdded = false;
        for(var i=0; i < this.TacticalUnitList.length; ++i){
            if (null == this.TacticalUnitList[i]){
                this.TacticalUnitList[i] = wNewUnit;
                isAdded = true;
                break;
            }
        }
        
        if (false == isAdded) {
            this.TacticalUnitList.push(wNewUnit);
        }
        return wNewUnit;
    }
    
    this.removeTacticalUnit = function(iTacticalUnitID){
        for(var i=0; i < this.TacticalUnitList.length; ++i){
            if (iTacticalUnitID == this.TacticalUnitList[i].TacticalUnitID){
                this.TacticalUnitList[i] = null;
                break;
            }
        }
    }
    
    this.getTacticalUnitCmd = function( iTacticalUnitID ) { 
        for(var i=0; i < this.TacticalUnitList.length; ++i){
            if (iTacticalUnitID == this.TacticalUnitList[i].TacticalUnitID){
                return this.TacticalUnitList[i];
            }
        }
        return null;
    }
    
    this.setTacticalUnitCmd = function( iTacticalUnitID, iTgtPosition, iTgtAngularPosition) { 
        var wTacticalUnit = getTacticalUnitCmd(iTacticalUnitID);
        if (null !=  wTacticalUnit) {
            wTacticalUnit.TacticalUnitTgtPosition = iTgtPosition;
            wTacticalUnit.TacticalUnitTgtAngularPosition = iTgtAngularPosition;
            return true;
        }
        return false;
    }
}

function TacticalUnitCommander (){
    this.spread = 10;
    this.subUnitList = [];
    this.unitPool
    
}

-->
