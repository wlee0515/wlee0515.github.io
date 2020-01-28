
import DomTouchControl from "./DomTouchControl.mjs"


function DrawKnob( iCanvasDOM, iKnob) {
  
  var wCtx = iCanvasDOM.getContext("2d");
  
  wCtx.strokeStyle = "lime";
  wCtx.fillStyle = "lime";
  wCtx.lineWidth = 1;
  
  switch (iKnob.InputType) {
    case GamePadInputType.eSWITCH:
      {
        var wBdSlop = {
          x : iKnob.slider_x_path[0] - iKnob.slider_x_path[1],
          y : iKnob.slider_y_path[0] - iKnob.slider_y_path[1]
        }

        var wBdMag = Math.sqrt(wBdSlop.x* wBdSlop.x + wBdSlop.y*wBdSlop.y);
        wBdSlop.x /= wBdMag;
        wBdSlop.y /= wBdMag;
        
        wBdSlop.x *= 5;
        wBdSlop.y *= 5;

        wCtx.strokeStyle = "blue";
        for (var wi = 0; wi < iKnob.switch_x_position[0].length; ++wi) {
          var wCenterX = iKnob.switch_x_position[0][wi];
          var wCenterY = iKnob.switch_y_position[0][wi];
          wCtx.beginPath();
          wCtx.moveTo( wCenterX - wBdSlop.y, wCenterY + wBdSlop.x);
          wCtx.lineTo( wCenterX + wBdSlop.y, wCenterY - wBdSlop.x);
          wCtx.stroke();
        }
        
        var wFdSlop = {
          x : iKnob.slider_x_path[2] - iKnob.slider_x_path[1],
          y : iKnob.slider_y_path[2] - iKnob.slider_y_path[1]
        }

        var wFdMag = Math.sqrt(wFdSlop.x* wFdSlop.x + wFdSlop.y*wFdSlop.y);
        wFdSlop.x /= wFdMag;
        wFdSlop.y /= wFdMag;
        
        wFdSlop.x *= 5;
        wFdSlop.y *= 5;

        wCtx.strokeStyle = "blue";
        for (var wi = 0; wi < iKnob.switch_x_position[1].length; ++wi) {
          var wCenterX = iKnob.switch_x_position[1][wi];
          var wCenterY = iKnob.switch_y_position[1][wi];
          wCtx.beginPath();
          wCtx.moveTo( wCenterX - wFdSlop.y, wCenterY + wFdSlop.x);
          wCtx.lineTo( wCenterX + wFdSlop.y, wCenterY - wFdSlop.x);
          wCtx.stroke();
        }
      }
    case GamePadInputType.eSLIDER:
      {
        wCtx.strokeStyle = "blue";
        wCtx.beginPath();
        wCtx.moveTo(iKnob.slider_x_path[0],iKnob.slider_y_path[0]);
        wCtx.lineTo(iKnob.slider_x_path[1],iKnob.slider_y_path[1]);
        wCtx.stroke();

        wCtx.strokeStyle = "lime";
        wCtx.beginPath();
        wCtx.moveTo(iKnob.slider_x_path[1],iKnob.slider_y_path[1]);
        wCtx.lineTo(iKnob.slider_x_path[2],iKnob.slider_y_path[2]);
        wCtx.stroke();
      }
      break;
    case GamePadInputType.eRADIAL_DIAL:
    case GamePadInputType.eANALOG_STICK:
      {
        if (iKnob.radius > 0) {
          wCtx.strokeStyle = "blue";
          wCtx.beginPath();
          wCtx.arc(iKnob.x_center, iKnob.y_center, iKnob.radius, 0, 2 * Math.PI);
          wCtx.closePath();
          wCtx.stroke();
          wCtx.strokeStyle = "lime";
          wCtx.beginPath();
          wCtx.arc(iKnob.x_center, iKnob.y_center, iKnob.radius + 0.5*iKnob.width, 0, 2 * Math.PI);
          wCtx.closePath();
          wCtx.stroke();
        }
        else {
          wCtx.strokeRect(iKnob.x_frame_limts[0], iKnob.y_frame_limts[0] , iKnob.frame_width, iKnob.frame_height );
        }
      }
    case GamePadInputType.eBUTTON:
    default:
      break;
  }

  if (true == iKnob.active) {
    wCtx.strokeStyle = "red";
    wCtx.fillStyle = "red";
    wCtx.lineWidth = 1;
  }

  if (iKnob.radius > 0) {
    wCtx.beginPath();
    wCtx.arc(iKnob.x, iKnob.y, iKnob.width/2, 0, 2 * Math.PI);
    wCtx.closePath();
    wCtx.stroke();
    wCtx.fill();
  }
  else {    
    
    wCtx.fillRect(iKnob.x - 0.5* iKnob.width, iKnob.y - 0.5*iKnob.height ,iKnob.width,iKnob.height);
    
  }
  return;
}

