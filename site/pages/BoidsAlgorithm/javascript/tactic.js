<!--
/*

Army Group
  ->Field Army 1
    -> Corps 1.1
      -> Division 1.1.1
        -> Brigade 1.1.1.1
          -> Battalions 1.1.1.1.1
            -> Companies 1.1.1.1.1.1
              -> Platoon 1.1.1.1.1.1.1
                -> Squad 1.1.1.1.1.1.1.1
                  -> Soldiers 1.1.1.1.1.1.1.1.1
                  -> Soldiers 1.1.1.1.1.1.1.1.2
                  -> Soldiers 1.1.1.1.1.1.1.1.3
                  -> Soldiers 1.1.1.1.1.1.1.1.4
                -> Squad 1.1.1.1.1.1.1.2
              -> Platoon 1.1.1.1.1.1.2
            -> Companies 1.1.1.1.1.2
            -> Companies 1.1.1.1.1.3
            -> Companies 1.1.1.1.1.4
          -> Battalions 1.1.1.1.2
        -> Brigade 1.1.1.2
      -> Division 1.1.2
    -> Corps 1.2
  ->Field Army 2
  
*/
var gTacticalUnitCount = 0;
var gTacticalClusterCount = 0;
var gTacticalFactionCount = 0;
var gTacticalPoolCount = 0;

function TacticalUnit() {
  this.TacticalUnitID = ++gTacticalUnitCount;
  this.TacticalUnitTgtPosition = [0,0,0];
  this.TacticalUnitTgtAngularPosition = [0,0,0];
}

function TacticalUnitPool() {
  this.TacticalPoolID = ++gTacticalPoolCount;
  this.TacticalUnitPool = [];
  this.PoolChild = [];
  
  this.addPoolChild = function(iTacticalUnitPool){
    var isAdded = false;
    for(var i=0; i < this.PoolChild.length; ++i){
      if (null == this.PoolChild[i]){
        this.PoolChild[i] = iTacticalUnitPool;
        isAdded = true;
        break;
      }
    }
    
    if (false == isAdded) {
      this.PoolChild.push(iTacticalUnitPool);
    }
  }
  
  this.removePoolChild = function (iTacticalPoolID){
    for(var i=0; i < this.PoolChild.length; ++i){
      if (null != this.PoolChild[i]){
        if ( iTacticalPoolID == this.PoolChild[i].TacticalPoolID) {
          this.PoolChild[i] = null;
        }
      }
    }
    
    for(var i=0; i < this.PoolChild.length; ++i){
      if (null != this.PoolChild[i]){
        this.PoolChild[i].removePoolChild(TacticalPoolID);
      }
    }
  }
  
  this.addTacticalUnit = function(iTacticalUnitRef){
    var isAdded = false;
    for(var i=0; i < this.TacticalUnitPool.length; ++i){
      if (null == this.TacticalUnitPool[i]){
        this.TacticalUnitPool[i] = iTacticalUnitRef;
        isAdded = true;
        break;
      }
    }
    
    if (false == isAdded) {
      this.TacticalUnitPool.push(iTacticalUnitRef);
    }
  }
  
  this.removeTacticalUnit = function (iTacticalUnitID){
    for(var i=0; i < this.TacticalUnitPool.length; ++i){
      if (null != this.TacticalUnitPool[i]){
        if ( iTacticalUnitID == this.TacticalUnitPool[i].TacticalUnitID) {
          this.TacticalUnitPool[i] = null;
        }
      }
    }
    
    for(var i=0; i < this.PoolChild.length; ++i){
      if (null != this.PoolChild[i]){
        this.PoolChild[i].removeTacticalUnit(iTacticalUnitID);
      }
    }
  }
}

function TacticalCluster() {
  this.TacticalClusterID = ++gTacticalClusterCount;
  this.NavigatePosition = [0,0,0];
  this.NavigateAngularPosition = [0,0,0];
  this.AttackPosition = [0,0,0];
  
  this.TacticalUnitPool = new TacticalUnitPool();

  
  this.processCluster = function (iDeltaTime, iTacticalServer){
    
  }
}

