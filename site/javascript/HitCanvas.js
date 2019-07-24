function HitCanvas(iCanvas, iShowHitCanvas) {
  this.mHitCanvas = document.createElement('canvas');
  this.mHitCanvas.id = iCanvas.id + "_hitCanvas";
  if (true == iShowHitCanvas) {
    document.body.appendChild(this.mHitCanvas);
  }

  this.mMainCanvas = iCanvas;
  this.mHitObjectList = [];
  this.mColorId = 0;

  this.resize = function(){
    this.mHitCanvas.width = this.mMainCanvas.clientWidth;
    this.mHitCanvas.height = this.mMainCanvas.clientHeight;
  }
  
  this.reset = function() {
    this.resize();
    this.mColorId = 0;
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
    
    this.mColorId += 1;
    var wColor = convertColorIdToColor(this.mColorId );

    wCtx.strokeStyle = wColor;
    wCtx.fillStyle = wColor;
    
    var wObjectId = iDrawHitAreaFunction(this.mHitCanvas, wColor );
    this.mHitObjectList.push(wObjectId);
  }

  
  this.onClick = null;
  this.mMainCanvas.addEventListener('click', function (e) {
    var wScroll = getAllScroll(this.mMainCanvas);
    var wMousePos = {
      x: e.clientX - this.mMainCanvas.offsetLeft + wScroll.x,
      y: e.clientY - this.mMainCanvas.offsetTop  + wScroll.y

    }
    
    var wCtx = this.mHitCanvas.getContext("2d");
    
    this.mColorId += 10;
    var wColor = convertColorIdToColor(this.mColorId );
    wCtx.strokeStyle = wColor;
    wCtx.fillStyle = wColor;
    
    wCtx.beginPath();
    wCtx.arc(wMousePos.x, wMousePos.y, 50, 0, 2 * Math.PI);
    wCtx.stroke();
    wCtx.fill();
  }.bind(this));

}