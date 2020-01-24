
import DomTouchControl from "./DomTouchControl.mjs"

export function GamePadInput(iKnobWidth, iKnobHeight, iX_Center, iY_Center, iConstraints, iDrawFunction ) {

  var wGamePadInput_Contraints = {
    x_recenter : null != iConstraints.x_recenter? iConstraints.x_recenter : true,
    y_recenter : null != iConstraints.y_recenter? iConstraints.y_recenter : true,
    x_restriction : null != iConstraints.x_restriction? iConstraints.x_restriction : [false, false],
    y_restriction : null != iConstraints.y_restriction? iConstraints.y_restriction : [false, false],
    percentage : null != iConstraints.percentage? iConstraints.percentage : false,
    radius : null != iConstraints.radius? iConstraints.radius : -1,
    x_center : iX_Center,
    y_center : iY_Center,
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
      x_center : 0,
      y_center : 0,
      radius : -1.0,
      dx : 0,
      dy : 0,
      active : false,
      active_control_id : 0,
      height : iKnobHeight,
      width : iKnobWidth,
      constraints : wGamePadInput_Contraints,
      drawfunction : iDrawFunction,
    },

    Canvas : wCanvas,
    ControlPoints : new DomTouchControl.DomTouchControl(wDOM),
    Iteration : function() {

      this.Canvas.width = this.Canvas.parentNode.clientWidth - 2;
      this.Canvas.height = this.Canvas.parentNode.clientHeight - 2;
      
      var wXCenter = this.Knob.constraints.percentage ? (this.Knob.constraints.x_center/100)*this.Canvas.width : this.Knob.constraints.x_center;
      var wYCenter = this.Knob.constraints.percentage ? (this.Knob.constraints.y_center/100)*this.Canvas.height : this.Knob.constraints.y_center;
      this.Knob.x_center = wXCenter;
      this.Knob.y_center = wYCenter;

      var wHalfWidth = this.Knob.width/2;
      var wHalfHeight = this.Knob.height/2;

      var wXLimit = [wHalfWidth, wXCenter ,this.Canvas.width - wHalfWidth];
      var wYLimit = [wHalfHeight, wYCenter ,this.Canvas.height - wHalfHeight];
  
      if (true == this.Knob.constraints.x_restriction[0]) {
        wXLimit[0] = wXCenter;
      } 
      if (true == this.Knob.constraints.x_restriction[1]) {
        wXLimit[2] = wXCenter;
      } 

      if (true == this.Knob.constraints.y_restriction[0]) {
        wYLimit[0] = wYCenter;
      } 
      if (true == this.Knob.constraints.y_restriction[1]) {
        wYLimit[2] = wYCenter;
      } 

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
              this.Knob.dx = wCPList[j].x - wXCenter;
              this.Knob.dy = wCPList[j].y - wYCenter;              
            }
          }
        }

        if (false == wIsFound) {
          this.Knob.active = false;
        }
      }
      else {

        var wCPList = this.ControlPoints.mControlPointList;

        var wIsFound = false;

        for (var j = 0; j < wCPList.length ; ++j) {

          if (false == wCPList[j].active){
            continue;
          }

          var wXDelta = wCPList[j].x - wXCenter;
          var wYDelta = wCPList[j].y - wYCenter;
          
          var wDxDelta = Math.abs(this.Knob.dx - wXDelta);
          var wDyDelta = Math.abs(this.Knob.dy - wYDelta);
          
          if ((wHalfWidth < wDxDelta) || (wHalfHeight < wDyDelta)) {
            continue;
          }

          wIsFound = true;
          this.Knob.active = true;
          this.Knob.active_control_id = wCPList[j].identifier;
          this.Knob.dx = wXDelta;
          this.Knob.dy = wYDelta; 
  
        }        

        if (wIsFound == false) {
          this.Knob.active = false;
          if (true == this.Knob.constraints.x_recenter) {
            this.Knob.dx *= 0.2;
          }
          
          if (true == this.Knob.constraints.y_recenter) {
            this.Knob.dy *= 0.2;
          } 
        }
      }
      
      this.Knob.x = this.Knob.dx + wXCenter;
      this.Knob.y = this.Knob.dy + wYCenter;

      if (this.Knob.x < wXLimit[0]) {
        this.Knob.x = wXLimit[0];
      }
      
      if (this.Knob.x > wXLimit[2]) {
        this.Knob.x = wXLimit[2];
      }
      
      if (this.Knob.y < wYLimit[0]) {
        this.Knob.y = wYLimit[0];
      }
      
      if (this.Knob.y > wYLimit[2]) {
        this.Knob.y = wYLimit[2];
      }
      
      this.Knob.dx = this.Knob.x - wXCenter;
      this.Knob.dy = this.Knob.y - wYCenter;
  
      if (this.Knob.constraints.radius > 1) {
        var wSize = this.Canvas.height < this.Canvas.width ? this.Canvas.height : this.Canvas.width;
        wSize /= 2;
        var wRefRadius = this.Knob.constraints.percentage ? (this.Knob.constraints.radius/100)*wSize : this.Knob.constraints.radius;
        this.Knob.radius = wRefRadius;
        
        var wSqMag = this.Knob.dx*this.Knob.dx + this.Knob.dy*this.Knob.dy;
        var wSqRefMag = wRefRadius*wRefRadius;
        
        if (wSqRefMag < wSqMag) {
          var wR = Math.sqrt(wSqMag);
          var wScale = wRefRadius/wR;
          this.Knob.dx *= wScale;
          this.Knob.dy *= wScale;
        } 
      }
      else {
        this.Knob.radius = -1;    
      }

      this.Knob.x = this.Knob.dx + wXCenter;
      this.Knob.y = this.Knob.dy + wYCenter;

      var wXDenominator = 1.0;
      if (this.Knob.radius > 0 ) {
        wXDenominator = this.Knob.radius;
      }
      else if (this.Knob.dx > 0) {
        wXDenominator = wXLimit[2] - wXLimit[1];
      }
      else {
        wXDenominator = wXLimit[1] - wXLimit[0];  
      }
      
      var wYDenominator = 1.0;
      if (this.Knob.radius > 0 ) {
        wYDenominator = this.Knob.radius;
      }
      else if (this.Knob.dy > 0) {
        wYDenominator = wYLimit[2] - wYLimit[1];
      }
      else {
        wYDenominator = wYLimit[2] - wYLimit[1];
      }

      if (wXDenominator < 1) wXDenominator = 1;
      if (wYDenominator < 1) wYDenominator = 1;

      this.GamePad_State.x = this.Knob.dx / wXDenominator;
      this.GamePad_State.y = this.Knob.dy / wYDenominator;
      this.GamePad_State.active = this.Knob.active;

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