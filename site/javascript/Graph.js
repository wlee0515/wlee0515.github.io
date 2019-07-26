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
   
  this.addLine = function(iLineIndex, iData) {
    if (null == this.mGraphLine[iLineIndex]) {
      this.mGraphLine[iLineIndex] = new GraphLine();
      this.mGraphLine[iLineIndex].mData = iData;
      return true;
    }
    return false;
  }
 
  this.removeLine = function(iLineIndex) {
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
  
  this.removeAllLines = function() {
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

  this.setLineGroupAttribute = function ( iAttribute, iValue){

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

function Graph() {

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

  this.getGraphLineGroupList = function() {
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
    if (null == iGroupIndex){

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
  }

  this.addGraphLine = function (iLineIndex, iGroupIndex, iData) {

    if (null == iGroupIndex) {
      iGroupIndex = eLineGroupAttributeName.DefaultGroupName;
    }
    if (null == this.mGraphLineGroup[iGroupIndex]) {
      this.mGraphLineGroup[iGroupIndex] = new GraphLineGroup();
    }

    if(true == this.mGraphLineGroup[iGroupIndex].addLine(iLineIndex, iData))
    {
      if (null != this.mNewLineCallback) {
        this.mNewLineCallback(this, iLineIndex, iGroupIndex);
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
      if ((null != iFromGroupIndex)&&(null != iLineIndex)) {
        var wLineRef = this.getGraphLine( iLineIndex, iFromGroupIndex);
        if (null != wLineRef) {
          var wNewLineName = iFromGroupIndex + "_" + iLineIndex;
          this.addGraphLine( wNewLineName, iToGroupIndex, wLineRef.mData);
          var wNewLineRef = this.getGraphLine( iLineIndex, iToGroupIndex);
          if (null != wNewLineRef) {
            wNewLineRef.mColor = wLineRef.mColor;
            wNewLineRef.mYAxisIndex = wLineRef.mYAxisIndex;
            wNewLineRef.mXAxisIndex = wLineRef.mXAxisIndex;
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
        this.mRemoveLineCallback(this,iGroupIndex);
      }

      return true;
    }

    return false;
  }

  
  this.removeAllGraphLine = function () {
    this.mGraphLineGroup = [];
    this.mGraphLineGroup[eLineGroupAttributeName.DefaultGroupName] = new GraphLineGroup();
    if (null != this.mRemoveLineCallback) {
      this.mRemoveLineCallback(this,);
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

  this.setLineGroupAttribute = function (iGroupIndex, iAttribute, iValue) {
    
    if (null == iGroupIndex) {
      iGroupIndex = eLineGroupAttributeName.DefaultGroupName;
    }

    if (null != this.mGraphLineGroup[iGroupIndex]) {
      return this.mGraphLineGroup[iGroupIndex].setLineGroupAttribute(iAttribute, iValue);
    }

    return false;
  }

  this.getLineGroupAttribute = function (iGroupIndex, iAttribute) {
    
    if (null == iGroupIndex) {
      iGroupIndex = eLineGroupAttributeName.DefaultGroupName;
    }

    if (null != this.mGraphLineGroup[iGroupIndex]) {
      return this.mGraphLineGroup[iGroupIndex].getLineGroupAttribute( iAttribute);
    }

    return null;
  }
  this.setLineAttribute = function (iGroupIndex, iLineIndex, iAttribute, iValue) {
    
    if (null == iGroupIndex) {
      iGroupIndex = eLineGroupAttributeName.DefaultGroupName;
    }

    if (null != this.mGraphLineGroup[iGroupIndex]) {
      return this.mGraphLineGroup[iGroupIndex].setLineAttribute(iLineIndex, iAttribute, iValue);
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
    
  }

  this.renderCanvas = function (iCanvasDOM) {

    this.syncData();

    drawCanvasCenteredAt(iCanvasDOM, function (iDOM) {
      gGraph.drawGraphArea(iDOM);
    }, iCanvasDOM.width / 2, iCanvasDOM.height / 2, 1, 1);

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

            if (eLineGroupAttributeName.DataIndexLineName == wLine.mXAxisDataIndex) {
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
    var wBaseScale = 1;
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
          var wScale = wBaseScale * Math.pow(2, wAxis.mZoom);
          drawNumberLine(iCanvasDOM, -wDomWidth/2, wAxis.mPosition, wDomWidth/2, wAxis.mPosition,
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
          var wScale = wBaseScale * Math.pow(2, wAxis.mZoom);
          drawNumberLine(iCanvasDOM, wAxis.mPosition, wDomHeight/2, wAxis.mPosition, -wDomHeight/2,
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
  }
}