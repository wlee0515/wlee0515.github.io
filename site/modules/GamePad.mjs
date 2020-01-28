
import DomTouchControl from "./DomTouchControl.mjs"


function DrawAnaogStick( iCanvasDOM, iKnob) {
  
  var wCtx = iCanvasDOM.getContext("2d");
  wCtx.strokeStyle = "lime";
  if (iKnob.radius > 0) {
    wCtx.beginPath();
    wCtx.arc(iKnob.x_center, iKnob.y_center, iKnob.radius, 0, 2 * Math.PI);
    wCtx.closePath();
    wCtx.stroke();
  }
  else {    
    
    wCtx.strokeRect(iKnob.x_frame_limts[0], iKnob.y_frame_limts[0] , iKnob.frame_width, iKnob.frame_height );
    
  }

  if (true == iKnob.active) {
    wCtx.strokeStyle = "red";
    wCtx.fillStyle = "red";
    wCtx.lineWidth = 1;
  }
  else {
    wCtx.strokeStyle = "lime";
    wCtx.fillStyle = "lime";
    wCtx.lineWidth = 1;
  }
  
  if (iKnob.radius > 0) {
    wCtx.beginPath();
    wCtx.arc(iKnob.x_center, iKnob.y_center, iKnob.radius + 0.5*iKnob.width, 0, 2 * Math.PI);
    wCtx.closePath();
    wCtx.stroke();

    wCtx.beginPath();
    wCtx.arc(iKnob.x, iKnob.y, 0.5*iKnob.width, 0, 2 * Math.PI);
    wCtx.closePath();
    wCtx.stroke();
    wCtx.fill();
  }
  else {
    wCtx.strokeRect(iKnob.x_frame_limts[0], iKnob.y_frame_limts[0] , iKnob.frame_width, iKnob.frame_height );
    wCtx.fillRect(iKnob.x - 0.5* iKnob.width, iKnob.y - 0.5*iKnob.height ,iKnob.width,iKnob.height);
    
  }
}

function DefaultDrawFunction( iCanvasDOM, iKnob) {
  
  var wCtx = iCanvasDOM.getContext("2d");
  wCtx.clearRect(0, 0, iCanvasDOM.width, iCanvasDOM.height);

  for (var wi = 0; wi < iKnob.length; ++ wi) {
    DrawAnaogStick( iCanvasDOM, iKnob[wi]);
  }
}

export const GamePadInputType = {
  eBASE : 0,
  eBUTTON : 1,
  eSLIDER : 2,
  eSWITCH : 3,
  eRADIAL_SWITCH : 4,
  eRADIAL_SLIDER : 5,
  eANALOG_STICK : 6
}

