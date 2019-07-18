<!--

function normalizeAngle(iAngle)
{
  var wAngle = iAngle;
  while (wAngle > Math.PI)
  {
    wAngle -= 2*Math.PI;
  }

  while (wAngle < -Math.PI)
  {
    wAngle += 2 * Math.PI;
  }
  return wAngle;
}

function Vector2d ( iX=0, iY=0) {
  this.x = iX;
  this.y = iY;
}

var Vector2dOp = {
  
  scale : function(iScale, iVector2d){
    return new Vector2d (
      iScale*iVector2d.x,
      iScale*iVector2d.y
      );
  },

  add : function(iVector2d1, iVector2d2){
    return new Vector2d (
      iVector2d1.x + iVector2d2.x,
      iVector2d1.y + iVector2d2.y
      );
  },
  
  subtract : function(iVector2d1, iVector2d2){
    return new Vector2d (
      iVector2d1.x - iVector2d2.x,
      iVector2d1.y - iVector2d2.y
      );
  },
  
  cross : function(iVector2d1, iVector2d2){
    return iVector2d1.x * iVector2d2.y - iVector2d1.x * iVector2d2.y;
  },
  
  dot : function(iVector2d1, iVector2d2){
    return iVector2d1.x * iVector2d2.x + iVector2d1.y * iVector2d2.y;
  },
  
  sqMag : function(iVector2d){
    return this.dot(iVector2d,iVector2d);
  },
  
  mag : function(iVector2d){
    return Math.sqrt(this.sqMag(iVector2d));
  },

  unitvector : function(iVector2d){
    var wSqMag = this.sqMag(iVector2d);
    if (0.000000001 > wSqMag) {
      return { x:0.0,y:0.0};
    }
    return this.scale (1/ Math.sqrt(wSqMag), iVector2d);
  },

  getAngle : function(iVector2d){
    return Math.atan2(iVector2d.y, iVector2d.x);
  },

  getInBetweenAngle : function(iVector2d1, iVector2d2){
    return Math.acos(this.dot(iVector2d1, iVector2d2)/(this.mag(iVector2d1)*this.mag(iVector2d2)));
  },

  getRotate : function (iVector2d, iAngle) {
    var wCos = Math.cos(iAngle);
    var wSin = Math.sin(iAngle);

    return new Vector2d( 
      iVector2d.x*wCos - iVector2d.y*wSin ,
      iVector2d.x*wSin + iVector2d.y*wCos
    )
  },

  getClosest : function(iVector2d, iVector2dList) {
        
    var wIndex = 0;
    var wDX = iVector2d.x - iVector2dList[wIndex].x;
    var wDY = iVector2d.y - iVector2dList[wIndex].y;

    var wDistance = wDX * wDX + wDY * wDY;

    for (var i = 1; i < iVector2dList.length; ++i) {
        wDX = iVector2d.x - iVector2dList[i].x;
        wDY = iVector2d.y - iVector2dList[i].y;

        var wNewDistance = wDX * wDX + wDY * wDY;

        if (wNewDistance < wDistance) {
            wIndex = i;
            wDistance = wNewDistance;
        }
    }

    return {
        index : wIndex,
        Vector2d : iVector2dList[wIndex]
    }
  },
}

-->