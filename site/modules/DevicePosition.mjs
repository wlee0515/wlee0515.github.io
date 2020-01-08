var DevicePositionHelperFunctions = {

  degToRad: function (iAngle) {
    return iAngle * Math.PI / 180.0;
  },

  radToDeg: function (iAngle) {
    return iAngle * 180.0 / Math.PI;
  },

  normalizeAngle_Sign180deg: function (iAngle) {
    var wAngle = iAngle;
    while (wAngle > 180) {
      wAngle -= 360;
    }

    while (wAngle < -180) {
      wAngle += 360;
    }
    return wAngle;
  },

  normalizeAngle_360deg: function (iAngle) {
    var wAngle = iAngle;
    while (wAngle > 360) {
      wAngle -= 360;
    }

    while (wAngle < 0) {
      wAngle += 360;
    }
    return wAngle;
  },


  normalizeAngle_Sign180rad: function (iAngle) {
    var wAngle = iAngle;
    while (wAngle > Math.PI) {
      wAngle -= 2 * Math.PI;
    }

    while (wAngle < -Math.PI) {
      wAngle += 2 * Math.PI;
    }
    return wAngle;
  },

  normalizeAngle_360rad: function (iAngle) {
    var wAngle = iAngle;
    while (wAngle > 2 * Math.PI) {
      wAngle -= 2 * Math.PI;
    }

    while (wAngle < 0) {
      wAngle += 2 * Math.PI;
    }
    return wAngle;
  },

  convertFromePhoneToScreenAxis : function (ix, iy, iz) {
    /* iPhone Orientation
        Y
        |
        Z--X 
        Chrome Orientation
        Z--X
        |
        Y
        Edge Orientation
        Y
        |
        Z--X 

        Browser Orientation
        Y
        |
        Z--X 

        Screen Orientation
        X--Y
        |
        Z
    */

    var wBrowserVector = {
      x: ix,
      y: iy,
      z: iz,
    }

    // Is Chrome
    if (null != window.chrome) {
      wBrowserVector.x *= -1;
      wBrowserVector.y *= -1;
      wBrowserVector.z *= -1;
    }

    var wScreenOrientation = 0;
    if (null != screen.orientation) {
      if (null != screen.orientation.angle) {
        wScreenOrientation = screen.orientation.angle;
      }
    }
    else if (null != window.orientation) {
      wScreenOrientation = window.orientation;
    }

    var wTemp = 0.0;
    switch (wScreenOrientation) {
      case 0:
        break;
      case 90:
      case -270:
        wTemp = wBrowserVector.x;
        wBrowserVector.x = -wBrowserVector.y;
        wBrowserVector.y = wTemp;
        break;
      case 180:
      case -180:
        wBrowserVector.x *= -1.0;
        wBrowserVector.y *= -1.0;
        break;
      case -90:
      case 270:
        wTemp = wBrowserVector.x;
        wBrowserVector.x = wBrowserVector.y;
        wBrowserVector.y = -wTemp;
        break;
    }

    var wScreenVector = {
      x : -wBrowserVector.z ,
      y : wBrowserVector.x ,
      z : -wBrowserVector.y 
    }
    return wScreenVector;
  },
}

