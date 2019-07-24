function HitCanvas(iCanvas, iShowHitCanvas) {
  this.mHitCanvas = document.createElement('canvas');
  this.mHitCanvas.id = iCanvas.id + "_hitCanvas";
  if (true == iShowHitCanvas) {
    document.body.appendChild(this.mHitCanvas);
  }

  this.mMainCanvas = iCanvas;
  this.mHitObjectList = [];

  this.resize = function(){
    this.mHitCanvas.width = this.mMainCanvas.clientWidth;
    this.mHitCanvas.height = this.mMainCanvas.clientHeight;
  }
  
  this.reset = function() {
    this.resize();
    this.mHitObjectList = [];

    var wCtx = this.mHitCanvas.getContext("2d");
    var wColor = convertColorIdToColor(this.mColorId );
    wCtx.strokeStyle = wColor;
    wCtx.fillStyle = wColor;
    wCtx.fillRect(0, 0, this.mHitCanvas.width, this.mHitCanvas.height);
  }
  this.reset();
  window.addEventListener('resize', this.reset.bind(this))
  
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
    var wPixel = wCtx.getImageData(iX, iY, 1, 1).data;
    var wColorId = convertColorToColorId(wPixel[0],wPixel[1],wPixel[2]);
    
    if (wColorId < this.mHitObjectList.length) {
      return this.mHitObjectList[wColorId];
    }
    return -1;    
  }


  this.onClick = null;
  this.mMainCanvas.addEventListener('click', function (e) {
    var wScroll = getAllScroll(this.mMainCanvas);
    var wMousePos = getDOMRelativeMousePosition(this.mMainCanvas, e.clientX, e.clientY);
    var wHiObjectId = this.getLocationHitObjectId(wMousePos.x, wMousePos.y);
    
    var wCtx = this.mHitCanvas.getContext("2d");
    
    wCtx.strokeStyle = "blue";
    wCtx.beginPath();
    wCtx.arc(wMousePos.x, wMousePos.y, 10, 0, 2 * Math.PI);
    wCtx.stroke();

  }.bind(this));

}