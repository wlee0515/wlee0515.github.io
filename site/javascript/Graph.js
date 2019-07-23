var eAxisAttributeName = {
  Zoom: "zoom",
  Offset: "offset",
  Position: "position",
  Color: "color",
  Visible: "visible",
}

var eLineAttributeName = {
  DataIndexLineName: "Data_Index",
  Data: "data",
  Color: "color",
  XAxisDataIndex: "XAxisDataIndex",
  XAxisIndex: "XAxisIndex",
  YAxisIndex: "YAxisIndex",
  Visible: "visible",
}

function GraphAxis() {
  this.mZoom = 0.0;
  this.mOffset = 0.0;
  this.mPosition = 0.0;
  this.mColor = "#000000";
  this.mVisible = true;

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
    else if (eAxisAttributeName.Visible == iAttribute) {
      this.mVisible = Boolean(iValue);
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
    else if (eAxisAttributeName.Visible == iAttribute) {
      return this.mVisible;
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
  this.mVisible = true;

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
    else if (eLineAttributeName.Visible == iAttribute) {
      this.mVisible = Boolean(iValue);
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
    else if (eLineAttributeName.Visible == iAttribute) {
      return this.mVisible;
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
      if(null != this.mVerticalAxis[key]){
        wList.push(key);
      }
    }
    return wList;
  }

  this.getHorizontalAxisList = function () {
    var wList = [];
    for (key in this.mHorizontalAxis) {
      if(null != this.mHorizontalAxis[key]){
        wList.push(key);
      }
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
      
      if(null != this.mGraphLine[key]){
        wList.push(key);
      }
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
    if (iLineIndex != eLineAttributeName.DataIndexLineName) {
      this.mGraphLine[iLineIndex] = null;
      if (null != this.mRemoveLineCallback) {
        this.mRemoveLineCallback(this, iLineIndex);
      }  
    }
  }

  this.removeAllGraphLine = function () {
    var wDefault = this.mGraphLine[eLineAttributeName.DataIndexLineName];
    this.mGraphLine = [];
    this.mGraphLine[eLineAttributeName.DataIndexLineName] = wDefault;
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

  this.autoScale = function (iCanvasDOM, iIsHorizontalAxis = false, iAxisIndex = null) {
    if (null == iAxisIndex) {
      for (key in this.mVerticalAxis) {
        this.autoScale(iCanvasDOM, false, key);
      }

      for (key in this.mHorizontalAxis) {
        this.autoScale(iCanvasDOM, true, key);
      }
    }
    else {
      this.renderCanvas(iCanvasDOM, true);
      var wAxisRef = null;
      if (true == iIsHorizontalAxis) {
        wAxisRef = this.mHorizontalAxis[iAxisIndex];
      }
      else {
        wAxisRef = this.mVerticalAxis[iAxisIndex];
      }

      if (null != wAxisRef) {

        var wNotSet = true;
        var wMax = 0;
        var wMin = 0;

        for (key in this.mGraphLine) {
          var wLineDataRef = this.mGraphLine[key];

          if (null != wLineDataRef) {
            if (false == wLineDataRef.mVisible){
              continue;
            }

            var wAxisName = "";
            if (true == iIsHorizontalAxis) {
              wAxisName = wLineDataRef.mXAxisIndex;
              wLineDataRef = this.mGraphLine[wLineDataRef.mXAxisDataIndex];
            }
            else {
              wAxisName = wLineDataRef.mYAxisIndex;
            }

            if (wAxisName == iAxisIndex) {
              for (var wi = 0; wi < wLineDataRef.mData.length; ++wi) {
                if (wMax < wLineDataRef.mData[wi]) {
                  wMax = wLineDataRef.mData[wi];
                  wNotSet = false;
                }

                if (wMin > wLineDataRef.mData[wi]) {
                  wMin = wLineDataRef.mData[wi];
                  wNotSet = false;
                }
              }
            }
          }
        }

        if (true  == wNotSet) {
          return;
        }

        var wRange = wMax - wMin;
        if (1 > Math.abs(wRange)) wRange = 1;
        var wOffset = Math.floor((wMax + wMin) / 2);

        var wSpan = 0.95;
        if (true == iIsHorizontalAxis) {
          wAxisRef.mZoom = Math.floor(Math.log2((wSpan * iCanvasDOM.width) / wRange));
          wAxisRef.mOffset = -wOffset;
        }
        else {
          wAxisRef.mZoom = Math.floor(Math.log2((wSpan * iCanvasDOM.height) / wRange));
          wAxisRef.mOffset = wOffset;
        }

      }
    }
  }

  this.renderCanvas = function (iCanvasDOM, iUpdateOnly = false) {

    var wCtx = iCanvasDOM.getContext("2d");
    /*
    wCtx.strokeStyle = "red";
    var wLine = [[100, 0], [0, 0], [0, 100]];
    drawPolyLine(iCanvasDOM, wLine);
    */
    var wDomWidth = iCanvasDOM.width;
    var wDomHeight = iCanvasDOM.height;
    var wBaseScale = 1;
    var wMajorIncrement = 100;
    var wMinorIncrement = 20;
    var wMajorLength = 20;
    var wMinorLength = 10;
    var wMajorLineWidth = 1;
    var wMinorLineWidth = 0.5;

    var wDefaultAxisX = "";

    for (key in this.mHorizontalAxis) {
      var wAxis = this.mHorizontalAxis[key];
      if (null != wAxis) {

        if ("" == wDefaultAxisX) {
          wDefaultAxisX = key;
        }

        if ((false == iUpdateOnly) || (true == wAxis.mVisible)) {
          wCtx.strokeStyle = wAxis.mColor;
          var wScale = wBaseScale * Math.pow(2, wAxis.mZoom);
          drawNumberLine(iCanvasDOM, -wDomWidth, wAxis.mPosition, wDomWidth, wAxis.mPosition,
            wScale * wAxis.mOffset, wAxis.mPosition + 50, 0,
            wScale,
            wMajorIncrement / wScale, wMinorIncrement / wScale,
            wMajorLength, wMinorLength,
            wMajorLineWidth, wMinorLineWidth);
        }
      }
    }

    var wDefaultAxisY = "";

    for (key in this.mVerticalAxis) {
      var wAxis = this.mVerticalAxis[key];
      if (null != wAxis) {

        if ("" == wDefaultAxisY) {
          wDefaultAxisY = key;
        }

        if ((false == iUpdateOnly) || (true == wAxis.mVisible)) {
          wCtx.strokeStyle = wAxis.mColor;
          var wScale = wBaseScale * Math.pow(2, wAxis.mZoom);
          drawNumberLine(iCanvasDOM, wAxis.mPosition, wDomHeight, wAxis.mPosition, -wDomHeight,
            wAxis.mPosition + 50, wScale * wAxis.mOffset, 0,
            wScale,
            wMajorIncrement / wScale, wMinorIncrement / wScale,
            wMajorLength, wMinorLength,
            wMajorLineWidth, wMinorLineWidth);
        }
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
        var wXAxisRef = this.mHorizontalAxis[wLine.mXAxisIndex];
        var wYAxisRef = this.mVerticalAxis[wLine.mYAxisIndex];

        if (null == this.mHorizontalAxis[wLine.mXAxisIndex]) {
          wLine.mXAxisIndex = wDefaultAxisX;
          wXAxisRef = this.mHorizontalAxis[wLine.mXAxisIndex];
        }

        if (null == this.mVerticalAxis[wLine.mYAxisIndex]) {
          wLine.mYAxisIndex = wDefaultAxisY;
          wYAxisRef = this.mVerticalAxis[wLine.mYAxisIndex];
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

        if ((false == wXAxisRef.mVisible) || (false == wYAxisRef.mVisible)
         || (false == wXData.mVisible)  || (false == wLine.mVisible)) {
          continue;
        }

        var wXScale = wBaseScale * Math.pow(2, wXAxisRef.mZoom);
        var wXOffset = wXAxisRef.mOffset;
        var wYScale = wBaseScale * Math.pow(2, wYAxisRef.mZoom);
        var wYOffset = wYAxisRef.mOffset;

        if (false == iUpdateOnly) {
          
          wCtx.strokeStyle = wLine.mColor;
          drawPolyLineXYArray(iCanvasDOM, wXData.mData, wLine.mData,
            wXScale, -wYScale,
            wXScale * wXOffset, wYScale * wYOffset);
        }
      }
    }
  }
}