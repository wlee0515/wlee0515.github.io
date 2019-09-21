<!--

var EntityCount = 0;

function Entity () {
  
  this.EntityID = ++EntityCount;
  
  this.EntityPosition = new matrix(3,1);
  this.EntityVelocity = new matrix(3,1);
  this.EntityAcceleration = new matrix(3,1);
  
  this.EntityAngularPosition = new matrix(3,1);
  this.EntityAngularVelocity = new matrix(3,1);
  this.EntityAngularAcceleration = new matrix(3,1);
  
  this.InputEntityPosition = null;
  this.InputEntityVelocity = null;
  this.InputEntityAcceleration = null;
  
  this.InputEntityAngularPosition = null;
  this.InputEntityAngularVelocity = null;
  this.InputEntityAngularAcceleration = null;
  
}

function EntityPositionManager() {
  
  this.EntityPosition = new matrix(3,0);
  this.EntityVelocity = new matrix(3,0);
  this.EntityAcceleration = new matrix(3,0);
  
  this.EntityAngularPosition = new matrix(3,0);
  this.EntityAngularVelocity = new matrix(3,0);
  this.EntityAngularAcceleration = new matrix(3,0);
  
  this.EntityDelta_X;
  this.EntityDelta_Y;
  this.EntityDelta_Z;
  
  this.EntityRange;
  this.EntityBearing;
  
  this.EntityList = [];
  
  this.getEntityList = function () {
    return this.EntityList;
  }
  
  this.addEntity = function(iEntity , x=0, y=0,z=0,phi=0, theta=0,psi=0) {
    for(var i = 0; i < this.EntityList.length; ++i){
      if (null != this.EntityList[i]){
        if (this.EntityList[i].EntityID == iEntity.EntityID){
          return;
        }
      }
    }
    var wIndex = -1;
    for(var i = 0; i < this.EntityList.length; ++i){
      if (null == this.EntityList[i]){
        this.EntityList[i] = iEntity;
        wIndex = i;
        break;
      }
    }
    
    if (wIndex == -1){
      wIndex = this.EntityList.length;
      this.EntityList.push(iEntity); 
   
      this.EntityPosition.addColumn(1);
      this.EntityVelocity.addColumn(1);
      this.EntityAcceleration.addColumn(1);
      this.EntityAngularPosition.addColumn(1);
      this.EntityAngularVelocity.addColumn(1);
      this.EntityAngularAcceleration.addColumn(1);
    }
    
    this.EntityPosition.setColumn(wIndex, [x,y,z]);
    this.EntityVelocity.setColumn(wIndex, [0,0,0]);
    this.EntityAcceleration.setColumn(wIndex, [0,0,0]);
    
    
    this.EntityAngularPosition.setColumn(wIndex, [phi,theta,psi]);
    this.EntityAngularVelocity.setColumn(wIndex, [0,0,0]);
    this.EntityAngularAcceleration.setColumn(wIndex, [0,0,0]);
    
  }
  
  this.removeEntity = function(iEntity) {
    var wIndex = -1;
    for(var i = 0; i < this.EntityList.length; ++i){
      if (null != this.EntityList[i]){
        if (this.EntityList[i].EntityID == iEntity.EntityID){
          wIndex = i;
          this.EntityList[i] = null;
          break;
        }
      }
    }
    
    if (wIndex != -1){
      
    this.EntityPosition.setColumn(wIndex, [0,0,0]);
    this.EntityVelocity.setColumn(wIndex, [0,0,0]);
    this.EntityAcceleration.setColumn(wIndex, [0,0,0]);
    
    this.EntityAngularPosition.setColumn(wIndex, [0,0,0]);
    this.EntityAngularVelocity.setColumn(wIndex, [0,0,0]);
    this.EntityAngularAcceleration.setColumn(wIndex, [0,0,0]);
    
    }
  }
  
  this.repositionEntity = function(iEntity , x=0, y=0,z=0,phi=0, theta=0,psi=0) {
    var wIndex = -1;
    for(var i = 0; i < this.EntityList.length; ++i){
      if (null != this.EntityList[i]){
        if (this.EntityList[i].EntityID == iEntity.EntityID){
          wIndex = i;
        }
      }
    }
    
    if (wIndex != -1)
    {
      this.EntityPosition.setColumn(wIndex, [x,y,z]);
      this.EntityVelocity.setColumn(wIndex, [0,0,0]);
      this.EntityAcceleration.setColumn(wIndex, [0,0,0]);
      
      
      this.EntityAngularPosition.setColumn(wIndex, [phi,theta,psi]);
      this.EntityAngularVelocity.setColumn(wIndex, [0,0,0]);
      this.EntityAngularAcceleration.setColumn(wIndex, [0,0,0]);
    }
  }
  
  this.integrate = function(iDeltatime = 0.0){
    
    for(var i = 0; i < this.EntityList.length; ++i){
      var wEntity = this.EntityList[i];
      if (null != this.EntityList[i]){
        
        if (null != wEntity.InputEntityPosition) {
          this.EntityPosition.setColumn(i, wEntity.InputEntityPosition);
          wEntity.InputEntityPosition = null;
        }
        
        if (null != wEntity.InputEntityVelocity) {
          this.EntityVelocity.setColumn(i, wEntity.InputEntityVelocity);
          wEntity.InputEntityVelocity = null;
        }
        
        if (null != wEntity.InputEntityAcceleration) {
          this.EntityAcceleration.setColumn(i, wEntity.InputEntityAcceleration);
          wEntity.InputEntityAcceleration = null;
        }
        
        if (null != wEntity.InputEntityAngularPosition) {
          this.EntityAngularPosition.setColumn(i, wEntity.InputEntityAngularPosition);
          wEntity.InputEntityAngularPosition = null;
        }
        
        if (null != wEntity.InputEntityAngularVelocity) {
          this.EntityAngularVelocity.setColumn(i, wEntity.InputEntityAngularVelocity);
          wEntity.InputEntityAngularVelocity = null;
        }
        
        if (null != wEntity.InputEntityAngularAcceleration) {
          this.EntityAngularAcceleration.setColumn(i, wEntity.InputEntityAngularAcceleration);
          wEntity.InputEntityAngularAcceleration = null;
        }
      }
    }
    
    var wDV = new matrix(0,0);
    var wDP = new matrix(0,0);
    wDV.copy(this.EntityAcceleration);
    wDV.scale(iDeltatime);
    
    wDP.copy(this.EntityVelocity);
    wDP.scale(iDeltatime);
    
    this.EntityVelocity.add(wDV);
    
    wDV.scale(iDeltatime*0.5);
    wDP.add(wDV);
    
    this.EntityPosition.add(wDP);
    
    wDV.copy(this.EntityAngularAcceleration);
    wDV.scale(iDeltatime);
    
    wDP.copy(this.EntityAngularVelocity);
    wDP.scale(iDeltatime);
    
    this.EntityAngularVelocity.add(wDV);
    
    wDV.scale(iDeltatime*0.5);
    wDP.add(wDV);
    
    this.EntityAngularPosition.add(wDP);
    
    this.EntityAngularPosition.applyFunctionToCell(normalizeAngle);
    
    
    for(var i = 0; i < this.EntityList.length; ++i){
      var wEntityRef = this.EntityList[i];
      wEntityRef.EntityPosition.setColumn(0, this.EntityPosition.getColumn(i))
      wEntityRef.EntityVelocity.setColumn(0, this.EntityVelocity.getColumn(i))
      wEntityRef.EntityAcceleration.setColumn(0, this.EntityAcceleration.getColumn(i))
      wEntityRef.EntityAngularPosition.setColumn(0, this.EntityAngularPosition.getColumn(i))
      wEntityRef.EntityAngularVelocity.setColumn(0, this.EntityAngularVelocity.getColumn(i))
      wEntityRef.EntityAngularAcceleration.setColumn(0, this.EntityAngularAcceleration.getColumn(i))
    }
  }
  
  this.calculateEntityRangeAndBearing = function(iLocation=[0,0,0]){
    
    var wLocation = new matrix(3,1);
    wLocation.setColumn(0, iLocation);
    
    var wColumnExpand = new matrix(1,this.EntityPosition.columns,1);
    wLocationExpand = wLocation.getMultiply(wColumnExpand);
    
    var wDelta = this.EntityPosition.getSubtraction(wLocationExpand);
  
    var wRange = wDelta.dotColumn(wDelta);
    wRange.applyFunctionToCell(Math.sqrt);
    
    var wBearing = applyColumnCalculation( function (iColumn) { return Math.atan2(iColumn[1],iColumn[0]);} , wDelta)
    
    var wList = [];
    for (var i = 0; i < this.EntityList.length; ++i){
      if (this.EntityList[i] != null){
        var wObj = {
          EntityID : this.EntityList[i].EntityID,
          Range : wRange.get(0,i),
          Bearing : wBearing.get(0,i),
          Dx : wDelta.get(0,i),
          Dy : wDelta.get(1,i),
          Dz : wDelta.get(2,i)
        }
        wList.push(wObj);
      }
    }
    return wList;
  }
    
    
    
  this.calculateDeltaPosition = function(){
    
    var wXAxis = new matrix(1,3);
    wXAxis.set(0,0,1);
    
    var wYAxis = new matrix(1,3);
    wYAxis.set(0,1,1);
    
    var wZAxis = new matrix(1,3);
    wZAxis.set(0,2,1);
    
    var wPositionX = wXAxis.getMultiply(this.EntityPosition);
    var wPositionY = wYAxis.getMultiply(this.EntityPosition);
    var wPositionZ = wZAxis.getMultiply(this.EntityPosition);
    
    
    var wRowExpand = new matrix(this.EntityPosition.columns,1,1);
    var wColumnExpand = new matrix(1,this.EntityPosition.columns,1);
    
    this.EntityDelta_X = wRowExpand.getMultiply( wPositionX);
    this.EntityDelta_Y = wRowExpand.getMultiply( wPositionY);
    this.EntityDelta_Z = wRowExpand.getMultiply( wPositionZ);
    
    var wP2_X = wPositionX.getTranspose().getMultiply(wColumnExpand);
    var wP2_Y = wPositionY.getTranspose().getMultiply(wColumnExpand);
    var wP2_Z = wPositionZ.getTranspose().getMultiply(wColumnExpand);
    
    this.EntityDelta_X.subtract(wP2_X);
    this.EntityDelta_Y.subtract(wP2_Y);
    this.EntityDelta_Z.subtract(wP2_Z);
       
    this.EntityRange  = new matrix(this.EntityPosition.columns,this.EntityPosition.columns,0);
    this.EntityRange.add(this.EntityDelta_X.getHadamard_product(this.EntityDelta_X));
    this.EntityRange.add(this.EntityDelta_Y.getHadamard_product(this.EntityDelta_Y));
    this.EntityRange.add(this.EntityDelta_Z.getHadamard_product(this.EntityDelta_Z));
    this.EntityRange.applyFunctionToCell(Math.sqrt);
    
    this.EntityBearing = useMatrixAsArg2(Math.atan2, this.EntityDelta_Y, this.EntityDelta_X);
  
  }
  
}
-->