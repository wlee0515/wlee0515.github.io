var eAxisAttributeName = {
  Zoom: "zoom",
  Offset: "offset",
  Position: "position",
  Color: "color",
}

var eLineAttributeName = {
  DataIndexLineName: "Data_Index",
  Data: "data",
  Color: "color",
  XAxisDataIndex: "XAxisDataIndex",
  XAxisIndex: "XAxisIndex",
  YAxisIndex: "YAxisIndex",
}

function getRandomColor() {
  
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  /*
  var color = '#000000';
  while ((color == "#000000") || (color == "#0000FF"))
  {
      var color = '#';
      for (var i = 0; i < 3; i++) {
          if (Math.random() > 0.5) {
              color += "FF";
          }
          else {
              color += "00";
          }
      }
  }*/
  return color;
}

function GraphAxis() {
  this.mZoom = 0.0;
  this.mOffset = 0.0;
  this.mPosition = 0.0;
  this.mColor = "#000000";

  this.setAxisAttribute = function (iAttribute, iValue) {

    if (eAxisAttributeName.Zoom == iAttribute) {
      this.mZoom = parseFloat(iValue);
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

  this.getAxisAttribute = function (iAttribute) {

    if (eAxisAttributeName.Zoom == iAttribute) {
      return this.mZoom;
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
  this.mColor = getRandomColor();
  this.mXAxisDataIndex = eLineAttributeName.DataIndexLineName;
  this.mXAxisIndex = "";
  this.mYAxisIndex = "";

  this.setLineAttribute = function (iAttribute, iValue) {

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
      this.mXAxisIndex = iValue;
      return true;
    }
    else if (eLineAttributeName.YAxisIndex == iAttribute) {
      this.mYAxisIndex = iValue;
      return true;
    }
    return false;
  }

  this.getLineAttribute = function (iAttribute) {

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
    else if (eLineAttributeName.YAxisIndex == iAttribute) {
      return this.YAxisIndex;
    }
    return null;
  }
}

function Graph() {

  this.mVerticalAxis = [];
  this.mHorizontalAxis = [];
  this.mGraphLine = [];
  this.mGraphLine[eLineAttributeName.DataIndexLineName] = new GraphLine();

  this.mNewVerticalAxisCallback = null;
  this.mRemoveVerticalAxisCallback = null;
  this.mNewHorizontalAxisCallback = null;
  this.mRemoveHorizontalAxisCallback = null;
  this.mNewLineCallback = null;
  this.mRemoveLineCallback = null;

  this.setNewVerticalAxisCallback = function (iCallback) {
    this.mNewVerticalAxisCallback = iCallback;
  }

  this.setRemoveVerticalAxisCallback = function (iCallback) {
    this.mRemoveVerticalAxisCallback = iCallback;
  }

  this.setNewHorizontalAxisCallback = function (iCallback) {
    this.mNewHorizontalAxisCallback = iCallback;
  }

  this.setRemoveHorizontalAxisCallback = function (iCallback) {
    this.mRemoveHorizontalAxisCallback = iCallback;
  }

  this.setNewLineCallback = function (iCallback) {
    this.mNewLineCallback = iCallback;
  }

  this.setRemoveLineCallback = function (iCallback) {
    this.mRemoveLineCallback = iCallback;
  }

  this.getVerticalAxisList = function () {
    var wList = [];
    for (key in this.mVerticalAxis) {
      wList.push(key);
    }
    return wList;
  }

  this.getHorizontalAxisList = function () {
    var wList = [];
    for (key in this.mHorizontalAxis) {
      wList.push(key);
    }
    return wList;
  }

  this.getGraphLineList = function (iIncludeIndex = false) {
    var wList = [];
    for (key in this.mGraphLine) {
      if (false == iIncludeIndex) {
        if (key == eLineAttributeName.DataIndexLineName) {
          continue;
        }
      }
      wList.push(key);
    }
    return wList;
  }

  this.addVerticalAxis = function (iAxisIndex = null) {
    if (null == iAxisIndex) {
      var wCounter = 0;
      for (key in this.mVerticalAxis) {
        wCounter++;
      }
      iAxisIndex = "Y" + wCounter;
    }
    return this.getVerticalAxis(iAxisIndex);
  }

  this.addHorizontalAxis = function (iAxisIndex = null) {
    if (null == iAxisIndex) {
      var wCounter = 0;
      for (key in this.mHorizontalAxis) {
        wCounter++;
      }
      iAxisIndex = "X" + wCounter;
    }
    return this.getHorizontalAxis(iAxisIndex);
  }

  this.getVerticalAxis = function (iAxisIndex) {
    if (null == this.mVerticalAxis[iAxisIndex]) {
      this.mVerticalAxis[iAxisIndex] = new GraphAxis();
      if (null != this.mNewVerticalAxisCallback) {
        this.mNewVerticalAxisCallback(this, iAxisIndex);
      }
    }
    return this.mVerticalAxis[iAxisIndex];
  }

  this.getHorizontalAxis = function (iAxisIndex) {
    if (null == this.mHorizontalAxis[iAxisIndex]) {
      this.mHorizontalAxis[iAxisIndex] = new GraphAxis();
      if (null != this.mNewHorizontalAxisCallback) {
        this.mNewHorizontalAxisCallback(this, iAxisIndex);
      }
    }
    return this.mHorizontalAxis[iAxisIndex];
  }

  this.removeVerticalAxis = function (iAxisIndex) {
    this.mVerticalAxis[iAxisIndex] = null;
    if (null != this.mRemoveVerticalAxisCallback) {
      this.mRemoveVerticalAxisCallback(this, iAxisIndex);
    }
  }

  this.removeHorizontalAxis = function (iAxisIndex) {
    this.mHorizontalAxis[iAxisIndex] = null;
    if (null != this.mRemoveHorizontalAxisCallback) {
      this.mRemoveHorizontalAxisCallback(this, iAxisIndex);
    }
  }

  this.getGraphLine = function (iLineIndex) {
    if (null == this.mGraphLine[iLineIndex]) {
      this.mGraphLine[iLineIndex] = new GraphLine();
      if (null != this.mNewLineCallback) {
        this.mNewLineCallback(this, iLineIndex);
      }
    }
    return this.mGraphLine[iLineIndex];
  }

  this.removeGraphLine = function (iLineIndex) {
    this.mGraphLine[iLineIndex] = null;
    if (null != this.mRemoveLineCallback) {
      this.mRemoveLineCallback(this, iLineIndex);
    }
  }

  this.setAxisAttribute = function (iIsHorizontalAxis, iAxisIndex, iAttribute, iValue) {
    var wAxisRef = null;
    if (true == iIsHorizontalAxis) {
      wAxisRef = this.getHorizontalAxis(iAxisIndex);
    }
    else {
      wAxisRef = this.getVerticalAxis(iAxisIndex);
    }

    if (null != wAxisRef) {
      return wAxisRef.setAxisAttribute(iAttribute, iValue);
    }

    return false;
  }

  this.getAxisAttribute = function (iIsHorizontalAxis, iAxisIndex, iAttribute) {
    var wAxisRef = null;
    if (true == iIsHorizontalAxis) {
      wAxisRef = this.mHorizontalAxis[iAxisIndex];
    }
    else {
      wAxisRef = this.mVerticalAxis[iAxisIndex];
    }

    if (null != wAxisRef) {
      return wAxisRef.getAxisAttribute(iAttribute);
    }

    return null;
  }

  this.setLineAttribute = function (iLineIndex, iAttribute, iValue) {
    var wLineRef = this.getGraphLine(iLineIndex);

    if (null != wLineRef) {
      return wLineRef.setLineAttribute(iAttribute, iValue);
    }

    return false;
  }

  this.getLineAttribute = function (iLineIndex, iAttribute) {
    var wLineRef = this.mGraphLine[iLineIndex];

    if (null != wLineRef) {
      return wLineRef.getLineAttribute(iAttribute);
    }

    return null;
  }

  this.setAxisZoom = function (iIsHorizontalAxis = false, iAxisIndex = null, iZoom = 0) {
    this.setAxisAttribute(iIsHorizontalAxis, iAxisIndex, eAxisAttributeName.Zoom, iZoom);
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
    var wBaseScale = 1;
    var wMajorIncrement = 100;
    var wMinorIncrement = 20;
    var wMajorLength = 20;
    var wMinorLength = 20;
    var wMajorLineWidth = 1;
    var wMinorLineWidth = 0.5;

    var wDefaultAxisX = "";

    for (key in this.mHorizontalAxis) {
      var wAxis = this.mHorizontalAxis[key];
      if (null != wAxis) {

        if ("" == wDefaultAxisX) {
          wDefaultAxisX = key;
        }

        wCtx.strokeStyle = wAxis.mColor;
        var wScale = wBaseScale * Math.pow(2, wAxis.mZoom);
        drawNumberLine(iCanvasDOM, -wDomWidth, wAxis.mPosition, wDomWidth, wAxis.mPosition,
          wScale * wAxis.mOffset, wAxis.mPosition + 50, 0,
          wScale,
          wMajorIncrement /wScale, wMinorIncrement/wScale,
          wMajorLength, wMinorLength,
          wMajorLineWidth, wMinorLineWidth);
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
        var wScale = wBaseScale * Math.pow(2, wAxis.mZoom);
        drawNumberLine(iCanvasDOM, wAxis.mPosition, wDomHeight, wAxis.mPosition, -wDomHeight,
          wAxis.mPosition + 50, wScale * wAxis.mOffset, 0,
          wScale,
          wMajorIncrement /wScale, wMinorIncrement/wScale,
          wMajorLength, wMinorLength,
          wMajorLineWidth, wMinorLineWidth);
      }
    }

    for (key in this.mGraphLine) {
      if (key == eLineAttributeName.DataIndexLineName) {
        continue;
      }

      var wLine = this.mGraphLine[key];
      if (null != wLine) {

        if ((null == wLine.mData) || (0 == wLine.mData.length)) {
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
          if (null != this.mVerticalAxis[wLine.mYAxisIndex]) {
            wYAxisRef = this.mVerticalAxis[wLine.mYAxisIndex];
          }
          else {
            wLine.mYAxisIndex = wDefaultAxisY;
          }
        }

        if ((null == wXAxisRef) || (null == wYAxisRef)) {
          continue;
        }

        var wXData = this.mGraphLine[wLine.mXAxisDataIndex];
        if (null == wXData) {
          var wXData = this.mGraphLine[eLineAttributeName.DataIndexLineName];
        }

        if (eLineAttributeName.DataIndexLineName == wLine.mXAxisDataIndex) {
          while (wXData.mData.length < wLine.mData.length) {
            wXData.mData.push(wXData.mData.length);
          }
        }

        var wXScale = wBaseScale * Math.pow(2, wXAxisRef.mZoom);
        var wXOffset = wXAxisRef.mOffset;
        var wYScale = wBaseScale * Math.pow(2, wYAxisRef.mZoom);
        var wYOffset = wYAxisRef.mOffset;

        wCtx.strokeStyle = wLine.mColor;
        drawPolyLineXYArray(iCanvasDOM, wXData.mData, wLine.mData,
          wXScale, -wYScale,
          wXScale * wXOffset, wYScale * wYOffset);
      }
    }
  }
}