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
      var wRoll = CommonMath.normalizeAngle_Sign180rad(parseFloat(iRoll ));
      var wRollEnd = wRollStart - wRoll;
      var wRollDir = wRoll > 0;

      wCtx.strokeStyle = "lime";
      wCtx.fillStyle = "lime";
      wCtx.lineWidth = 1;
      wCtx.font='10px Arial';

      wCtx.textAlign = 'center';
      wCtx.textBaseline = 'middle';
      wCtx.fillText("" + (wRoll*180/Math.PI).toFixed(1), 0,-(wArcRadius + 10));

      wCtx.beginPath();
//      wCtx.moveTo(0,-wRadius);
//      wCtx.lineTo(0, -wArcRadius);
      wCtx.arc(0,0,wArcRadius, wRollStart, wRollEnd, wRollDir);
      wCtx.stroke();

      var wArrowHeight = 7;
      var wArrowRadius = wArcRadius - wArrowHeight;
      CanvasOp.drawCenteredAt(iCanvasDOM, function(iCanvasDOM) {

        wCtx.fillText("" + (wRoll*180/Math.PI).toFixed(1), 0,-(wArcRadius - 20));

        CanvasOp.drawCenteredAt(iCanvasDOM, function(iCanvasDOM) {
          CanvasOp.drawArrow(iCanvasDOM, 0, 0, wArrowHeight, wArrowHeight);
        }, 0.0, -wArrowRadius , 1.0, 1.0, -Math.PI/2);

        var wDistFromCenter = 20;
        var wRefDistFromCenter = wDistFromCenter + 20;
        var wAnglePerPixel = 4;
        var wPitch = (180/Math.PI)*iPitch;
        var wCompassY = 0; //- wRadius * (Math.cos(2*Math.PI / 3));

        
        var wParameters = {
          UnitScale: wAnglePerPixel,
          MajorIncrement: 10,
          MinorIncrement: 5,
          MajorLength: 8,
          MinorLength: 4,
          MajorLineWidth: 1,
          MinorLineWidth: 0.5,
          DrawLine: true,
          SingleSided: true,
        };

        CanvasOp.drawNumberLine(iCanvasDOM, 
          wDistFromCenter, wCompassY,
          wDistFromCenter, -wArrowRadius,
          wRefDistFromCenter, wPitch*wAnglePerPixel, 0,
          wParameters);

        CanvasOp.drawNumberLine(iCanvasDOM, 
          -wDistFromCenter, wCompassY,
          -wDistFromCenter, -wArrowRadius,
          -wRefDistFromCenter, wPitch*wAnglePerPixel, 0,
          wParameters);

        var wYaw = (180/Math.PI)*iYaw;
        CanvasOp.drawNumberLine(iCanvasDOM, 
          wArrowRadius, wCompassY + 10,
          -wArrowRadius, wCompassY + 10,
          -wYaw*wAnglePerPixel, wCompassY+wRefDistFromCenter, 0,
          wParameters);

      }, 0,  0, 1.0, 1.0, -wRoll);
        
      
      CanvasOp.drawAircraftCursor(iCanvasDOM, 100);
    }
  },
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
      var wRollEnd = wRollStart - wRoll;
      var wRollDir = wRoll > 0;

      wCtx.strokeStyle = "lime";
      wCtx.fillStyle = "lime";
      wCtx.lineWidth = 1;
      wCtx.font='10px Arial';

      wCtx.textAlign = 'center';
      wCtx.textBaseline = 'middle';
      wCtx.fillText("" + (wRoll*180/Math.PI).toFixed(1), 0,-(wArcRadius + 10));

      wCtx.beginPath();
//      wCtx.moveTo(0,-wRadius);
//      wCtx.lineTo(0, -wArcRadius);
      wCtx.arc(0,0,wArcRadius, wRollStart, wRollEnd, wRollDir);
      wCtx.stroke();

      var wArrowHeight = 7;
      var wArrowRadius = wArcRadius - wArrowHeight;
      CanvasOp.drawCenteredAt(iCanvasDOM, function(iCanvasDOM) {

        wCtx.fillText("" + (wRoll*180/Math.PI).toFixed(1), 0,-(wArcRadius - 20));

        CanvasOp.drawCenteredAt(iCanvasDOM, function(iCanvasDOM) {
          CanvasOp.drawArrow(iCanvasDOM, 0, 0, wArrowHeight, wArrowHeight);
        }, 0.0, -wArrowRadius , 1.0, 1.0, -Math.PI/2);

        var wDistFromCenter = 20;
        var wRefDistFromCenter = wDistFromCenter + 5;
        var wAnglePerPixel = 4;
        var wPitch = (180/Math.PI)*iPitch;

        var wCompassY = - wRadius * (Math.cos(2*Math.PI / 3));
        var wCompassXStart = -wRadius * (Math.sin(2*Math.PI / 3));
        var wCompassXEnd = -wCompassXStart;

        var wParameters = {
          UnitScale: wAnglePerPixel,
          MajorIncrement: 10,
          MinorIncrement: 5,
          MajorLength: 5,
          MinorLength: 2,
          MajorLineWidth: 1,
          MinorLineWidth: 0.5,
          DrawLine: false,
          SingleSided: false,
        };

        CanvasOp.drawNumberLine(iCanvasDOM, 
          -0, wCompassY - 10,
          -0, -wArrowRadius,
          wRefDistFromCenter, wPitch*wAnglePerPixel, 0,
          wParameters);

          
        var wYaw = (180/Math.PI)*iYaw;
        CanvasOp.drawNumberLine(iCanvasDOM, 
          wCompassXStart, wCompassY,
          wCompassXEnd, wCompassY,
          -wYaw*wAnglePerPixel, wCompassY + wRefDistFromCenter, 0,
          wParameters);

      }, 0,  0, 1.0, 1.0, -wRoll);
        
      
      CanvasOp.drawAircraftCursor(iCanvasDOM, 100);
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