function ViewPoint(iDiv_Id) {
  this.mOutputDivId = iDiv_Id;
  this.mOutputDivDOM = document.getElementById(this.mOutputDivId);

  if (null == this.mOutputDivDOM) {
    alert("[" + iDiv_Id + "] div not found, failed to create ViewPoint");
    return null;
  }

  this.mOutputDivDOM.style.position = "absolute";

  this.mBackGroundCanvasDOM = document.createElement("CANVAS");
  this.mBackGroundCanvasDOM.style.position = "absolute";

  this.mForeGroundCanvasDOM = document.createElement("CANVAS");
  this.mForeGroundCanvasDOM.style.position = "absolute";

  this.mOutputDivDOM.append(this.mBackGroundCanvasDOM);
  this.mOutputDivDOM.append(this.mForeGroundCanvasDOM);


  this.resize = function () {
    this.mBackGroundCanvasDOM.height = this.mBackGroundCanvasDOM.parentElement.clientHeight;
    this.mBackGroundCanvasDOM.width = this.mBackGroundCanvasDOM.parentElement.clientWidth;

    this.mForeGroundCanvasDOM.height = this.mForeGroundCanvasDOM.parentElement.clientHeight;
    this.mForeGroundCanvasDOM.width = this.mForeGroundCanvasDOM.parentElement.clientWidth;
  }

  this.render = function (iBackGroundFunction, iForeGroundFunction) {
    if (null != iBackGroundFunction) {
      iBackGroundFunction(this.mBackGroundCanvasDOM);
    }
    if (null != iForeGroundFunction) {
      iForeGroundFunction(this.mForeGroundCanvasDOM);
    }
  }

  this.drawArtificialHorizon = function (iCameraPosition, iTime, iPlanetModel) {

    var wCanvasDOM = this.mBackGroundCanvasDOM;
    var wHalfPi = Math.PI / 2;
    var wQuarterPi = Math.PI / 4;

    var wHour = iTime.getUTCHours();
    var wMinute = iTime.getUTCMinutes();

    var wRadius = parseFloat(iPlanetModel.Radius);
    var wInclination = parseFloat(iPlanetModel.Inclination);

    var wLatitude = parseFloat(iCameraPosition.Latitude);
    var wLongitude = parseFloat(iCameraPosition.Longitude);
    var wAltitude = parseFloat(iCameraPosition.Altitude);
    var wRoll = parseFloat(iCameraPosition.Roll);
    var wPitch = parseFloat(iCameraPosition.Pitch);
    var wYaw = parseFloat(iCameraPosition.Yaw);

    var wEarthDateRotation = (wHour + wMinute / 60) / 24;
    var wSunAzimuthWRTUTC = wEarthDateRotation*2*Math.PI + Math.PI;

    //Normalizing All Angles

    while (wInclination > Math.PI) wInclination -= 2 * Math.PI;
    while (wInclination < -Math.PI) wInclination += 2 * Math.PI;

    while (wLatitude > wHalfPi) {
      wLatitude = Math.PI - wLatitude;
      wLongitude += Math.PI;
    }
    while (wLatitude < -wHalfPi) {
      wLatitude = -Math.PI - wLatitude;
      wLongitude += Math.PI;
    }

    while (wLongitude > Math.PI) wLongitude -= 2 * Math.PI;
    while (wLongitude < -Math.PI) wLongitude += 2 * Math.PI;

    if (wAltitude < 0) wAltitude = 0;
    while (wPitch > Math.PI) wPitch -= 2 * Math.PI;
    while (wPitch < -Math.PI) wPitch += 2 * Math.PI;

    while (wPitch > wHalfPi) {
      wPitch = Math.PI - wPitch;
      wRoll += Math.PI;
      wYaw += Math.PI;
    }
    while (wPitch < -wHalfPi) {
      wPitch = -Math.PI - wPitch;
      wRoll += Math.PI;
      wYaw += Math.PI;
    }

    while (wRoll > Math.PI) wRoll -= 2 * Math.PI;
    while (wRoll < -Math.PI) wRoll += 2 * Math.PI;
    
    while (wYaw > Math.PI) wYaw -= 2 * Math.PI;
    while (wYaw < -Math.PI) wYaw += 2 * Math.PI;


    var wImageAngleSin = Math.sin(wRoll);
    var wImageAngleCos = Math.cos(wRoll);

    var wScreenCenter = {
      x: wCanvasDOM.width / 2,
      y: wCanvasDOM.height / 2,
    }

    var wScreenRadius = Math.sqrt(wScreenCenter.x * wScreenCenter.x + wScreenCenter.y * wScreenCenter.y);

    var wCtx = this.mBackGroundCanvasDOM.getContext("2d");

    //Clear screen
    wCtx.clearRect(-10, -10, wCanvasDOM.width + 20, wCanvasDOM.height + 20);

    // Draw Sky

    // Calculate Relative Sun Position in North east Frame
    var wRelativeSunAzimuthNE = wSunAzimuthWRTUTC + wLongitude;
    while (wRelativeSunAzimuthNE > Math.PI) wRelativeSunAzimuthNE -= 2 * Math.PI;
    while (wRelativeSunAzimuthNE < -Math.PI) wRelativeSunAzimuthNE += 2 * Math.PI;

    var wRelativeSunElevationNE = -wInclination * Math.sin(wEarthDateRotation) - wLatitude;
    while (wRelativeSunElevationNE > Math.PI) wRelativeSunElevationNE -= 2 * Math.PI;
    while (wRelativeSunElevationNE < -Math.PI) wRelativeSunElevationNE += 2 * Math.PI;

    // Rotate to current heading
    var wYawCos = Math.cos(wYaw);
    var wYawSin = Math.sin(wYaw);

    var wRelativeSunHeadingX = wRelativeSunElevationNE * wYawCos - wRelativeSunAzimuthNE * wYawSin;
    var wRelativeSunHeadingY = wRelativeSunElevationNE * wYawSin + wRelativeSunAzimuthNE * wYawCos;

    // Subtract the pitch
    var wRelativeSunPitchX = (wHalfPi - wRelativeSunHeadingX) - wPitch;
    var wRelativeSunPitchY = wRelativeSunHeadingY;

    // Rotate for Roll
    var wRollCos = Math.cos(-wRoll);
    var wRollSin = Math.sin(-wRoll);
    var wRelativeSunRollX = wRelativeSunPitchX * wRollCos - wRelativeSunPitchY * wRollSin;
    var wRelativeSunRollY = wRelativeSunPitchX * wRollSin + wRelativeSunPitchY * wRollCos;


    var wSunPositionCos = Math.cos(wRelativeSunAzimuthNE);
    var wSunPositionSin = Math.sin(wRelativeSunAzimuthNE);


    var wMultitplier = 0.5*(wSunPositionCos + 1.0);
    if (wMultitplier < 0) wMultitplier = 0;

    wCtx.fillStyle = "rgba( " + 10 + ", " + (wMultitplier * 150) + "," + (wMultitplier * 255) + ", 1.0)";
    wCtx.fillRect(-10, -10, wCanvasDOM.width + 20, wCanvasDOM.height + 20);

    // Add Abs Check to the Angle
    // Sun Radial Glow gradient
    var wSunCenterEarthAxis = {
      x: wScreenCenter.x - 1.5 * wScreenRadius * (wRelativeSunRollY / wHalfPi),
      y: wScreenCenter.y - 1.5 * wScreenRadius * (wRelativeSunRollX / wHalfPi),
    }

    var wGradient = wCtx.createRadialGradient(wSunCenterEarthAxis.x, wSunCenterEarthAxis.y, 0, wSunCenterEarthAxis.x, wSunCenterEarthAxis.y, wScreenRadius);
    wGradient.addColorStop(0.0, "rgba( 255, 255, 255 , 1.0)");
    wGradient.addColorStop(0.05, "rgba( 255, 255, 255 , 1.0)");
    wGradient.addColorStop(0.10, "rgba( 255, 255, 255 , 0.5)");
    wGradient.addColorStop(0.75, "rgba( 255, 255, 255 , 0.0)");

    // Fill with gradient
    wCtx.fillStyle = wGradient;
    wCtx.fillRect(-10, -10, wCanvasDOM.width + 20, wCanvasDOM.height + 20);

    // Artificial Horizon
    
    var wGradientCurvatureRadius = 0.1*wRadius
    var wGradientStart = {
      x: -(wScreenRadius + wGradientCurvatureRadius) * wImageAngleSin + wScreenCenter.x,
      y: (wScreenRadius + wGradientCurvatureRadius) * wImageAngleCos + wScreenCenter.y,
    }

    var wGradientEnd = {
      x: wScreenRadius * wImageAngleSin + wScreenCenter.x,
      y: -wScreenRadius * wImageAngleCos + wScreenCenter.y,
    }

    var wHorizonAngle = wHalfPi - Math.asin(wRadius / (wRadius + wAltitude));
    var wScreenHorizonAngle = wHorizonAngle * Math.cos(wPitch) + wPitch;
    var wArtificalHorizonRatio = 0.5 - wScreenHorizonAngle / (Math.PI);

    var wSkyShadeRatio = 1 - wScreenHorizonAngle / wHalfPi;
    if (wSkyShadeRatio > 1.0) wSkyShadeRatio = 1.0;
    if (wSkyShadeRatio < 0.0) wSkyShadeRatio = 0.0;

    if (wArtificalHorizonRatio > 1.0) wArtificalHorizonRatio = 1.0;

    var wGroundShadeRatio2 = wScreenHorizonAngle / -wHalfPi;
    if (wGroundShadeRatio2 > 1.0) wGroundShadeRatio2 = 1.0;
    if (wGroundShadeRatio2 < 0.0) wGroundShadeRatio2 = 0.0;

    var wGroundShadeRatio = wArtificalHorizonRatio + 0.3 * (wGroundShadeRatio2 - wArtificalHorizonRatio);

    // Create Sky Ground gradient
    var wGradient = wCtx.createRadialGradient(wGradientStart.x, wGradientStart.y, wGradientCurvatureRadius, wGradientStart.x, wGradientStart.y, wGradientCurvatureRadius + 2*wScreenRadius);
      
    wGradient.addColorStop(0.0, "rgba( 255, 255, 255 , 1.0)");
    wGradient.addColorStop(wGroundShadeRatio2, "rgba( 255, 255, 255  , 1.0)");
    wGradient.addColorStop(wGroundShadeRatio, "rgba( 217, 159, 0 , 1.0)");
    wGradient.addColorStop(wArtificalHorizonRatio, "rgba( 144, 106, 0 , 1.0)");
    wGradient.addColorStop(wArtificalHorizonRatio, "rgba( 255, 255, 255 , 1.0)");
    wGradient.addColorStop(wSkyShadeRatio, "rgba( 255, 255, 255 , 0.0)");
    wGradient.addColorStop(1.0, "rgba( 255, 255, 255 , 0.0)");

    // Fill with gradient
    wCtx.fillStyle = wGradient;
    wCtx.fillRect(-10, -10, wCanvasDOM.width + 20, wCanvasDOM.height + 20);


    // Radial Glow gradient
    var wGradient = wCtx.createRadialGradient(wScreenCenter.x, wScreenCenter.y, 0, wScreenCenter.x, wScreenCenter.y, wScreenRadius);
    wGradient.addColorStop(0.0, "rgba( 0, 0, 0 , 0.0)");
    wGradient.addColorStop(0.5, "rgba( 0, 0, 0 , 0.0)");
    wGradient.addColorStop(0.75, "rgba( 0, 0, 0 , 0.125)");
    wGradient.addColorStop(1.0, "rgba( 0, 0, 0 , 0.25)");

    // Fill with gradient
    wCtx.fillStyle = wGradient;
    wCtx.fillRect(-10, -10, wCanvasDOM.width + 20, wCanvasDOM.height + 20);
  }
}