var DevicePositionCallBackFunctions = {

  handleError : function (iError) {
    alert(iError);
  },

  StartService : function (iTarget) {

    alert("StartService  - Start");
    if (window.DeviceOrientationEvent) {
      alert("Sending Request of Orientation");

      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+
        DeviceOrientationEvent.requestPermission()
          .then(response => {
            if (response == 'granted') {
              window.addEventListener('deviceorientation', this.updateDeviceOrientation.bind(iTarget));
            }
            else {
              alert("Device Orientation Denied");
            }
          })
          .catch(handleError)
      } else {
        window.addEventListener("deviceorientation", this.updateDeviceOrientation.bind(iTarget));
      }

    } else {
      alert("Sorry, your browser doesn't support Device Orientation");
    }


    if (window.DeviceMotionEvent) {

      alert("Sending Request for Motion");
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        // iOS 13+
        DeviceMotionEvent.requestPermission()
          .then(response => {
            if (response == 'granted') {
              alert("Request Device Motion Granted");
              window.addEventListener('devicemotion', this.updateDeviceMotion.bind(iTarget));
            }
            else {
              alert("Device Motion Denied");
            }
          })
          .catch(handleError)
      } else {
        window.addEventListener("devicemotion", this.updateDeviceMotion.bind(iTarget));
      }

    } else {
      alert("Sorry, your browser doesn't support Device Motion");
    }


    const options = {
      enableHighAccuracy: true,
      timeout: 500,
      maximumAge: 0
    };

    if (navigator.geolocation) {
      alert("Sending Request for GPS");

      navigator.geolocation.watchPosition(this.updateDeviceDevicePosition.bind(iTarget), this.handleError, options);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
    alert("StartService  - End");

  },


  StopService : function (iTarget) {
  
    window.removeEventListener("deviceorientation", this.updateDeviceMotion.bind(iTarget));
    window.removeEventListener("devicemotion", this.updateDeviceMotion.bind(iTarget));
    navigator.geolocation.clearWatch(this.updateDeviceDevicePosition.bind(iTarget));
  },

  updateDeviceOrientation : function (iOrientation) {
    
    if (null == iOrientation.alpha) {
      return;
    }

    var wHeading = -iOrientation.alpha;
    if (iOrientation.webkitCompassHeading != undefined) {
      wHeading = iOrientation.webkitCompassHeading;
    }

    wHeading = DevicePositionHelperFunctions.degToRad(wHeading);
    this.EulerAngle.psi = DevicePositionHelperFunctions.normalizeAngle_Sign180deg(wHeading);
  },

  updateDeviceMotion : function (iMotion) {

    if (null == iMotion.acceleration.x) {
      return;
    }
    
    var wBodyAcceleration = DevicePositionHelperFunctions.convertFromePhoneToScreenAxis(iMotion.acceleration.x, iMotion.acceleration.y, iMotion.acceleration.z);

    this.AccelerationBody.x = wBodyAcceleration.x;
    this.AccelerationBody.y = wBodyAcceleration.y;
    this.AccelerationBody.z = wBodyAcceleration.z;

    var wDeviceGravityVector = {
      x: iMotion.accelerationIncludingGravity.x - iMotion.acceleration.x,
      y: iMotion.accelerationIncludingGravity.y - iMotion.acceleration.y,
      z: iMotion.accelerationIncludingGravity.z - iMotion.acceleration.z,
    }

    var wScreenGravityVector = DevicePositionHelperFunctions.convertFromePhoneToScreenAxis(wDeviceGravityVector.x, wDeviceGravityVector.y, wDeviceGravityVector.z);

    var wRoll = Math.atan2(wScreenGravityVector.y, wScreenGravityVector.z);

    var wMagnitude = Math.sqrt(wScreenGravityVector.x * wScreenGravityVector.x
      + wScreenGravityVector.y * wScreenGravityVector.y
      + wScreenGravityVector.z * wScreenGravityVector.z);

    var wPitch = Math.asin(wScreenGravityVector.x / wMagnitude);
    wPitch *= -1;
    
    this.EulerAngle.phi = DevicePositionHelperFunctions.normalizeAngle_Sign180rad(wRoll);
    this.EulerAngle.theta = DevicePositionHelperFunctions.normalizeAngle_Sign180rad(wPitch);


    if (null != iMotion.rotationRate.gamma) {
      
      var wRateVector = DevicePositionHelperFunctions.convertFromePhoneToScreenAxis(
        iMotion.rotationRate.gamma,
        iMotion.rotationRate.beta,
        iMotion.rotationRate.alpha)

      this.EulerRates.phi = wRateVector.x;
      this.EulerRates.theta = wRateVector.y;
      this.EulerRates.psi = wRateVector.z;

    }
  },

  updateDeviceDevicePosition : function (iPosition) {

    if (null != iPosition.coords.latitude) {
      this.GeoCoodinate.Latitude = iPosition.coords.latitude;
    }
    
    if (null != iPosition.coords.longitude) {
      this.GeoCoodinate.Longitude = iPosition.coords.longitude;
    }

    
    if (null != iPosition.coords.altitude) {
      this.GeoCoodinate.Altitude = iPosition.coords.altitude;
    }
/*
    if (null != iPosition.coords.speed) {
      wSpeedTargetPosition = iPosition.coords.speed;
    }
*/

    /*
    var wOutput = document.getElementById("GeoPosition");
    wOutput.innerText = "";
    wOutput.innerText += "Latitude : " + position.coords.latitude + "\n";
    wOutput.innerText += "Longitude : " + position.coords.longitude + "\n";
    wOutput.innerText += "Altitude : " + position.coords.altitude + "\n";
    wOutput.innerText += "Accuracy : " + position.coords.accuracy + "\n";
    wOutput.innerText += "Altitude Accuracy : " + position.coords.altitudeAccuracy + "\n";
    wOutput.innerText += "Heading : " + position.coords.heading + "\n";
    wOutput.innerText += "Speed : " + position.coords.speed + "\n";
  
    wOutput.innerText += "TimeStamp : " + position.timestamp + "\n";
    */
  },
  
  updateDeadReckoning: function () {

  },
}

export default {

  IsInitialized: false,
  GeoCoodinate: {
    Longitude: 0.0,
    Latitude: 0.0,
    Altitude: 0.0
  },

  VelocityNED: {
    x: 0.0,
    y: 0.0,
    z: 0.0,
  },

  AccelerationNED: {
    x: 0.0,
    y: 0.0,
    z: 0.0,
  },

  AccelerationBody: {
    x: 0.0,
    y: 0.0,
    z: 0.0,
  },

  EulerAngle: {
    phi: 0.0,
    theta: 0.0,
    psi: 0.0
  },

  EulerRates: {
    phi: 0.0,
    theta: 0.0,
    psi: 0.0
  },

  StartService: function () {
    
    if (true == this.IsInitialized) {
      return;
    }
    else {
      this.IsInitialized = true;
    }

    DevicePositionCallBackFunctions.StartService(this);
  },
  
  StopService: function () {
    
    if (false == this.IsInitialized) {
      return;
    }
    else {
      this.IsInitialized = false;
    }

    DevicePositionCallBackFunctions.StopService(this);
  },
/*
  getGeoLocation: function () {

  },

  getNEDVelocityVector: function () {

  },

  getNEDAccelerationVector: function () {

  },

  getEulerAngle: function () {

  },

  getEulerRates: function () {

  },

  getRelativeNEDVector: function (iLatitude, iLongitude, iAltitude) {

  },*/
}