var GamePadExternal = {

  InputType: {
    baseInputType: function (iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter) {

      return {
        mInput_State: {
          active: false
        },

        InputType : GamePadInputType.eBASE,

        x : 0,
        y : 0, 
        dx: 0,
        dy: 0,
        x_center: iCenterX,
        y_center: iCenterY,
        active: false,
        active_control_id: -1,
        height: iKnobHeight,
        width: iKnobWidth,
        x_frame_limts : [0 ,0.0],
        y_frame_limts : [0 ,0.0], 
        frame_height: 0,
        frame_width: 0,
        constraints: {
          x_center : iCenterX,
          y_center : iCenterY,
          percentage : null != iParameter.percentage? iParameter.percentage : false,
          x_recenter : null != iParameter.x_recenter? iParameter.x_recenter : true,
          y_recenter : null != iParameter.y_recenter? iParameter.y_recenter : true,
        },

        calculateFrameLimits : function(iCanvasDOM) {

          var wHalfWidth = this.width/2;
          var wHalfHeight = this.height/2;
    
          this.x_frame_limts = [wHalfWidth ,iCanvasDOM.width - wHalfWidth];
          this.y_frame_limts = [wHalfHeight ,iCanvasDOM.height - wHalfHeight]; 
    
          this.frame_width  = this.x_frame_limts[1] - this.x_frame_limts[0];
          this.frame_height = this.y_frame_limts[1] - this.y_frame_limts[0];

          this.x_center = this.constraints.percentage ? (this.constraints.x_center/100)*this.frame_width + this.x_frame_limts[0]: this.constraints.x_center;
          this.y_center = this.constraints.percentage ? (this.constraints.y_center/100)*this.frame_height + this.y_frame_limts[0]: this.constraints.y_center;

          this.x = this.dx + this.x_center;
          this.y = this.dy + this.y_center;
        },

        processHit: function (iControlPointList) {

          if (true == this.active) {
            var wIsFound = false;
            for (j = 0; j < iControlPointList.length; ++j) {
              if (this.active_control_id == iControlPointList[j].identifier) {
                wIsFound = true;
                if (false == iControlPointList[j].active) {
                  this.active = false;
                }
                else {
                  
                  iControlPointList[j].available = false;
                  this.active = true;
                  this.x = iControlPointList[j].x;
                  this.y = iControlPointList[j].y;
                }
              }
            }

            if (false == wIsFound) {
              this.active = false;
            }
          }
          else {

            var wIsFound = false;
            var wHalfWidth = this.width/2;
            var wHalfHeight = this.height/2;  

            for (var j = 0; j < iControlPointList.length; ++j) {

              if (false == iControlPointList[j].active) {
                continue;
              }
              
              if (false == iControlPointList[j].available) {
                continue;
              }

              var wDx = Math.abs(this.x - iControlPointList[j].x);
              var wDy = Math.abs(this.y - iControlPointList[j].y);

              if ((wHalfWidth < wDx) || (wHalfHeight < wDy)) {
                continue;
              }

              iControlPointList[j].available = false;

              wIsFound = true;
              this.active = true;
              this.active_control_id = iControlPointList[j].identifier;
              this.x = iControlPointList[j].x;
              this.y = iControlPointList[j].y;
            }

            if (wIsFound == false) {
              this.active = false;
            }
          }
          
          this.dx = this.x - this.x_center;
          this.dy = this.y - this.y_center;

          if (false == this.active) {
            if (true == this.constraints.x_recenter) {
              this.dx *= 0.2;
            }
            
            if (true == this.constraints.y_recenter) {
              this.dy *= 0.2;
            }   
          }
          
          this.x = this.dx + this.x_center;
          this.y = this.dy + this.y_center;
        },
        
        processFrameLimits: function () {
          
          if (this.x < this.x_frame_limts[0]) {
            this.x = this.x_frame_limts[0];
          }
          
          if (this.x > this.x_frame_limts[1]) {
            this.x = this.x_frame_limts[1];
          }
          
          if (this.y < this.y_frame_limts[0]) {
            this.y = this.y_frame_limts[0];
          }
          
          if (this.y > this.y_frame_limts[1]) {
            this.y = this.y_frame_limts[1];
          }

          this.dx = this.x - this.x_center;
          this.dy = this.y - this.y_center;
        },

        processConstraints: [],

        iteration: function (iCanvasDOM, iControlPointList) {
          
          this.calculateFrameLimits(iCanvasDOM);
          this.processHit(iControlPointList);
          this.processFrameLimits();
          for (var wi = 0; wi < this.processConstraints.length; ++ wi){
            this.processConstraints[wi](iCanvasDOM, iControlPointList);
          }
        }
      }
    },

    button: function (iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter) {

      var wInput = GamePadExternal.InputType.baseInputType(iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter);
      wInput.InputType = GamePadInputType.eBUTTON;

      wInput.processConstraints.push(function (iCanvasDOM, iControlPointList) {
        this.x = this.x_center;
        this.y = this.y_center;
        this.dx = 0;
        this.dy = 0;
      }.bind(wInput))

      return wInput;
    },

    slider: function (iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter) {
      
      var wInput = GamePadExternal.InputType.baseInputType(iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter);
      wInput.InputType = GamePadInputType.eSLIDER;

      wInput.constraints.state_count = iParameter.state_count > 1.0 ? Math.floor(iParameter.state_count) : 1;
      wInput.constraints.forward_Dx = null != iParameter.forward_Dx ? iParameter.forward_Dx : 0;
      wInput.constraints.forward_Dy = null != iParameter.forward_Dy ? iParameter.forward_Dy : 0;
      wInput.constraints.backward_Dx = null != iParameter.backward_Dx ? iParameter.backward_Dx : 0;
      wInput.constraints.backward_Dy = null != iParameter.backward_Dy ? iParameter.backward_Dy : 0;
      
      
      wInput.processConstraints.push( function (iCanvasDOM, iControlPointList) {

        var wFdTrack = {
          x :  this.constraints.percentage ? (this.constraints.forward_Dx/100)*this.frame_width : this.constraints.forward_Dx,
          y :  this.constraints.percentage ? (this.constraints.forward_Dy/100)*this.frame_height : this.constraints.forward_Dy
        };

        var wBdTrack = {
          x :  this.constraints.percentage ? (this.constraints.backward_Dx/100)*this.frame_width : this.constraints.backward_Dx,
          y :  this.constraints.percentage ? (this.constraints.backward_Dy/100)*this.frame_height : this.constraints.backward_Dy
        };

        var wFdEnd = {
          x : wFdTrack.x + this.x_center,
          y : wFdTrack.y + this.y_center
        };

        var wBdEnd = {
          x : wBdTrack.x + this.x_center,
          y : wBdTrack.y + this.y_center
        };

        this.slider_x_path = [wBdEnd.x, this.x_center, wFdEnd.x];
        this.slider_y_path = [wBdEnd.y, this.y_center, wFdEnd.y];

        var wFdDot = this.dx*wFdTrack.x + this.dy*wFdTrack.y;
        var wFdSqMag = wFdTrack.x*wFdTrack.x + wFdTrack.y*wFdTrack.y;
        var wFdRatio = wFdDot / wFdSqMag;
        var wFdRatioNorm = wFdRatio > 1.0 ? 1.0 : wFdRatio < 0.0 ? 0.0 : wFdRatio;

        var wBdDot = this.dx*wBdTrack.x + this.dy*wBdTrack.y;
        var wBdSqMag = wBdTrack.x*wBdTrack.x + wBdTrack.y*wBdTrack.y;
        var wBdRatio = wBdDot / wBdSqMag;
        var wBdRatioNorm = wBdRatio > 1.0 ? 1.0 : wBdRatio < 0.0 ? 0.0 : wBdRatio;

        var wFdProj = {
          x: wFdRatioNorm*wFdTrack.x,
          y: wFdRatioNorm*wFdTrack.y
        };

        var wFdRang = {
          x : this.dx - wFdProj.x,
          y : this.dy - wFdProj.y,
        };
        
        var wBdProj = {
          x: wBdRatioNorm*wBdTrack.x,
          y: wBdRatioNorm*wBdTrack.y
        };

        var wBdRang = {
          x : this.dx - wBdProj.x,
          y : this.dy - wBdProj.y,
        };
        
        var wFdRangeSqMag = wFdRang.x*wFdRang.x + wFdRang.y*wFdRang.y;
        var wBdRangeSqMag = wBdRang.x*wBdRang.x + wBdRang.y*wBdRang.y;

        if (wFdRangeSqMag < wBdRangeSqMag) {
          //Point is in front segment
          this.mInput_State.value = wFdRatioNorm;
          this.dx = wFdProj.x;
          this.dy = wFdProj.y;
        }
        else {
          //Point is in back segment
          this.mInput_State.value = -wBdRatioNorm;
          this.dx = wBdProj.x;
          this.dy = wBdProj.y;
          
        }
        this.x = this.x_center + this.dx;
        this.y = this.y_center + this.dy;

        return;
      }.bind(wInput))

      return wInput;
    },

    switch: function (iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter) {

      var wInput = GamePadExternal.InputType.slider(iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter);
      wInput.InputType = GamePadInputType.eSWITCH;

      wInput.constraints.forward_state_count = iParameter.forward_state_count > 0.0 ? Math.floor(iParameter.forward_state_count) : 0;
      wInput.constraints.backward_state_count = iParameter.backward_state_count > 0.0 ? Math.floor(iParameter.backward_state_count) : 0;
      wInput.constraints.x_recenter = false;
      wInput.constraints.y_recenter = false;
      
      wInput.processConstraints.push(function (iCanvasDOM, iControlPointList) {

        var wTrack = {
          x : 0,
          y : 0
        };

        var wStateCount = 1;
        var wGain = 0.0;
        if (this.mInput_State.value > 0) {
          wTrack = {
            x : this.slider_x_path[2] - this.slider_x_path[1],
            y : this.slider_y_path[2] - this.slider_y_path[1],     
          }
          wStateCount = wInput.constraints.forward_state_count;
          wGain = this.mInput_State.value;
        }
        else {
          wTrack = {
            x : this.slider_x_path[0] - this.slider_x_path[1],
            y : this.slider_y_path[0] - this.slider_y_path[1],     
          }
          wStateCount = wInput.constraints.backward_state_count;
          wGain = -this.mInput_State.value;
        }

        var wCurrentState = 0;
        if (0 == wStateCount) {
          wGain = 0;
        }
        else {
          var wGainStep = 1/wStateCount;
          wCurrentState = Math.round(wGain / wGainStep);
          var wGainTgt = wCurrentState *wGainStep;
          wGain += 0.75* (wGainTgt-wGain);
        }
        
        if (this.mInput_State.value > 0) {
          this.mInput_State.value = wCurrentState;
        }
        else {
          this.mInput_State.value = -wCurrentState;
        }

        if(false == this.active) {
          this.dx = wGain*wTrack.x;
          this.dy = wGain*wTrack.y;
          this.x = this.x_center + this.dx;
          this.y = this.y_center + this.dy;
  
        }
        return;
      }.bind(wInput))

      return wInput;
    },


    radial_dial: function (iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter) {
    },

    analog_stick: function (iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter) {

      var wInput = GamePadExternal.InputType.baseInputType(iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter);
      wInput.InputType = GamePadInputType.eSWITCH;
      wInput.constraints.radius = null != iParameter.radius? iParameter.radius : -1;

      wInput.processConstraints.push(function (iCanvasDOM, iControlPointList) {
      }.bind(wInput))

      return wInput;
    },
  },
  
  createInput : function(iType, iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter) {

    switch (iType) {
      case GamePadInputType.eBUTTON:
        return GamePadExternal.InputType.button(iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter);
      case GamePadInputType.eSLIDER:
        return GamePadExternal.InputType.slider(iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter);
      case GamePadInputType.eSWITCH:
        return GamePadExternal.InputType.switch(iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter);
      case GamePadInputType.eRADIAL_DIAL:
        return GamePadExternal.InputType.radial_dial(iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter);
      case GamePadInputType.eANALOG_STICK:
        return GamePadExternal.InputType.analog_stick(iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter);
    }

    return null;
  },

}

