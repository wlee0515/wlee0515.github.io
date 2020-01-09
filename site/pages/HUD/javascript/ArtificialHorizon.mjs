import CommonMath from "../../../modules/CommonMath.mjs"
import CanvasOp from "../../../modules/CanvasOp.mjs";

var EulerIndex = {
  ROLL : 0,
  PITCH : 1,
  YAW : 2,
}
export var ArtificialHorizonDrawStyleList = [
  {
    DrawSize : {
      width : 250,
      height : 250,
    },

    DrawFunction : function (iCanvasDOM, iRoll, iPitch, iYaw) {
      var wRadius = this.DrawSize.height/2;
      var wArcRadius = 0.9*wRadius;
      var wCtx = iCanvasDOM.getContext("2d");

      var wRollStart = -Math.PI /2;
      var wRoll = CommonMath.normalizeAngle_Sign180rad(parseFloat(iRoll));
      var wRollEnd = wRollStart + wRoll;
      var wRollDir = wRoll < 0;

      wCtx.strokeStyle = "blue";
      wCtx.fillStyle = "blue";
      wCtx.lineWidth = 2;
      wCtx.beginPath();
      wCtx.moveTo(0,-wRadius);
      wCtx.lineTo(0, -wArcRadius);
      wCtx.arc(0,0,wArcRadius, wRollStart, wRollEnd, wRollDir);
      wCtx.stroke();

      var wArrowHeight = 7;
      var wArrowRadius = wArcRadius - wArrowHeight;
      CanvasOp.drawCenteredAt(iCanvasDOM, function(iCanvasDOM) {

        CanvasOp.drawCenteredAt(iCanvasDOM, function(iCanvasDOM) {
          CanvasOp.drawArrow(iCanvasDOM, 0, 0, wArrowHeight, wArrowHeight);
        }, 0.0, -wArrowRadius , 1.0, 1.0, -Math.PI/2);

        CanvasOp.drawNumberLine(iCanvasDOM, 
          0, 0,
          0, -wArrowRadius,
          10, 0, (180/Math.PI)*iPitch,
          5, 10, 5, 1, 1, 1, 0.5);

      }, 0,  0, 1.0, 1.0, wRoll);
        
      
      CanvasOp.drawAircraftCursor(iCanvasDOM, 100);
    }
  },
  {
    DrawSize : {
      width : 50,
      height : 100,
    },

    DrawFunction : function (iCanvasDOM, iRoll, iPitch, iYaw) {
      var wCtx = iCanvasDOM.getContext("2d");
      
      wCtx.fillStyle = "blue";
      wCtx.fillRect(0,0,50,50);
    }
  },
]

export function ArtificialHorizon () {
  
  this.styleIndex = 0;

  this.CurrentEulerAngle = [0.0,0.0,0.0];
  this.TargetEulerAngle = [0.0,0.0,0.0];
  this.EulerAngleTimeConstant = [0.0,0.0,0.0];
  
  this.setStyleIndex = function (iStyleIndex) {
    this.styleIndex = parseInt(iStyleIndex);
  }

  this.setCurrentEulerAngle = function (iRoll, iPitch, iYaw) {
    this.CurrentEulerAngle[0] = parseFloat(iRoll);
    this.CurrentEulerAngle[1] = parseFloat(iPitch);
    this.CurrentEulerAngle[2] = parseFloat(iYaw);
  }

  this.setTargetEulerAngle = function (iRoll, iPitch, iYaw) {
    this.TargetEulerAngle[0] = parseFloat(iRoll);
    this.TargetEulerAngle[1] = parseFloat(iPitch);
    this.TargetEulerAngle[2] = parseFloat(iYaw);
  }
  
  this.setEulerAngleTimeConstant = function (iRollTau, iPitchTau, iYawTau) {
    this.EulerAngleTimeConstant[0] = parseFloat(iRollTau);
    this.EulerAngleTimeConstant[1] = parseFloat(iPitchTau);
    this.EulerAngleTimeConstant[2] = parseFloat(iYawTau);
  }

  this.processTime = function (iDt) {
    var wDt = parseFloat(iDt);
    for (var wi = 0; wi < 3; ++wi) {
      var wDelta = CommonMath.normalizeAngle_Sign180rad(this.TargetEulerAngle[wi] - this.CurrentEulerAngle[wi]);

      if (this.EulerAngleTimeConstant[wi] < wDt) this.EulerAngleTimeConstant[wi] = wDt;
      
      var wGain = wDt/this.EulerAngleTimeConstant[wi];
      if (wGain > 1.0) wGain = 1.0;

      this.CurrentEulerAngle[wi] +=  wGain*wDelta;
    }
  }

  this.drawArtificialHorizon = function (iCanvasDOM, iCenterX, iCenterY, iWidth, iHeight) {
    
    var wStyle = ArtificialHorizonDrawStyleList[this.styleIndex % ArtificialHorizonDrawStyleList.length];

    var wScale = iWidth / wStyle.DrawSize.width;
    if (wScale * wStyle.DrawSize.height >  iHeight) {
      wScale = iHeight / wStyle.DrawSize.height;
    }

    CanvasOp.drawCenteredAt(iCanvasDOM, function(iCanvasDOM) {
      var wStyle = ArtificialHorizonDrawStyleList[this.styleIndex % ArtificialHorizonDrawStyleList.length];  
      wStyle.DrawFunction(iCanvasDOM,
        this.CurrentEulerAngle[0],
        this.CurrentEulerAngle[1],
        this.CurrentEulerAngle[2]);

      }.bind(this), iCenterX, iCenterY, wScale, wScale, 0);
  }
}

export default {
  ArtificialHorizon : ArtificialHorizon,
  ArtificialHorizonDrawStyleList : ArtificialHorizonDrawStyleList,
}