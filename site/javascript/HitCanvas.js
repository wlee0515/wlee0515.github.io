eEventAndKey = {
  onclick : "click",
  onwheel : "wheel",
  onmousedown : "mousedown",
  onmouseup : "mouseup",
  onmouseenter : "mouseenter",
  onmouseleave : "mouseleave",
  onmousemove : "mousemove",
  onmouseover : "mouseover",
  onmouseout : "mouseout",
}

function HitCanvas(iCanvas, iShowHitCanvas) {
  this.mHitCanvas = document.createElement('canvas');
  this.mHitCanvas.id = iCanvas.id + "_hitCanvas";
  if (true == iShowHitCanvas) {
    document.body.appendChild(this.mHitCanvas);
  }

  this.mMainCanvas = iCanvas;
  this.mHitObjectList = [];

  this.reset = function() {
    
    this.mHitCanvas.width = this.mMainCanvas.clientWidth;
    this.mHitCanvas.height = this.mMainCanvas.clientHeight
    this.mHitObjectList = [];

    var wCtx = this.mHitCanvas.getContext("2d");
    var wColor = convertColorIdToColor(this.mColorId );
    wCtx.strokeStyle = "white";
    wCtx.fillStyle = "white";
    wCtx.fillRect(0, 0, this.mHitCanvas.width, this.mHitCanvas.height);
  }
  this.reset();
  
  this.draw = function(iDrawHitAreaFunction) {
  
    var wCtx = this.mHitCanvas.getContext('2d');
    var wColor = convertColorIdToColor(this.mHitObjectList.length);
    wCtx.strokeStyle = wColor;
    wCtx.fillStyle = wColor;
    var wObjectId = iDrawHitAreaFunction(this.mHitCanvas, wColor );

    this.mHitObjectList.push(wObjectId);
  }

  this.getLocationHitObjectId = function(iX, iY) {
    var wCtx = this.mHitCanvas.getContext("2d");
    
    wCtx.strokeStyle = "blue";
    wCtx.beginPath();
    wCtx.arc(iX, iY, 10, 0, 2 * Math.PI);
    wCtx.stroke();

    var wPixel = wCtx.getImageData(iX, iY, 1, 1).data;
    var wColorId = convertColorToColorId(wPixel[0],wPixel[1],wPixel[2]);
    
    if (wColorId < this.mHitObjectList.length) {
      return this.mHitObjectList[wColorId];
    }
    return null;    
  }

  for (key in eEventAndKey){
    this[key] = null;
    this.mMainCanvas.addEventListener(eEventAndKey[key], function(e){
      
      for (key2 in eEventAndKey) {
        if (e.type == eEventAndKey[key2]){
          if (null != this[key2]) {
            var wMousePos = getDOMRelativeMousePosition(this.mMainCanvas, e.clientX, e.clientY);
            var wHiObjectId = this.getLocationHitObjectId(wMousePos.x, wMousePos.y);
            this[key2](e, wHiObjectId);

          }
          return;
        }
      }
    }.bind(this));
  }
}