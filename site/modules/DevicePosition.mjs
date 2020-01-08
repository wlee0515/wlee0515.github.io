import CommonMath from "./CommonMath.mjs";

var DevicePositionHelperFunctions = {

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

    if (window.DeviceOrientationEvent) {

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
          .catch(this.handleError)
      } else {
        window.addEventListener("deviceorientation", this.updateDeviceOrientation.bind(iTarget));
      }

    } else {
      alert("Sorry, your browser doesn't support Device Orientation");
    }

    if (window.DeviceMotionEvent) {

      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        // iOS 13+
        DeviceMotionEvent.requestPermission()
          .then(response => {
            if (response == 'granted') {
              window.addEventListener('devicemotion', this.updateDeviceMotion.bind(iTarget));
            }
            else {
              alert("Device Motion Denied");
            }
          })
          .catch(this.handleError)
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
      navigator.geolocation.watchPosition(this.updateDeviceDevicePosition.bind(iTarget), this.handleError, options);
    } else {
      alert("Geolocation is not supported by this browser.");
    }

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

    wHeading = CommonMath.degToRad(wHeading);
    this.EulerAngle.psi = CommonMath.normalizeAngle_Sign180deg(wHeading);
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
    
    this.EulerAngle.phi = CommonMath.normalizeAngle_Sign180rad(wRoll);
    this.EulerAngle.theta = CommonMath.normalizeAngle_Sign180rad(wPitch);


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