export function GamePad(iDOM, iDrawFunction) {
  
  this.mCanvas = document.createElement("canvas");
  iDOM.append(this.mCanvas);


  this.mDrawFunction = null != iDrawFunction ? iDrawFunction : DefaultDrawFunction;
  this.mControlPoints = new DomTouchControl.DomTouchControl(this.mCanvas);

  this.mInputKnobList = [];
  this.GamePad_State = [];

  this.addInput = function (iType, iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter) {
    var wNewInput = GamePadExternal.createInput(iType, iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter);
    if (null != wNewInput) {
      this.mInputKnobList.push(wNewInput);
      this.GamePad_State.push(wNewInput.mInput_State);
    }
  }

  this.iteration = function () {
    
    this.mCanvas.width = this.mCanvas.parentNode.clientWidth;
    this.mCanvas.height = this.mCanvas.parentNode.clientHeight;

    for(var wi = 0; wi < this.mControlPoints.mControlPointList.length; ++wi) {
      this.mControlPoints.mControlPointList[wi].available = true;
      for(var wj = 0; wj < this.mInputKnobList.length; ++wj) {
        if (true == this.mInputKnobList[wj].active) {
          if (this.mInputKnobList[wj].active_control_id == this.mControlPoints.mControlPointList[wi].identifier) {
            this.mControlPoints.mControlPointList[wi].available = false;

          }
        }
      }
    }

    for(var wi = 0; wi < this.mInputKnobList.length; ++wi) {
      this.mInputKnobList[wi].iteration(this.mCanvas, this.mControlPoints.mControlPointList);
    }

    if (null != this.mDrawFunction) {
      this.mDrawFunction(this.mCanvas, this.mInputKnobList);
    }

    window.requestAnimationFrame(this.iteration.bind(this));
  }

  this.iteration()
}


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
      x : 0,
      y : 0,
      x_limts : [0,0,0],
      y_limts : [0,0,0],
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

      this.Knob.x_limts = [wHalfWidth, wXCenter ,this.Canvas.width - wHalfWidth];
      this.Knob.y_limts = [wHalfHeight, wYCenter ,this.Canvas.height - wHalfHeight];
  
      if (true == this.Knob.constraints.x_restriction[0]) {
        this.Knob.x_limts[0] = wXCenter;
      } 
      if (true == this.Knob.constraints.x_restriction[1]) {
        this.Knob.x_limts[2] = wXCenter;
      } 

      if (true == this.Knob.constraints.y_restriction[0]) {
        this.Knob.y_limts[0] = wYCenter;
      } 
      if (true == this.Knob.constraints.y_restriction[1]) {
        this.Knob.y_limts[2] = wYCenter;
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

      if (this.Knob.x < this.Knob.x_limts[0]) {
        this.Knob.x = this.Knob.x_limts[0];
      }
      
      if (this.Knob.x > this.Knob.x_limts[2]) {
        this.Knob.x = this.Knob.x_limts[2];
      }
      
      if (this.Knob.y < this.Knob.y_limts[0]) {
        this.Knob.y = this.Knob.y_limts[0];
      }
      
      if (this.Knob.y > this.Knob.y_limts[2]) {
        this.Knob.y = this.Knob.y_limts[2];
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
        wXDenominator = this.Knob.x_limts[2] - this.Knob.x_limts[1];
      }
      else {
        wXDenominator = this.Knob.x_limts[1] - this.Knob.x_limts[0];  
      }
      
      var wYDenominator = 1.0;
      if (this.Knob.radius > 0 ) {
        wYDenominator = this.Knob.radius;
      }
      else if (this.Knob.dy > 0) {
        wYDenominator = this.Knob.y_limts[2] - this.Knob.y_limts[1];
      }
      else {
        wYDenominator = this.Knob.y_limts[2] - this.Knob.y_limts[1];
      }

      if (wXDenominator < 1) wXDenominator = 1;
      if (wYDenominator < 1) wYDenominator = 1;

      this.GamePad_State.x = this.Knob.dx / wXDenominator;
      this.GamePad_State.y = this.Knob.dy / wYDenominator;
      this.GamePad_State.active = this.Knob.active;

      if (null != this.Knob.drawfunction) {
        this.Knob.drawfunction(this.Canvas, this.Knob);
      }
      else {
        DefaultDrawFunction(this.Canvas, [this.Knob]);
      }
      
      window.requestAnimationFrame(this.Iteration.bind(this));
    },
  }

  wDOM.GamePad_State = wDOM.GamPad_Struct.GamePad_State

  wDOM.GamPad_Struct.Iteration();
  return wDOM;
}

export default {
  GamePadInputType : GamePadInputType,
  GamePad : GamePad,
  GamePadInput : GamePadInput
}