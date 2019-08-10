var eAxisAttributeName = {
  Zoom: "zoom",
  Offset: "offset",
  Position: "position",
  Color: "color",
  Visible: "visible",
}

var eLineAttributeName = {
  Data: "data",
  Color: "color",
  XAxisIndex: "XAxisIndex",
  YAxisIndex: "YAxisIndex",
  Visible: "visible",
}

var eLineGroupAttributeName = {
  DataIndexLineName: "Data_Index",
  DefaultGroupName: "Workspace",
  XAxisDataIndex: "XAxisDataIndex",
  XAxisIndex: "XAxisIndex",
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

function GraphLineGroup() {
  this.mVisible = true;
  this.mGraphLine = [];
  this.mGraphLine[eLineGroupAttributeName.DataIndexLineName] = new GraphLine();
  this.mXAxisDataIndex = eLineGroupAttributeName.DataIndexLineName;

  this.getGraphLineList = function (iIncludeIndex = false) {
    var wList = [];
    for (key in this.mGraphLine) {
      if (false == iIncludeIndex) {
        if (key == eLineGroupAttributeName.DataIndexLineName) {
          continue;
        }
      }

      if (null != this.mGraphLine[key]) {
        wList.push(key);
      }
    }
    return wList;
  }

  this.addLine = function (iLineIndex, iData) {
    if (null == this.mGraphLine[iLineIndex]) {
      this.mGraphLine[iLineIndex] = new GraphLine();
      this.mGraphLine[iLineIndex].mData = iData;
      return true;
    }
    return false;
  }

  this.removeLine = function (iLineIndex) {
    var wSuccess = false;

    if (eLineGroupAttributeName.DataIndexLineName == iLineIndex) {
      return wSuccess;
    }

    var wNewList = [];
    for (key in this.mGraphLine) {
      if (iLineIndex != key) {
        wNewList[key] = this.mGraphLine[key];
        wSuccess = true;
      }
    }
    this.mGraphLine = wNewList;
    return wSuccess;
  }

  this.removeAllLines = function () {
    this.mGraphLine = [];
    this.mGraphLine[eLineGroupAttributeName.DataIndexLineName] = new GraphLine();
    return true;
  }

  this.getLine = function (iLineIndex) {
    return this.mGraphLine[iLineIndex];
  }

  this.setLineAttribute = function (iLineIndex, iAttribute, iValue) {
    var wLineRef = this.getLine(iLineIndex);
    if (null != wLineRef) {
      return wLineRef.setLineAttribute(iAttribute, iValue);
    }
    return false;
  }

  this.getLineAttribute = function (iLineIndex, iAttribute, iValue) {
    var wLineRef = this.getLine(iLineIndex);
    if (null != wLineRef) {
      return wLineRef.getLineAttribute(iAttribute);
    }
    return null;
  }

  this.setLineGroupAttribute = function (iAttribute, iValue) {

    if (eLineGroupAttributeName.XAxisDataIndex == iAttribute) {
      this.mXAxisDataIndex = iValue;
      return true;
    }
    else if (eLineGroupAttributeName.Visible == iAttribute) {
      this.mVisible = Boolean(iValue);
      return true;
    }
    return false;
  }

  this.getLineGroupAttribute = function (iAttribute, iValue) {

    if (eLineGroupAttributeName.XAxisDataIndex == iAttribute) {
      return this.mXAxisDataIndex;
    }
    else if (eLineGroupAttributeName.Visible == iAttribute) {
      return this.mVisible;
    }
    return null;
  }
}

function Graph(iCanvasDOM) {

  this.mTransformation = {
    translationX : iCanvasDOM.width / 2,
    translationY : iCanvasDOM.height / 2,
    scaleX : 1,
    scaleY : 1,
    rotation : 0,
  }

  this.mSelectedObject = [];

  this.mMainCanvasDOM = iCanvasDOM;
  this.mHitCanvas = new HitCanvas(iCanvasDOM, true);

  this.mVerticalAxis = [];
  this.mHorizontalAxis = [];
  this.mGraphLineGroup = [];
  this.mGraphLineGroup[eLineGroupAttributeName.DefaultGroupName] = new GraphLineGroup();

  this.mNewVerticalAxisCallback = null;
  this.mRemoveVerticalAxisCallback = null;
  this.mNewHorizontalAxisCallback = null;
  this.mRemoveHorizontalAxisCallback = null;
  this.mNewLineCallback = null;
  this.mRemoveLineCallback = null;
  this.mOnChangeCallback = null;

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

  this.setOnChangeCallback = function (iCallback) {
    this.mOnChangeCallback = iCallback;
  }

  this.getVerticalAxisList = function () {
    var wList = [];
    for (key in this.mVerticalAxis) {
      if (null != this.mVerticalAxis[key]) {
        wList.push(key);
      }
    }
    return wList;
  }

  this.getHorizontalAxisList = function () {
    var wList = [];
    for (key in this.mHorizontalAxis) {
      if (null != this.mHorizontalAxis[key]) {
        wList.push(key);
      }
    }
    return wList;
  }

  this.getGraphLineGroupList = function () {
    var wList = [];
    for (key in this.mGraphLineGroup) {
      if (null != this.mGraphLineGroup[key]) {
        wList.push(key);
      }
    }
    return wList;
  }

  this.getGraphLineList = function (iGroupIndex, iIncludeIndex) {

    var wList = [];
    if (null == iGroupIndex) {

      for (key in this.mGraphLineGroup) {
        if (null != this.mGraphLineGroup[key]) {
          var wLineList = this.mGraphLineGroup[key].getGraphLineList(iIncludeIndex);
          for (key2 in wLineList) {
            wList.push(wLineList[key2]);
          }
        }
      }
    }
    else {
      if (null != this.mGraphLineGroup[iGroupIndex]) {
        wList = this.mGraphLineGroup[iGroupIndex].getGraphLineList(iIncludeIndex);
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

    if (null == this.mVerticalAxis[iAxisIndex]) {
      this.mVerticalAxis[iAxisIndex] = new GraphAxis();
      if (null != this.mNewVerticalAxisCallback) {
        this.mNewVerticalAxisCallback(this, iAxisIndex);
      }
      if (null != this.mOnChangeCallback) {
        this.mOnChangeCallback(this);
      }

      return true;
    }

    return false;
  }

  this.addHorizontalAxis = function (iAxisIndex = null) {
    if (null == iAxisIndex) {
      var wCounter = 0;
      for (key in this.mHorizontalAxis) {
        wCounter++;
      }
      iAxisIndex = "X" + wCounter;
    }

    if (null == this.mHorizontalAxis[iAxisIndex]) {
      this.mHorizontalAxis[iAxisIndex] = new GraphAxis();
      if (null != this.mNewHorizontalAxisCallback) {
        this.mNewHorizontalAxisCallback(this, iAxisIndex);
      }
      if (null != this.mOnChangeCallback) {
        this.mOnChangeCallback(this);
      }
      return true;
    }

    return false;
  }

  this.getVerticalAxis = function (iAxisIndex) {
    return this.mVerticalAxis[iAxisIndex];
  }

  this.getHorizontalAxis = function (iAxisIndex) {

    return this.mHorizontalAxis[iAxisIndex];
  }

  this.removeVerticalAxis = function (iAxisIndex) {
    var wNewList = [];
    for (key in this.mVerticalAxis) {
      if (key != iAxisIndex) {
        wNewList[key] = this.mVerticalAxis[key];
      }
    }
    this.mVerticalAxis = wNewList;

    if (null != this.mRemoveVerticalAxisCallback) {
      this.mRemoveVerticalAxisCallback(this, iAxisIndex);
    }

    if (null != this.mOnChangeCallback) {
      this.mOnChangeCallback(this);
    }
  }

  this.removeHorizontalAxis = function (iAxisIndex) {
    var wNewList = [];
    for (key in this.mHorizontalAxis) {
      if (key != iAxisIndex) {
        wNewList[key] = this.mHorizontalAxis[key];
      }
    }
    this.mHorizontalAxis = wNewList;

    if (null != this.mRemoveHorizontalAxisCallback) {
      this.mRemoveHorizontalAxisCallback(this, iAxisIndex);
    }

    if (null != this.mOnChangeCallback) {
      this.mOnChangeCallback(this);
    }
  }

  this.addGraphLine = function (iLineIndex, iGroupIndex, iData) {

    if (null == iGroupIndex) {
      iGroupIndex = eLineGroupAttributeName.DefaultGroupName;
    }
    if (null == this.mGraphLineGroup[iGroupIndex]) {
      this.mGraphLineGroup[iGroupIndex] = new GraphLineGroup();
    }

    if (true == this.mGraphLineGroup[iGroupIndex].addLine(iLineIndex, iData)) {
      if (null != this.mNewLineCallback) {
        this.mNewLineCallback(this, iLineIndex, iGroupIndex);
      }

      if (null != this.mOnChangeCallback) {
        this.mOnChangeCallback(this);
      }
      return true;
    }
    return false;
  }

  this.getGraphLine = function (iLineIndex, iGroupIndex) {

    if (null == iGroupIndex) {
      iGroupIndex = eLineGroupAttributeName.DefaultGroupName;
    }

    if (null != this.mGraphLineGroup[iGroupIndex]) {
      return this.mGraphLineGroup[iGroupIndex].getLine(iLineIndex);
    }
    return null;
  }

  this.copyGraphLineToGroup = function (iLineIndex, iFromGroupIndex, iToGroupIndex) {

    if (null == iToGroupIndex) {
      iGroupIndex = eLineGroupAttributeName.DefaultGroupName;
    }

    if (iToGroupIndex != iFromGroupIndex) {
      if ((null != iFromGroupIndex) && (null != iLineIndex)) {
        var wLineRef = this.getGraphLine(iLineIndex, iFromGroupIndex);
        if (null != wLineRef) {
          var wNewLineName = iFromGroupIndex + "_" + iLineIndex;
          this.addGraphLine(wNewLineName, iToGroupIndex, wLineRef.mData);
          var wNewLineRef = this.getGraphLine(iLineIndex, iToGroupIndex);
          if (null != wNewLineRef) {
            wNewLineRef.mColor = "" + wLineRef.mColor;
            wNewLineRef.mYAxisIndex = "" + wLineRef.mYAxisIndex;
            wNewLineRef.mXAxisIndex = "" + wLineRef.mXAxisIndex;
          }
        }
      }
    }

    return false;
  }
  this.removeGraphLine = function (iGroupIndex, iLineIndex) {

    if (null == iGroupIndex) {
      iGroupIndex = eLineGroupAttributeName.DefaultGroupName;
    }

    if (null != this.mGraphLineGroup[iGroupIndex]) {

      if (true == this.mGraphLineGroup[iGroupIndex].removeLine(iLineIndex)) {
        if (null != this.mRemoveLineCallback) {
          this.mRemoveLineCallback(this, iLineIndex, iGroupIndex);
        }

        if (null != this.mOnChangeCallback) {
          this.mOnChangeCallback(this);
        }

        return true;
      }
    }
  }

  this.removeGraphLineGroup = function (iGroupIndex) {

    if (eLineGroupAttributeName.DefaultGroupName != iGroupIndex) {
      var wNewList = [];
      for (key in this.mGraphLineGroup) {
        if (iGroupIndex != key) {
          wNewList[key] = this.mGraphLineGroup[key];
        }
      }
      this.mGraphLineGroup = wNewList;
      if (null != this.mRemoveLineCallback) {
        this.mRemoveLineCallback(this, iGroupIndex);
      }

      if (null != this.mOnChangeCallback) {
        this.mOnChangeCallback(this);
      }

      return true;
    }

    return false;
  }


  this.removeAllGraphLine = function () {
    this.mGraphLineGroup = [];
    this.mGraphLineGroup[eLineGroupAttributeName.DefaultGroupName] = new GraphLineGroup();
    if (null != this.mRemoveLineCallback) {
      this.mRemoveLineCallback(this);
    }

    if (null != this.mOnChangeCallback) {
      this.mOnChangeCallback(this);
    }

    return true;
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
      if (true == wAxisRef.setAxisAttribute(iAttribute, iValue)) {
        if (null != this.mOnChangeCallback) {
          this.mOnChangeCallback(this);
        }
        return true;
      }
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

  this.setLineGroupAttribute = function (iGroupIndex, iAttribute, iValue) {

    if (null == iGroupIndex) {
      iGroupIndex = eLineGroupAttributeName.DefaultGroupName;
    }

    if (null != this.mGraphLineGroup[iGroupIndex]) {
      if (true == this.mGraphLineGroup[iGroupIndex].setLineGroupAttribute(iAttribute, iValue)) {
        if (null != this.mOnChangeCallback) {
          this.mOnChangeCallback(this);
        }
      }
    }

    return false;
  }

  this.getLineGroupAttribute = function (iGroupIndex, iAttribute) {

    if (null == iGroupIndex) {
      iGroupIndex = eLineGroupAttributeName.DefaultGroupName;
    }

    if (null != this.mGraphLineGroup[iGroupIndex]) {
      return this.mGraphLineGroup[iGroupIndex].getLineGroupAttribute(iAttribute);
    }

    return null;
  }
  this.setLineAttribute = function (iGroupIndex, iLineIndex, iAttribute, iValue) {

    if (null == iGroupIndex) {
      iGroupIndex = eLineGroupAttributeName.DefaultGroupName;
    }

    if (null != this.mGraphLineGroup[iGroupIndex]) {
      if (true == this.mGraphLineGroup[iGroupIndex].setLineAttribute(iLineIndex, iAttribute, iValue)) {
        if (null != this.mOnChangeCallback) {
          this.mOnChangeCallback(this);
        }
        return true;
      }
    }

    return false;
  }

  this.getLineAttribute = function (iGroupIndex, iLineIndex, iAttribute) {

    if (null == iGroupIndex) {
      iGroupIndex = eLineGroupAttributeName.DefaultGroupName;
    }

    if (null != this.mGraphLineGroup[iGroupIndex]) {
      return this.mGraphLineGroup[iGroupIndex].getLineAttribute(iLineIndex, iAttribute);
    }

    return null;
  }

  this.autoScale = function (iIsHorizontalAxis = false, iAxisIndex = null) {
    if (null == iAxisIndex) {
      for (key in this.mVerticalAxis) {
        this.autoScale(false, key);
      }

      for (key in this.mHorizontalAxis) {
        this.autoScale(true, key);
      }
    }
    else {
      this.syncData();
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

        for (key1 in this.mGraphLineGroup) {
          var wGroupRef = this.mGraphLineGroup[key1];

          if (null != wGroupRef) {

            if (false == wGroupRef.mVisible) {
              continue;
            }

            for (key2 in wGroupRef.mGraphLine) {
              var wLineDataRef = wGroupRef.mGraphLine[key2];

              if (null != wLineDataRef) {
                if (false == wLineDataRef.mVisible) {
                  continue;
                }

                var wAxisName = "";
                if (true == iIsHorizontalAxis) {
                  wAxisName = wLineDataRef.mXAxisIndex;
                  wLineDataRef = wGroupRef.mGraphLine[wGroupRef.mXAxisDataIndex];
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
          }
        }

        if (true == wNotSet) {
          wAxisRef.mZoom = 0;
          wAxisRef.mOffset = 0;
        }
        else {
          var wRange = wMax - wMin;
          if (1 > Math.abs(wRange)) wRange = 1;
          var wOffset = Math.floor((wMax + wMin) / 2);

          var wSpan = 0.95;
          if (true == iIsHorizontalAxis) {
            wAxisRef.mZoom = Math.floor(Math.log2((wSpan * this.mMainCanvasDOM.width) / wRange));
            wAxisRef.mOffset = -wOffset;
          }
          else {
            wAxisRef.mZoom = Math.floor(Math.log2((wSpan * this.mMainCanvasDOM.height) / wRange));
            wAxisRef.mOffset = wOffset;
          }
        }

        if (null != this.mOnChangeCallback) {
          this.mOnChangeCallback(this);
        }
      }
    }

  }

  this.renderCanvas = function () {

    this.syncData();

    this.mTransformation.translationX = this.mMainCanvasDOM.width / 2,
    this.mTransformation.translationY = this.mMainCanvasDOM.height / 2,
    
    drawCanvasCenteredAt(this.mMainCanvasDOM, function (iDOM) {
      this.drawGraphArea(iDOM);
    }.bind(this),
    this.mTransformation.translationX,
    this.mTransformation.translationY,
    this.mTransformation.scaleX,
    this.mTransformation.scaleY,
    this.mTransformation.rotation);

    this.mHitCanvas.reset();

    drawCanvasCenteredAt(this.mHitCanvas.mHitCanvas, function (iDOM) {
      this.drawHitCanvas(iDOM);
    }.bind(this), 
    this.mTransformation.translationX,
    this.mTransformation.translationY,
    this.mTransformation.scaleX,
    this.mTransformation.scaleY,
    this.mTransformation.rotation);
  }


  this.syncData = function () {

    var wDefaultAxisX = "";

    for (key in this.mHorizontalAxis) {
      var wAxis = this.mHorizontalAxis[key];
      if (null != wAxis) {
        wDefaultAxisX = key;
        break;
      }
    }

    var wDefaultAxisY = "";

    for (key in this.mVerticalAxis) {
      var wAxis = this.mVerticalAxis[key];
      if (null != wAxis) {
        wDefaultAxisY = key;
        break;
      }
    }

    for (key1 in this.mGraphLineGroup) {
      var wGroupRef = this.mGraphLineGroup[key1];

      if (null != wGroupRef) {
        for (key2 in wGroupRef.mGraphLine) {

          if (key2 == eLineGroupAttributeName.DataIndexLineName) {
            continue;
          }

          var wLine = wGroupRef.mGraphLine[key2];
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

            var wXData = wGroupRef.mGraphLine[wGroupRef.mXAxisDataIndex];
            if (null == wXData) {
              var wXData = wGroupRef.mGraphLine[eLineGroupAttributeName.DataIndexLineName];
            }

            if (eLineGroupAttributeName.DataIndexLineName == wGroupRef.mXAxisDataIndex) {
              while (wXData.mData.length < wLine.mData.length) {
                wXData.mData.push(wXData.mData.length);
              }
            }
          }
        }
      }
    }
  }

  this.drawGraphArea = function (iCanvasDOM) {

    var wCtx = iCanvasDOM.getContext("2d");
    var wDomWidth = iCanvasDOM.width;
    var wDomHeight = iCanvasDOM.height;
    var wMajorIncrement = 100;
    var wMinorIncrement = 20;
    var wMajorLength = 20;
    var wMinorLength = 10;
    var wMajorLineWidth = 1;
    var wMinorLineWidth = 0.5;

    for (key in this.mHorizontalAxis) {
      var wAxis = this.mHorizontalAxis[key];
      if (null != wAxis) {
        if (true == wAxis.mVisible) {
          wCtx.strokeStyle = wAxis.mColor;
          var wScale = Math.pow(2, wAxis.mZoom);
          drawNumberLine(iCanvasDOM, -wDomWidth / 2, wAxis.mPosition, wDomWidth / 2, wAxis.mPosition,
            wScale * wAxis.mOffset, wAxis.mPosition + 50, 0,
            wScale,
            wMajorIncrement / wScale, wMinorIncrement / wScale,
            wMajorLength, wMinorLength,
            wMajorLineWidth, wMinorLineWidth);
        }
      }
    }

    for (key in this.mVerticalAxis) {
      var wAxis = this.mVerticalAxis[key];
      if (null != wAxis) {
        if (true == wAxis.mVisible) {
          wCtx.strokeStyle = wAxis.mColor;
          var wScale = Math.pow(2, wAxis.mZoom);
          drawNumberLine(iCanvasDOM, wAxis.mPosition, wDomHeight / 2, wAxis.mPosition, -wDomHeight / 2,
            wAxis.mPosition + 50, wScale * wAxis.mOffset, 0,
            wScale,
            wMajorIncrement / wScale, wMinorIncrement / wScale,
            wMajorLength, wMinorLength,
            wMajorLineWidth, wMinorLineWidth);
        }
      }
    }

    for (key1 in this.mGraphLineGroup) {
      var wGroupRef = this.mGraphLineGroup[key1];

      if (null != wGroupRef) {
        for (key2 in wGroupRef.mGraphLine) {

          if (key2 == eLineGroupAttributeName.DataIndexLineName) {
            continue;
          }
          if (key2 == wGroupRef.mXAxisDataIndex) {
            continue;
          }

          var wLine = wGroupRef.mGraphLine[key2];
          if (null != wLine) {

            var wXAxisRef = this.mHorizontalAxis[wLine.mXAxisIndex];
            var wYAxisRef = this.mVerticalAxis[wLine.mYAxisIndex];

            if ((null == wXAxisRef) || (null == wYAxisRef)) {
              continue;
            }

            var wXData = wGroupRef.mGraphLine[wGroupRef.mXAxisDataIndex];

            if (null == wXData) {
              continue;
            }

            if ((false == wGroupRef.mVisible) || (false == wYAxisRef.mVisible)
              || (false == wXData.mVisible) || (false == wLine.mVisible)) {
              continue;
            }

            var wXScale = Math.pow(2, wXAxisRef.mZoom);
            var wXOffset = wXAxisRef.mOffset;
            var wYScale = Math.pow(2, wYAxisRef.mZoom);
            var wYOffset = wYAxisRef.mOffset;

            wCtx.strokeStyle = wLine.mColor;
            drawPolyLineXYArray(iCanvasDOM, wXData.mData, wLine.mData,
              wXScale, -wYScale,
              wXScale * wXOffset, wYScale * wYOffset);

          }
        }
      }
    }
  }

  this.drawHitCanvas = function (iHitCanvasDOM) {

    var wDomWidth = iHitCanvasDOM.width;
    var wDomHeight = iHitCanvasDOM.height;
    var wMajorLength = 20;

    for (key in this.mHorizontalAxis) {
      var wAxis = this.mHorizontalAxis[key];
      if (null != wAxis) {
        if (true == wAxis.mVisible) {
          this.mHitCanvas.draw(function (iCanvasDOM, iColor) {
            var wCtx = iCanvasDOM.getContext("2d");

            wCtx.strokeStyle = "blue";
            wCtx.beginPath();
            wCtx.arc(0, 0, 10, 0, 2 * Math.PI);
            wCtx.stroke();

            wCtx.fillRect(-wDomWidth / 2, wAxis.mPosition, wDomWidth, wMajorLength);


            return ["axis", "horizontal", key];
          }.bind(this));
        }
      }
    }

    for (key in this.mVerticalAxis) {
      var wAxis = this.mVerticalAxis[key];
      if (null != wAxis) {
        if (true == wAxis.mVisible) {

          this.mHitCanvas.draw(function (iCanvasDOM) {
            var wCtx = iCanvasDOM.getContext("2d");
            wCtx.fillRect(wAxis.mPosition, -wDomHeight / 2, wMajorLength, wDomHeight);
            return ["axis", "vertical", key];
          }.bind(this));
        }
      }
    }
  }

  this.mouseHandler = {
    mouseX: 0,
    mouseY: 0,
    previousMouseX: 0,
    previousMouseY: 0,
    mousedown:false,
    mousedownX:0,
    mousedownY:0,
    mousedownHitObject:0,
    mousedownTempData : null,
  }

  this.processHit = function (iEvent, iHitObjId) {

    var wMousePos = getDOMRelativeMousePosition(this.mMainCanvasDOM, iEvent.clientX, iEvent.clientY);
    
    this.mouseHandler.previousMouseX = this.mouseHandler.mouseX;
    this.mouseHandler.previousMouseY = this.mouseHandler.mouseY;
    this.mouseHandler.mouseX = (wMousePos.x - this.mTransformation.translationX)*this.mTransformation.scaleX;
    this.mouseHandler.mouseY = (wMousePos.y - this.mTransformation.translationY)*this.mTransformation.scaleY;

    if (("mouseup" == iEvent.type)||(("mouseleave" == iEvent.type))||(("mouseout" == iEvent.type))) {
      this.mouseHandler.mousedown = false;
      this.mouseHandler.mousedownX = 0;
      this.mouseHandler.mousedownY = 0;
      this.mouseHandler.mousedownTempData = null;
      return;
    }  
    
    if ((null != iHitObjId) && (0 != iHitObjId.length)) {
      if ("mousedown" == iEvent.type) {
        this.mouseHandler.mousedown = true;
        this.mouseHandler.mousedownX = this.mouseHandler.mouseX;
        this.mouseHandler.mousedownY = this.mouseHandler.mouseY;
        this.mouseHandler.mousedownHitObject = iHitObjId;
        return;
      }
      else if ("wheel" == iEvent.type) {
        if ("axis" == iHitObjId[0]) {
          var wAxisRef = null;
          if ("vertical" == iHitObjId[1]) {
            wAxisRef = this.mVerticalAxis[iHitObjId[2]];
          }
          else if ("horizontal") {
            wAxisRef = this.mHorizontalAxis[iHitObjId[2]];
          }

          if (null != wAxisRef) {
            wAxisRef.mZoom += Math.floor(iEvent.wheelDeltaY / 100);
          }
        }
      }
    }

    if ("mousemove" == iEvent.type) {
      if(true == this.mouseHandler.mousedown) {
        if ("axis" == this.mouseHandler.mousedownHitObject[0]) {
          var wAxisRef = null;
          if ("vertical" == this.mouseHandler.mousedownHitObject[1]) {
            wAxisRef = this.mVerticalAxis[this.mouseHandler.mousedownHitObject[2]];
          }
          else if ("horizontal") {
            wAxisRef = this.mHorizontalAxis[this.mouseHandler.mousedownHitObject[2]];
          }
  
          if(null == this.mouseHandler.mousedownTempData) {
            this.mouseHandler.mousedownTempData = {
              axisPosition : wAxisRef.mPosition,
              axisOffset : wAxisRef.mOffset,
            }
          }
          var wScale = Math.pow(2, wAxisRef.mZoom);
          if ("vertical" == this.mouseHandler.mousedownHitObject[1]) {
            wAxisRef.mPosition =  this.mouseHandler.mouseX - this.mouseHandler.mousedownX + this.mouseHandler.mousedownTempData.axisPosition;
            wAxisRef.mOffset =  (this.mouseHandler.mouseY - this.mouseHandler.mousedownY)/wScale + this.mouseHandler.mousedownTempData.axisOffset;
          }
          else if ("horizontal") {
            wAxisRef.mPosition =  this.mouseHandler.mouseY - this.mouseHandler.mousedownY + this.mouseHandler.mousedownTempData.axisPosition;
            wAxisRef.mOffset =  (this.mouseHandler.mouseX - this.mouseHandler.mousedownX)/wScale + this.mouseHandler.mousedownTempData.axisOffset;
          }
        }  
      }
    }

    /*
      onclick : "click",
      onwheel : "wheel",
      onmousedown : "mousedown",
      onmouseup : "mouseup",
      onmouseenter : "mouseenter",
      onmouseleave : "mouseleave",
      onmousemove : "mousemove",
      onmouseover : "mouseover",
      onmouseout : "mouseout",
      */

    this.renderCanvas();

    if (null != iEvent.preventDefault) {
      iEvent.preventDefault();
    } else {
      iEvent.returnValue = false;
    }

    if (null != this.mOnChangeCallback) {
      this.mOnChangeCallback(this);
    }
    return false;
  }

  this.mHitCanvas.onclick = this.processHit.bind(this);
  this.mHitCanvas.onwheel = this.processHit.bind(this);
  this.mHitCanvas.onmousedown = this.processHit.bind(this);
  this.mHitCanvas.onmouseleave = this.processHit.bind(this);
  this.mHitCanvas.onmouseup = this.processHit.bind(this);
  this.mHitCanvas.onmouseout = this.processHit.bind(this);
  this.mHitCanvas.onmousemove = this.processHit.bind(this);
}