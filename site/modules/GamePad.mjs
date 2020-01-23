function ControlPointStructure ( iId ) {
  return {
    x : 0.0,
    y : 0.0,
    active : false,
    id : iId
  }
}

function ControlPoints ( iDOM){

  this.mDOM = iDOM;
  this.mControlPointList = [];

  this.mControlPointList.push(ControlPointStructure( -1 ));
  this.mControlPointList[0].active = false;
  this.mControlPointList[0].x = 0.0;
  this.mControlPointList[0].y = 0.0;


  // Mouse Event Handling ----------------
  this.mouseUp = function (evt) {
    this.mControlPointList[0].active = false;
    this.processMouse(evt);
  }
  
  this.mouseDown = function (evt) {
    this.mControlPointList[0].active = true;
    this.processMouse(evt);
  }

  this.mouseMove = function(evt) {
    this.processMouse(evt);
  }

  // Mouse Event Processing ----------------

  this.processMouse = function(evt) {
    if (!evt) evt = event;
    evt.preventDefault();
    this.mControlPointList[0].x = evt.pageX - this.mDOM.offsetLeft;
    this.mControlPointList[0].y = evt.pageY - this.mDOM.offsetTop;
  }

  // Touch Event Handling ----------------

  this.touchDown = function(evt) {
    this.processTouch(evt);
  }

  this.touchUp = function(evt) {
    this.processTouch(evt);
  }

  this.touchMove = function(evt) {
    this.processTouch(evt);
  }

  // Touch Event Processing ----------------
  
  this.processTouch = function(evt){

    if (!evt) evt = event;
    evt.preventDefault();
  
    for (var i = 1; i < this.mControlPointList.length ; ++i) {
      this.mControlPointList[i].active = false;
    }
  
    for (var i = 0; i < evt.targetTouches.length ; ++i) {

      var wXVal = evt.targetTouches[i].pageX - this.mDOM.offsetLeft;
      var wYVal = evt.targetTouches[i].pageY - this.mDOM.offsetTop;

      var wIsSet = false;
      for (var j = 1; j < evt.targetTouches.length ; ++j) {
        if( this.mControlPointList[j].id == evt.targetTouches[i].identifier) {
          this.mControlPointList[j].active = true;
          this.mControlPointList[j].x = wXVal;
          this.mControlPointList[j].y = wYVal;
          wIsSet = true;
          break;
        }
      }
  
      if(wIsSet == false) {
        var wNewPoint = ControlPointStructure( evt.targetTouches[i].identifier);
        wNewPoint.active = true;
        wNewPoint.x = wXVal;
        wNewPoint.y = wYVal;

        this.mControlPointList.push(wNewPoint);
      }
            
    }
  }
  
  this.mDOM.addEventListener("mousedown", this.mouseDown.bind(this), false);
  this.mDOM.addEventListener("mousemove", this.mouseMove.bind(this), false);
  this.mDOM.addEventListener("mouseup", this.mouseUp.bind(this), false);
  this.mDOM.addEventListener("mouseenter", this.mouseUp.bind(this), false);
  this.mDOM.addEventListener("mouseleave", this.mouseUp.bind(this), false);

  this.mDOM.addEventListener("touchstart", this.touchDown.bind(this), false);
  this.mDOM.addEventListener("touchend", this.touchUp.bind(this), false);
  this.mDOM.addEventListener("touchmove", this.touchMove.bind(this), false);
  this.mDOM.addEventListener("touchcancel", this.touchUp.bind(this), false);
}

