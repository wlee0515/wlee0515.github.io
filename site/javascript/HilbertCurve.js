
var HilbertCurve = {
  xy2d : function (iSize, iX, iY) {
    
    // Code from Wikipedia
    /*
    //convert (x,y) to d
    int xy2d (int n, int x, int y) {
    int rx, ry, s, d=0;
    for (s=n/2; s>0; s/=2) {
      rx = (x & s) > 0;
      ry = (y & s) > 0;
      d += s * s * ((3 * rx) ^ ry);
      rot(s, &x, &y, rx, ry);
    }
    return d;
    }
    */

    var wRx, wRy, wS, wd = 0, wX = iX, wY = iY;

    for (var wS = Math.floor(iSize / 2); wS > 0; wS = Math.floor(wS / 2)) {
      if (Math.abs(wX) % (2 * wS) >= wS) {
        wRx = 1;
      }
      else {
        wRx = 0;
      }

      if (Math.abs(wY) % (2 * wS) >= (wS - 1)) {
        wRy = 1;
      }
      else {
        wRy = 0;
      }

      wd += wS * wS * Math.abs(3 * wRx - wRy);

      var wRot = this.rot(wS, wX, wY, wRx, wRy);
      wX = wRot.x;
      wY = wRot.y;
    }
    return wd;

  },

  d2xy : function (iSize, iD) {

    // Code from Wikipedia
  /*
  //convert d to (x,y)
  void d2xy(int n, int d, int *x, int *y) {
    int rx, ry, s, t=d;
    *x = *y = 0;
    for (s=1; s<n; s*=2) {
      rx = 1 & (t/2);
      ry = 1 & (t ^ rx);
      rot(s, x, y, rx, ry);
      *x += s * rx;
      *y += s * ry;
      t /= 4;
    }
  }
  */

    var wRx, wRy, wT = iD, wX = 0; wY = 0;

    for (var wS = 1; wS < iSize; wS *= 2) {
      wRx = 0;
      if ((Math.floor(wT / 2) % 2) == 1) {
        wRx = 1;
      }

      wRy = 0;

      if ((wT % 2) != wRx) {
        wRy = 1;
      }

      var wRot = this.rot(wS, wX, wY, wRx, wRy);

      wX = wRot.x + wRx * wS;
      wY = wRot.y + wRy * wS;
      wT = Math.floor(wT / 4);
    }

    return {
      x: wX,
      y: wY
    }
  },

  rot : function (iSize, iX, iY, iRx, iRy) {
    
    // Code from Wikipedia
   /*
   //rotate/flip a quadrant appropriately
   void rot(int n, int *x, int *y, int rx, int ry) {
     if (ry == 0) {
       if (rx == 1) {
         *x = n-1 - *x;
         *y = n-1 - *y;
       }

       //Swap x and y
       int t  = *x;
       *x = *y;
       *y = t;
     }
   }
   */
    var wx = iX, wy = iY;

    if (iRy == 0) {
      if (iRx == 1) {
        wx = iSize - 1 - wx;
        wy = iSize - 1 - wy;
      }

      var t = wx;
      wx = wy;
      wy = t;
    }

    return {
      x: wx,
      y: wy
    }
  },

  CurveMap : {
    createCurveMapObject : function (iCurveOrder) {

      var wNumberOfDataPerAxis = Math.pow(2, iCurveOrder);
      var wNumberOfData = wNumberOfDataPerAxis * wNumberOfDataPerAxis;
      var wDtoX = new Int32Array(wNumberOfData);
      var wDtoY = new Int32Array(wNumberOfData);
      var wXYToD = new Int32Array(wNumberOfData);

      var wCurveMap = {
        Order: iCurveOrder,
        NumberOfDataPerAxis: wNumberOfDataPerAxis,
        NumberOfData: wNumberOfData,
        DtoX: wDtoX,
        DtoY: wDtoY,
        XYToD: wXYToD,
      };

      return wCurveMap;
    },

    computeCurveMap : function(iCurveOrder) {
      var wCurveMap = this.createCurveMapObject(iCurveOrder);
      return this.computeCurveMapInterval(iCurveOrder, null, 0, wCurveMap.NumberOfData);
    },

    computeCurveMapInterval : function(iOrder, iCurveMapObject, iStart, iEnd) {

      var wCurveMap = null;
      
      if (null != iCurveMapObject) {
        if (iOrder == iCurveMapObject.Order) {
          wCurveMap = iCurveMapObject;
        }
      }
  
      if (null == wCurveMap){
        wCurveMap = this.createCurveMapObject(iOrder);
      }
  
      for (var wi = iStart; (wi < iEnd) && (wi < wCurveMap.NumberOfData); ++wi) {
        var wXY = HilbertCurve.d2xy(wCurveMap.NumberOfDataPerAxis, wi);
        wCurveMap.DtoX[wi] = wXY.x;
        wCurveMap.DtoY[wi] = wXY.y;
        
        var wIndex = wXY.y* wCurveMap.NumberOfDataPerAxis + wXY.x;
        if (wIndex < wCurveMap.NumberOfData) {
          wCurveMap.XYToD[wIndex] = wi;
        }
      }
  
      return wCurveMap;
    }
  }

}
