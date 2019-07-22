var eAxisAttributeName = {
  Scale : "scale",
  Offset : "offset",
  Position : "position",
  Color : "color",
}

var eLineAttributeName = {  
  Data : "data",
  Color : "color",
  XAxisDataIndex : "XAxisDataIndex",
  XAxisIndex : "XAxisIndex",
  YAxisIndex : "YAxisIndex",
}

function GraphAxis() {
  this.mScale = 1.0;
  this.mOffset = 0.0;
  this.mPosition = 0.0;
  this.mColor = "#000000";
  
  this.setAxisAttribute = function(iAttribute, iValue) {

    if (eAxisAttributeName.Scale == iAttribute) {
      this.mScale = parseFloat(iValue);
      return true;
    }
    else if (eAxisAttributeName.Offset == iAttribute) {
      this.mOffset = parseFloat(iValue);
      return true;
    }
    else if (eAxisAttributeName.Position == iAttribute) {
      this.mPosition = parseFloat(iValue);
      return true;
    }
    else if (eAxisAttributeName.Color == iAttribute) {
      this.mColor = iValue;
      return true;
    }
    return false;
  }

  this.getAxisAttribute = function(iAttribute) {

    if (eAxisAttributeName.Scale == iAttribute) {
      return this.mScale;
    }
    else if (eAxisAttributeName.Offset == iAttribute) {
      return this.mOffset;
    }
    else if (eAxisAttributeName.Position == iAttribute) {
      return this.mPosition;
    }
    else if (eAxisAttributeName.Color == iAttribute) {
      return this.mColor;
    }
    return null;
  }
}

function GraphLine() {
  this.mData = [];
  this.mColor = "#000000";
  this.mXAxisDataIndex = "Data_Index";
  this.mXAxisIndex = "";
  this.mYAxisIndex = "";
  
  this.setLineAttribute = function(iAttribute, iValue) {

    if (eLineAttributeName.Data == iAttribute) {
      this.mData = iValue;
      return true;
    }
    else if (eLineAttributeName.Color == iAttribute) {
      this.mColor = iValue;
      return true;
    }
    else if (eLineAttributeName.XAxisDataIndex == iAttribute) {
      this.mXAxisDataIndex = iValue;
      return true;
    }
    else if (eLineAttributeName.XAxisIndex == iAttribute) {
      this.XAxisIndex = iValue;
      return true;
    }
    else if (eLineAttributeName.YAxisIndex == iAttribute) {
      this.YAxisIndex = iValue;
      return true;
    }
    return false;
  }

  this.getAxisAttribute = function(iAttribute) {

    if (eLineAttributeName.Data == iAttribute) {
      return this.mData;
    }
    else if (eLineAttributeName.Color == iAttribute) {
      return this.mColor;
    }
    else if (eLineAttributeName.XAxisDataIndex == iAttribute) {
      return this.mXAxisDataIndex;
    }
    else if (eLineAttributeName.XAxisIndex == iAttribute) {
      return this.XAxisIndex;
    }
    else if (eLineAttributeName.YAxisInde == iAttribute) {
      return this.YAxisIndex;
    }
    return null;
  }
} 
  
