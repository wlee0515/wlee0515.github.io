
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
    var wEnvelopeWidth = iKnob.x_limts[2] - iKnob.x_limts[0];
    var wEnvelopeHeight = iKnob.y_limts[2] - iKnob.y_limts[0];
    wCtx.strokeRect(iKnob.x_limts[0], iKnob.y_limts[0] , wEnvelopeWidth, wEnvelopeHeight );
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
    var wEnvelopeWidth = iKnob.x_limts[2] - iKnob.x_limts[0] + iKnob.width;
    var wEnvelopeHeight = iKnob.y_limts[2] - iKnob.y_limts[0] + iKnob.height;
    wCtx.strokeRect(iKnob.x_limts[0] - 0.5* iKnob.width, iKnob.y_limts[0] - 0.5*iKnob.height , wEnvelopeWidth, wEnvelopeHeight );
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

        x : iCenterX,
        y : iCenterY, 
        dx: 0,
        dy: 0,
        x_center: iCenterX,
        y_center: iCenterY,
        x_limts : [0,0,0],
        y_limts : [0,0,0],
        active: false,
        active_control_id: -1,
        height: iKnobHeight,
        width: iKnobWidth,
        constraints: {
          x_center : iCenterX,
          y_center : iCenterY,
          x_restriction : null != iParameter.x_restriction? iParameter.x_restriction : [false, false],
          y_restriction : null != iParameter.y_restriction? iParameter.y_restriction : [false, false],
          percentage : null != iParameter.percentage? iParameter.percentage : false,
        },

        processHit: function (iCanvasDOM, iControlPointList) {

          this.x_center = this.constraints.percentage ? (this.constraints.x_center/100)*iCanvasDOM.width : this.constraints.x_center;
          this.y_center = this.constraints.percentage ? (this.constraints.y_center/100)*iCanvasDOM.height : this.constraints.y_center;

          if (true == this.active) {
            var wIsFound = false;
            for (j = 0; j < iControlPointList.length; ++j) {
              if (this.active_control_id == iControlPointList[j].identifier) {
                wIsFound = true;
                if (false == iControlPointList[j].active) {
                  this.active = false;
                }
                else {
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

              var wDx = Math.abs(this.x - iControlPointList[j].x);
              var wDy = Math.abs(this.y - iControlPointList[j].y);

              if ((wHalfWidth < wDx) || (wHalfHeight < wDy)) {
                continue;
              }

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
        },
        
        processFrameLimits: function (iCanvasDOM, iControlPointList) {
          var wHalfWidth = this.width/2;
          var wHalfHeight = this.height/2;
    
          this.x_limts = [wHalfWidth, this.x_center ,iCanvasDOM.width - wHalfWidth];
          this.y_limts = [wHalfHeight, this.y_center ,iCanvasDOM.height - wHalfHeight];
      
          if (true == this.constraints.x_restriction[0]) {
            this.x_limts[0] = this.x_center;
          } 
          if (true == this.constraints.x_restriction[1]) {
            this.x_limts[2] = this.x_center;
          } 
    
          if (true == this.constraints.y_restriction[0]) {
            this.y_limts[0] = this.y_center;
          } 
          if (true == this.constraints.y_restriction[1]) {
            this.y_limts[2] = this.y_center;
          } 
    
          if (this.x < this.x_limts[0]) {
            this.x = this.x_limts[0];
          }
          
          if (this.x > this.x_limts[2]) {
            this.x = this.x_limts[2];
          }
          
          if (this.y < this.y_limts[0]) {
            this.y = this.y_limts[0];
          }
          
          if (this.y > this.y_limts[2]) {
            this.y = this.y_limts[2];
          }
          
          this.dx = this.x - this.x_center;
          this.dy = this.y - this.y_center;
        },

        processConstraints: [],

        iteration: function (iCanvasDOM, iControlPointList) {
          this.processHit(iCanvasDOM, iControlPointList);
          this.processFrameLimits(iCanvasDOM, iControlPointList);
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
      wInput.constraints.track_Dx = null != iParameter.track_Dx ? iParameter.track_Dx : 0;
      wInput.constraints.track_Dy = null != iParameter.track_Dy ? iParameter.track_Dy : 0;
      
      wInput.processConstraints.push( function (iCanvasDOM, iControlPointList) {

        var wTrackDx = this.constraints.percentage ? (this.constraints.track_Dx/100)*iCanvasDOM.width : this.constraints.track_Dx;
        var wTrackDy = this.constraints.percentage ? (this.constraints.track_Dy/100)*iCanvasDOM.height : this.constraints.track_Dy;

        if ((Math.abs(wTrackDx) < 1) && (Math.abs(wTrackDy) < 1) ){
          this.x = this.x_center;
          this.y = this.y_center;
          this.dx = 0;
          this.dy = 0;
          return;
        }

        var wt_Limit = [0.0, 1.0]

        var wt_Limit_Frame = [];
        if (Math.abs(wTrackDx) >= 1.0) {
          wt_Limit_Frame.push((this.x_limts[0] - this.x_center) / wTrackDx);
          wt_Limit_Frame.push((this.x_limts[2] - this.x_center) / wTrackDx);
        }
        
        if (Math.abs(wTrackDy) >= 1.0) {
          wt_Limit_Frame.push((this.y_limts[0] - this.y_center) / wTrackDy);
          wt_Limit_Frame.push((this.y_limts[2] - this.y_center) / wTrackDy);
        }

        for(var wi = 0; wi < wt_Limit_Frame.length; ++wi) {
          if (wt_Limit_Frame[wi] < 0.5) {
            if (wt_Limit_Frame[wi] > wt_Limit[0]) {
              wt_Limit[0] = wt_Limit_Frame[wi];
            }
          }
          else {
            if (wt_Limit_Frame[wi] < wt_Limit[1]) {
              wt_Limit[1] = wt_Limit_Frame[wi];
            }
          }
        }
        
        var wTrackMag = wTrackDx*wTrackDx + wTrackDy*wTrackDy
        wTrackMag = Math.sqrt(wTrackMag);

        var wTrackUnitX = wTrackDx/wTrackMag;
        var wTrackUnitY = wTrackDy/wTrackMag;

        var wDotProduct = this.dx*wTrackUnitX + this.dy*wTrackUnitY;
        
        var wDx = wDotProduct*wTrackUnitX;
        var wDy = wDotProduct*wTrackUnitY;
        var wT =  0;
        if (Math.abs(wTrackDx) >= 1.0) {
          wT = wDx/wTrackDx;
        }
        else if (Math.abs(wTrackDy) >= 1.0) {
          wT = wDy/wTrackDy;
        }

        if (wT < wt_Limit[0]) {
          wT = wt_Limit[0];
        }
        
        if (wT > wt_Limit[1]) {
          wT = wt_Limit[1];
        }

        this.mInput_State.value =  (wT - wt_Limit[0]) /(wt_Limit[1] - wt_Limit[0]);

        wDx = wT*wTrackDx;
        wDy = wT*wTrackDy;

        this.slider_x_limits = [ wt_Limit[0]*wTrackDx + this.x_center, wt_Limit[1]*wTrackDx + this.x_center];
        this.slider_y_limits = [ wt_Limit[0]*wTrackDy + this.y_center, wt_Limit[1]*wTrackDy + this.y_center];
        this.dx = wDx;
        this.dy = wDy;
        this.x = this.x_center + this.dx;
        this.y = this.y_center + this.dy;
      }.bind(wInput))

      return wInput;
    },

    switch: function (iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter) {

      var wInput = GamePadExternal.InputType.slider(iKnobWidth, iKnobHeight, iCenterX, iCenterY, iParameter);
      wInput.InputType = GamePadInputType.eSWITCH;

      wInput.constraints.state_count = iParameter.state_count > 2.0 ? Math.floor(iParameter.state_count) : 2;
      
      wInput.processConstraints.push(function (iCanvasDOM, iControlPointList) {
        var wSlider_dx = this.slider_x_limits[1] - this.slider_x_limits[0];
        var wSlider_dy = this.slider_y_limits[1] - this.slider_y_limits[0];
        var wStepSize_x = wSlider_dx / (this.constraints.state_count - 1);
        var wStepSize_y = wSlider_dy / (this.constraints.state_count - 1);
        
        var wT_step_cur = 0.0;

        if (Math.abs(wStepSize_x) > 1.0) {
          wT_step_cur = (this.x - this.slider_x_limits[0]) / wStepSize_x;
        }
        else if (Math.abs(wStepSize_y) > 1.0) {
          wT_step_cur = (this.y - this.slider_y_limits[0]) / wStepSize_y;
        }
        else {
          return;
        }
        
        var wT_step_stick = Math.round(wT_step_cur);
        
        var wTgt_x = wT_step_stick*wStepSize_x + this.slider_x_limits[0];
        var wTgt_y = wT_step_stick*wStepSize_y + this.slider_y_limits[0];

        if (false == this.active) {
          this.x += 0.75*(wTgt_x - this.x);
          this.y += 0.75*(wTgt_y - this.y);  
        }

        this.mInput_State.switch_state = wT_step_stick;
        this.mInput_State.value =  wT_step_stick/this.constraints.state_count - 1;
        this.dx = this.x - this.x_center;
        this.dy = this.y - this.y_center;
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