function TacticalFaction(iMaxClusterSize = 50) {
  this.TacticalFactionID = ++gTacticalFactionCount;
  this.TacticalClusterList = [];
  
  this.TacticalUnitPool = new TacticalUnitPool();
  
  this.AddCluster = function () {
    var wNewCluster = new TacticalCluster();
    this.TacticalUnitPool.addPoolChild(wNewCluster.TacticalUnitPool);
    
    var isAdded = false;
    for(var i=0; i < this.TacticalClusterList.length; ++i){
      if (null == this.TacticalClusterList[i]){
        this.TacticalClusterList[i] = wNewCluster;
        isAdded = true;
        break
      }
    }
    
    if (false == isAdded){
      this.TacticalClusterList.push(wNewCluster);
    }
  }
  
  this.processFaction = function (iDeltaTime, iTacticalServer){
    
    for(var i=0; i < this.TacticalClusterList.length; ++i){
      if (null != this.TacticalClusterList[i]){
        this.TacticalClusterList[i].processCluster(iDeltaTime, iTacticalServer);
      }
    }
  }
}

function TacticalUnitCommander (iUnitPool, iCommandSize){
  this.spread = 10;
  this.unitResource = iUnitPool;
  this.subUnitList = [];
  for (var i = 0; i < iCommandSize; ++i) {
    this.subUnitList.push(null);
  }
  
  this.TacticalUnitTgtPosition = [0,0,0];
  this.TacticalUnitTgtAngularPosition = [0,0,0];
  
  
  this.processTime = function(iDeltaTime = 0.0) {
    
    // Replenish Units if unit is missing
    for (var i = 0; i < this.subUnitList.length; ++i){
      if ( null == this.subUnitList[i]) {
        
        for (var j = 0; j < this.unitResource.length; ++j){
          if ( null != this.unitResource[j]) {
            this.subUnitList[i] = this.unitResource[j];
            this.unitResource[j] = null;
            break;
          }
        }
        break;
      }
    }
    
    for (var i = 0; i < this.subUnitList.length; ++i){
      if ( null == this.subUnitList[i]) {
        // Calculate Unit Position
        // Publish Unit Position to Server
      }
    }
  }
}

function TacticalNavigationServer() {

  this.TacticalUnitList = [];
  this.TacticalFactionList = [];
  
  
  this.TacticalUnitPool = [];
  this.DistributionIndex = 0;
  
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
  
  
  this.addTacticalFaction = function(){
    var wNewFaction = new TacticalUnit();
    
    var isAdded = false;
    for(var i=0; i < this.TacticalFactionList.length; ++i){
      if (null == this.TacticalFactionList[i]){
        this.TacticalFactionList[i] = wNewFaction;
        isAdded = true;
        break;
      }
    }
    
    if (false == isAdded) {
      this.TacticalFactionList.push(wNewFaction);
    }
    return wNewFaction;
  }
  
  this.removeTacticalFaction = function(iTacticalFactionID){
    for(var i=0; i < this.TacticalFactionList.length; ++i){
      if (iTacticalFactionID == this.TacticalFactionList[i].TacticalFactionID){
        this.TacticalFactionList[i] = null;
        break;
      }
    }
  }
  
  this.processTime = function(iDeltaTime = 0.0) {
    // Nothing to do without factions
    if (0 == this.TacticalFactionList.length) {
      return;
    }
    
    // Distribute Units
    
    

    this.DistributionIndex++;
    this.DistributionIndex %= this.TacticalFactionList.length;
    
    // Process Add Factions
    for(var i=0; i < this.TacticalFactionList.length; ++i){
      this.TacticalFactionList[i].processFaction(iDeltaTime, this);
    }
  }
  
}


-->
