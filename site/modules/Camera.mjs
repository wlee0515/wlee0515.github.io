export default {

  getStream :  function (iConstraints) {
    return navigator.mediaDevices.getUserMedia(iConstraints);
  },

  getStreamByDeviceId : function (iDeviceId) {
    const constraints = {
      audio: false,
      video: { deviceId: { exact: iDeviceId } }
    };

    return this.getStream(constraints);
  },

  getStreamByFacingMode : function (iDirection) {

    const constraints = {
      audio: false,
      video: { facingMode: { exact: iDirection } }
    };

    return this.getStream(constraints);
  },
  
  getStream_FrontCamera : function () {
    return this.getStreamByFacingMode("user");
  },

  getStream_BackCamera : function () {
    return this.getStreamByFacingMode("environment");
  },

  getDeviceList : function () {
    // Only works after "navigator.mediaDevices.getUserMedia(iConstraints)" is called
    return navigator.mediaDevices.enumerateDevices();
  },

  getCameraList : function() {

    const constraints = { audio : {}, video : {}};
    return this.getStream(constraints).then(Camera.getDeviceList).then( function (iDeviceList) {

      var wCameraList = [];
  
      // Loop through device list
      for (const wDeviceInfo of iDeviceList) {
        if (wDeviceInfo.kind === 'videoinput') {
          wCameraList.push(wDeviceInfo);
        }
      }

      return wCameraList;
  
    });
  },

  createLiveVideoDOM : function () {
    var wNewVideo = document.createElement('video');
    wNewVideo.autoplay = true;
    wNewVideo.setAttribute("muted", null);
    wNewVideo.setAttribute("playsinline", null);
    return wNewVideo;
  },

  setVideoDOMStream : function (iVideoDOM, iNewStream) {
    if (null != iVideoDOM) {
      if (null != iVideoDOM.srcObject) {
        iVideoDOM.srcObject.getTracks().forEach(track => { track.stop(); });
      }
      iVideoDOM.srcObject = iNewStream;
    }
  },
}