function Graph() {

  this.mVerticalAxis = [];
  this.mHorizontalAxis = [];
  this.mGraphLine = [];
  this.mGraphLine["Data_Index"] = new GraphLine();

  this.mCanvasList = [];

  this.getVerticalAxis = function (iAxisIndex) {
    if (null == this.mVerticalAxis[iAxisIndex]) {
      this.mVerticalAxis[iAxisIndex] = new GraphAxis();

    }
    return this.mVerticalAxis[iAxisIndex];
  }

  this.getHorizontalAxis = function (iAxisIndex) {
    if (null == this.mHorizontalAxis[iAxisIndex]) {
      this.mHorizontalAxis[iAxisIndex] = new GraphAxis();
    }
    return this.mHorizontalAxis[iAxisIndex];
  }

  this.removeVerticalAxis = function (iAxisIndex) {
    this.mVerticalAxis[iAxisIndex] = null;
  }

  this.removeHorizontalAxis = function (iAxisIndex) {
    this.mHorizontalAxis[iAxisIndex] = null;
  }

  this.getGraphLine = function (iLineIndex) {
    if (null == this.mGraphLine[iLineIndex]) {
      this.mGraphLine[iLineIndex] = new GraphLine();
    }
    return this.mGraphLine[iLineIndex];
  }

  this.removeGraphLine = function (iLineIndex) {
    this.mGraphLine[iLineIndex] = null;
  }

  this.setAxisAttribute = function(iIsHorizontalAxis, iAxisIndex, iAttribute, iValue) {
    var wAxisRef = null;
    if (true == iIsHorizontalAxis) {
      wAxisRef = this.getHorizontalAxis(iAxisIndex);
    }
    else {
      wAxisRef = this.getVerticalAxis(iAxisIndex);
    }

    if (null != wAxisRef) {
      return  wAxisRef.setAxisAttribute(iAttribute, iValue);
    }

    return false;
  }
  
  this.getAxisAttribute = function(iIsHorizontalAxis, iAxisIndex, iAttribute) {
    var wAxisRef = null;
    if (true == iIsHorizontalAxis) {
      wAxisRef = this.getHorizontalAxis(iAxisIndex);
    }
    else {
      wAxisRef = this.getVerticalAxis(iAxisIndex);
    }

    if (null != wAxisRef) {
      return  wAxisRef.getAxisAttribute(iAttribute);
    }
    
    return null;
  }

  this.setLineAttribute = function(iLineIndex, iAttribute, iValue) {
    var wLineRef = this.getGraphLine(iLineIndex);

    if (null != wLineRef) {
      return  wLineRef.setLineAttribute(iAttribute, iValue);
    }

    return false;
  }
  
  this.getLineAttribute = function(iLineIndex, iAttribute) {
    var wLineRef = this.getGraphLine(iLineIndex);

    if (null != wLineRef) {
      return  wLineRef.getLineAttribute(iAttribute);
    }
    
    return null;
  }

  this.setAxisScale = function (iIsHorizontalAxis = false, iAxisIndex = null, iScale = 1) {
    this.setAxisAttribute(iIsHorizontalAxis, iAxisIndex, eAxisAttributeName.Scale, iScale);
  }

  this.setAxisOffset = function (iIsHorizontalAxis = false, iAxisIndex = null, iOffset = 0) {
    this.setAxisAttribute(iIsHorizontalAxis, iAxisIndex, eAxisAttributeName.Offset, iOffset);
  }

  this.setAxisPosition = function (iIsHorizontalAxis = false, iAxisIndex = null, iPosition = 0) {
    this.setAxisAttribute(iIsHorizontalAxis, iAxisIndex, eAxisAttributeName.Position, iPosition);
  }

  this.setAxisColor = function (iIsHorizontalAxis = false, iAxisIndex = null, iColor = "black") {
    this.setAxisAttribute(iIsHorizontalAxis, iAxisIndex, eAxisAttributeName.Color, iColor);
  }

  this.renderCanvas = function (iCanvasDOM) {

    var wCtx = iCanvasDOM.getContext("2d");
    wCtx.strokeStyle = "red";
    var wLine = [[100, 0], [0, 0], [0, 100]];
    drawPolyLine(iCanvasDOM, wLine);

    var wDomWidth = iCanvasDOM.width;
    var wDomHeight = iCanvasDOM.height;
    var wBaseScale = 10;
    var wNajorIncrement = 10;
    var wMinorIncrement = 5;
    var wMajorLength = 20;
    var wMinorLength = 20;
    var wNajorLineWidth = 1;
    var wMinorLineWidth = 0.5;

    var wDefaultAxisX = "";
    
    for (key in this.mHorizontalAxis) {
      var wAxis = this.mHorizontalAxis[key];
      if (null != wAxis) {
        
        if ("" == wDefaultAxisX) {
          wDefaultAxisX = key;
        }

        wCtx.strokeStyle = wAxis.mColor;
        var wScale = wBaseScale * wAxis.mScale;
        drawNumberLine(iCanvasDOM, -wDomWidth, wAxis.mPosition, wDomWidth, wAxis.mPosition,
          wScale * wAxis.mOffset, wAxis.mPosition + 50, 0,
          wScale,
          wNajorIncrement, wMinorIncrement,
          wMajorLength, wMinorLength,
          wNajorLineWidth, wMinorLineWidth);
      }
    }

    var wDefaultAxisY = "";

    for (key in this.mVerticalAxis) {
      var wAxis = this.mVerticalAxis[key];
      if (null != wAxis) {

        if ("" == wDefaultAxisY) {
          wDefaultAxisY = key;
        }

        wCtx.strokeStyle = wAxis.mColor;
        var wScale = wBaseScale * wAxis.mScale;
        drawNumberLine(iCanvasDOM, wAxis.mPosition, wDomHeight, wAxis.mPosition, -wDomHeight,
          wAxis.mPosition + 50, wScale * wAxis.mOffset, 0,
          wScale,
          wNajorIncrement, wMinorIncrement,
          wMajorLength, wMinorLength,
          wNajorLineWidth, wMinorLineWidth);
      }
    }

    for (key in this.mGraphLine) {
      var wLine = this.mGraphLine[key];
      if (null != wLine) {

        if ((null == wLine.mData) || ( 0 == wLine.mData.length)) {
          continue;
        }
        var wXAxisRef = this.mHorizontalAxis[wDefaultAxisX];
        var wYAxisRef = this.mVerticalAxis[wDefaultAxisY];

        if ("" != wLine.mXAxisIndex) {
          if (null != this.mHorizontalAxis[wLine.mXAxisIndex]) {
            wXAxisRef = this.mHorizontalAxis[wLine.mXAxisIndex];
          }
          else {
            wLine.mXAxisIndex = wDefaultAxisX;
          }
        }

        if ("" != wLine.mYAxisIndex) {
          if (null != this.mVerticalAxis[wLine.mXAxisIndex]) {
            wYAxisRef = this.mVerticalAxis[wLine.mXAxisIndex];
          }  
          else {
            wLine.mXAxisIndex = wDefaultAxisY;
          }
        }

        if ((null == wXAxisRef) || (null == wYAxisRef)) {
          continue;
        }
        
        var wUseIndex = true;
        var wXData = null;

        if ("Data_Index" != wLine.mXAxisDataIndex) {
          var wXData = this.mGraphLine[wLine.mXAxisDataIndex];
          if (null != wXData) {
            wUseIndex = false;
          }  
        }

        var wXScale = wBaseScale * wXAxisRef.mScale;
        var wXOffset = wXAxisRef.mOffset;
        var wYScale = wBaseScale * wYAxisRef.mScale;
        var wYOffset = wYAxisRef.mOffset;
      
        wCtx.strokeStyle = wLine.mColor;
        if (true == wUseIndex) {
          wCtx.beginPath();
          var wX = wXScale*(wXOffset);
          var wY = wYScale*(wYOffset - wLine.mData[0]);
          wCtx.moveTo(wX, wY);
          for (var wi = 0; wi < wLine.mData.length; ++wi) {
            wX = wXScale*(wi + wXOffset);
            wY = wYScale*(wYOffset - wLine.mData[wi]);
            wCtx.lineTo(wX, wY);
          }
          
          wCtx.lineJoin = "round";
          wCtx.stroke();
        }
        else {
          wCtx.beginPath();
          var wX = wXScale*(wXData.mData[0] + wXOffset);
          var wY = wYScale*(wYOffset - wLine.mData[0]);
          wCtx.moveTo(wX, wY);
          for (var wi = 0; wi < wLine.mData.length; ++wi) {
            wX = wXScale*(wXData.mData[wi] + wXOffset);
            wY = wYScale*(wYOffset - wLine.mData[wi]);
            wCtx.lineTo(wX, wY);
          }
          
          wCtx.lineJoin = "round";
          wCtx.stroke();
        }
      }
    }
  }
}