function DefaultDrawFunction( iCanvasDOM, iKnob) {
  
  var wCtx = iCanvasDOM.getContext("2d");
  wCtx.clearRect(0, 0, iCanvasDOM.width, iCanvasDOM.height);

  for (var wi = 0; wi < iKnob.length; ++ wi) {
    DrawKnob( iCanvasDOM, iKnob[wi]);
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

        var wFdTrack = {
          x : this.slider_x_path[2] - this.slider_x_path[1],
          y : this.slider_y_path[2] - this.slider_y_path[1],     
        }

        var wBdTrack = {
          x : this.slider_x_path[0] - this.slider_x_path[1],
          y : this.slider_y_path[0] - this.slider_y_path[1],     
        }

        var wTrack = {
          x : 0,
          y : 0
        };

        var wStateCount = 1;
        var wGain = 0.0;
        if (this.mInput_State.value > 0) {
          wTrack = wFdTrack;
          wStateCount = wInput.constraints.forward_state_count;
          wGain = this.mInput_State.value;
        }
        else {
          wTrack = wBdTrack;
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

        this.switch_x_position = [[],[]];
        this.switch_y_position = [[],[]];

        if (0 < wInput.constraints.backward_state_count) {
          var wStep = 1/wInput.constraints.backward_state_count;
          for(var wi = 1 ; wi < wInput.constraints.backward_state_count + 1; ++wi ){
            this.switch_x_position[0].push(wi*wStep*wBdTrack.x + this.x_center);
            this.switch_y_position[0].push(wi*wStep*wBdTrack.y + this.y_center);
          }
        }

        if (0 < wInput.constraints.forward_state_count) {
          var wStep = 1/wInput.constraints.forward_state_count;
          for(var wi = 1 ; wi < wInput.constraints.forward_state_count + 1; ++wi ){
            this.switch_x_position[1].push(wi*wStep*wFdTrack.x + this.x_center);
            this.switch_y_position[1].push(wi*wStep*wFdTrack.y + this.y_center);
          }
        }

        return;
      }.bind(wInput))

      return wInput;
    },


    radial_dial: function (iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter) {
    },

    analog_stick: function (iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter) {

      var wInput = GamePadExternal.InputType.baseInputType(iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter);
      wInput.InputType = GamePadInputType.eANALOG_STICK;
      wInput.constraints.radius = null != iParameter.radius? iParameter.radius : -1;
      wInput.constraints.x_restriction = null != iParameter.x_restriction? iParameter.x_restriction : [false, false],
      wInput.constraints.y_restriction = null != iParameter.y_restriction? iParameter.y_restriction : [false, false],
      
      wInput.processConstraints.push(function (iCanvasDOM, iControlPointList) {

        this.analogStick_x_limts = [this.x_frame_limts[0], this.x_center ,this.x_frame_limts[1]];
        this.analogStick_y_limts = [this.y_frame_limts[0], this.y_center ,this.y_frame_limts[1]];

        if (true == this.constraints.x_restriction[0]) {
          this.analogStick_x_limts[0] = this.analogStick_x_limts[1];
        } 
        if (true == this.constraints.x_restriction[1]) {
          this.analogStick_x_limts[2] = this.analogStick_x_limts[1];
        } 
  
        if (true == this.constraints.y_restriction[0]) {
          this.analogStick_y_limts[0] = this.analogStick_y_limts[1];
        } 
        if (true == this.constraints.y_restriction[1]) {
          this.analogStick_y_limts[2] = this.analogStick_y_limts[1];
        } 


        if (this.constraints.radius > 1) {
          var wSize = this.frame_height < this.frame_width ? this.frame_height : this.frame_width;
          wSize /= 2;
          var wRefRadius = this.constraints.percentage ? (this.constraints.radius / 100) * wSize : this.constraints.radius;
          this.radius = wRefRadius;

          var wSqMag = this.dx * this.dx + this.dy * this.dy;
          var wSqRefMag = wRefRadius * wRefRadius;

          if (wSqRefMag < wSqMag) {
            var wR = Math.sqrt(wSqMag);
            var wScale = wRefRadius / wR;
            this.dx *= wScale;
            this.dy *= wScale;
          }
        }
        else {
          this.radius = -1;
        }

        this.x = this.dx + this.x_center;
        this.y = this.dy + this.y_center;

        var wXDenominator = 1.0;
        if (this.radius > 0) {
          wXDenominator = this.radius;
        }
        else if (this.dx > 0) {
          wXDenominator = this.analogStick_x_limts[2] - this.analogStick_x_limts[1];
        }
        else {
          wXDenominator = this.analogStick_x_limts[1] - this.analogStick_x_limts[0];
        }

        var wYDenominator = 1.0;
        if (this.radius > 0) {
          wYDenominator = this.radius;
        }
        else if (this.Knob.dy > 0) {
          wYDenominator = this.analogStick_y_limts[2] - this.analogStick_y_limts[1];
        }
        else {
          wYDenominator = this.analogStick_y_limts[2] - this.analogStick_y_limts[1];
        }

        if (wXDenominator < 1) wXDenominator = 1;
        if (wYDenominator < 1) wYDenominator = 1;

        this.mInput_State.x = this.dx / wXDenominator;
        this.mInput_State.y = this.dy / wYDenominator;
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

export default {
  GamePadInputType : GamePadInputType,
  GamePad : GamePad
}