export function GamePadInput(iKnobWidth, iKnobHeight, iX_Center, iY_Center, iConstraints, iDrawFunction ) {

  var wGamePadInput_Contraints = {
    x_recenter : null != iConstraints.x_recenter? iConstraints.x_recenter : true,
    y_recenter : null != iConstraints.y_recenter? iConstraints.y_recenter : true,
    x_restriction : null != iConstraints.x_restriction? iConstraints.x_restriction : [false, false],
    y_restriction : null != iConstraints.y_restriction? iConstraints.y_restriction : [false, false],
    percentage : null != iConstraints.percentage? iConstraints.percentage : false,
    radius : null != iConstraints.radius? iConstraints.radius : -1,
  }

  var wDOM = document.createElement("div");
  var wCanvas = document.createElement("canvas");

  wDOM.append(wCanvas);

  wDOM.GamPad_Struct = {
    GamePad_State : {
      x : 0.0,
      y : 0.0,
      active : false
    },
    Knob : {
      x_center : iX_Center,
      y_center : iY_Center,
      x : iX_Center,
      y : iY_Center,
      active : false,
      active_control_id : 0,
      height : iKnobHeight,
      width : iKnobWidth,
      constraints : wGamePadInput_Contraints,
      drawfunction : iDrawFunction,
    },

    Canvas : wCanvas,
    ControlPoints : new ControlPoints(wDOM),
    Iteration : function() {

      this.Canvas.width = this.Canvas.parentNode.clientWidth - 2;
      this.Canvas.height = this.Canvas.parentNode.clientHeight - 2;
      
      var wHalfWidth = this.Knob.width/2;
      var wHalfHeight = this.Knob.height/2;
      var wXCenter = this.Knob.constraints.percentage ? (this.Knob.x_center/100)*this.Canvas.width : this.Knob.x_center;
      var wYCenter = this.Knob.constraints.percentage ? (this.Knob.y_center/100)*this.Canvas.height : this.Knob.y_center;
      
      if (true == this.Knob.active) {  
        var wCPList = this.ControlPoints.mControlPointList;

        var wIsFound = false;
        for (j = 0; j < wCPList.length ; ++j) {
          if (this.Knob.active_control_id == wCPList[j].identifier) {
            wIsFound = true;
            if (false == wCPList[j].active) {
              this.Knob.active = false;
            }
            else {
              this.Knob.active = true;
              this.Knob.x = wCPList[j].x;
              this.Knob.y = wCPList[j].y;     
            }
          }
        }

        if (false == wIsFound) {
          this.Knob.active = false;
        }
      }
      else {
        
        var wXUpperLimit = this.Knob.x - wHalfWidth;
        var wXLowerLimit = this.Knob.x + wHalfWidth;
        
        var wYUpperLimit = this.Knob.y - wHalfHeight;
        var wYLowerLimit = this.Knob.y + wHalfHeight;

        var wCPList = this.ControlPoints.mControlPointList;

        var wIsFound = false;

        for (var j = 0; j < wCPList.length ; ++j) {

          if (false == wCPList[j].active){
            continue;
          }

          if ((wCPList[j].x < wXUpperLimit) || (wCPList[j].x > wXLowerLimit)) {
            continue;
          }
          
          if ((wCPList[j].y < wYUpperLimit) || (wCPList[j].y > wYLowerLimit)) {
            continue;
          }

          wIsFound = true;
          this.Knob.active = true;
          this.Knob.active_control_id = wCPList[j].identifier;
          this.Knob.x = wCPList[j].x;
          this.Knob.y = wCPList[j].y; 
        }        

        if (wIsFound == false) {
          this.Knob.active = false;
          if (true == this.Knob.constraints.x_recenter) {
            this.Knob.x += 0.75*(wXCenter - this.Knob.x);
          }
          
          if (true == this.Knob.constraints.y_recenter) {
            this.Knob.y += 0.75*(wYCenter - this.Knob.y);
          } 
        }
      }
  
      if (true == this.Knob.constraints.x_restriction[0]) {
        if (this.Knob.x < wXCenter) {
          this.Knob.x = wXCenter;
        }
      } 
      if (true == this.Knob.constraints.x_restriction[1]) {
        if (this.Knob.x > wXCenter) {
          this.Knob.x = wXCenter;
        }
      } 
      if (true == this.Knob.constraints.y_restriction[0]) {
        if (this.Knob.y < wYCenter) {
          this.Knob.y = wYCenter;
        }
      } 
      if (true == this.Knob.constraints.x_restriction[1]) {
        if (this.Knob.y > wYCenter) {
          this.Knob.y = wYCenter;
        }
      } 

      if (this.Knob.x < wHalfWidth) {
        this.Knob.x = wHalfWidth;
      }
      
      if (this.Knob.x > this.Canvas.width - wHalfWidth) {
        this.Knob.x = this.Canvas.width - wHalfWidth;
      }
      
      if (this.Knob.y < wHalfHeight) {
        this.Knob.y = wHalfHeight;
      }
      
      if (this.Knob.y > this.Canvas.height - wHalfHeight) {
        this.Knob.y = this.Canvas.height - wHalfHeight;
      }
      
      if (this.Knob.constraints.radius > 1) {
        var wXDelta = this.Knob.x - wXCenter;
        var wYDelta = this.Knob.y - wYCenter;
        var wSqMag = wXDelta*wXDelta + wYDelta*wYDelta;
        var wSqRefMag = this.Knob.constraints.radius*this.Knob.constraints.radius;
        
        if (wSqRefMag < wSqMag) {
          var wR = Math.sqrt(wSqMag);
          var wScale = this.Knob.constraints.radius/wR;
          this.Knob.x = wXDelta*wScale + wXCenter;
          this.Knob.y = wYDelta*wScale + wYCenter;
        } 

        var wXGain = this.Knob.x - wXCenter;
        var wYGain = this.Knob.y - wYCenter;

        this.GamePad_State.x = wXGain / this.Knob.constraints.radius;
        this.GamePad_State.y = wYGain / this.Knob.constraints.radius;
        this.GamePad_State.active = this.Knob.active;
      }
      else {
        var wXGain = this.Knob.x - wXCenter;
        var wYGain = this.Knob.y - wYCenter;
        
        
        var wXDenominator = 1.0;
        if (wXGain > 0) {
          wXDenominator = this.Canvas.width - wHalfWidth - wXCenter;
        }
        else {
          wXDenominator = wXCenter - wHalfWidth;  
        }
        
        var wYDenominator = 1.0;
        if (wYGain > 0) {
          wYDenominator = this.Canvas.height - wHalfHeight - wYCenter;
        }
        else {
          wYDenominator = wYCenter - wHalfHeight;  
        }
  
        if (wXDenominator < 1) wXDenominator = 1;
        if (wYDenominator < 1) wYDenominator = 1;
  
        this.GamePad_State.x = wXGain / wXDenominator;
        this.GamePad_State.y = wYGain / wYDenominator;
        this.GamePad_State.active = this.Knob.active;
      }

      if (null != this.Knob.drawfunction) {
        this.Knob.drawfunction(this.Canvas, this.Knob );
      }
      
      window.requestAnimationFrame(this.Iteration.bind(this));
    },
  }

  wDOM.GamePad_State = wDOM.GamPad_Struct.GamePad_State

  wDOM.GamPad_Struct.Iteration();
  return wDOM;
}

export default {
  GamePadInput : GamePadInput
}