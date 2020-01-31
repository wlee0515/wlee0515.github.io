import {getDOMRelativeMousePosition} from "./Utility.mjs"

function ControlPointStructure ( iId ) {
  return {
    x : 0.0,
    y : 0.0,
    active : false,
    id : iId
  }
}

export function DomTouchControl ( iDOM){

  this.mDOM = iDOM;
  this.mControlPointList = [];

  this.mControlPointList.push(ControlPointStructure( -1 ));
  this.mControlPointList[0].active = false;
  this.mControlPointList[0].x = 0.0;
  this.mControlPointList[0].y = 0.0;


  // Mouse Event Handling ----------------
  this.mouseUp = function (evt) {
    this.mControlPointList[0].active = false;
    this.processMouse(evt);
  }
  
  this.mouseDown = function (evt) {
    this.mControlPointList[0].active = true;
    this.processMouse(evt);
  }

  this.mouseMove = function(evt) {
    this.processMouse(evt);
  }

  // Mouse Event Processing ----------------

  this.processMouse = function(evt) {
    if (!evt) evt = event;
    evt.preventDefault();
    var wRelMousePosition = getDOMRelativeMousePosition(this.mDOM, evt.clientX, evt.clientY);
    this.mControlPointList[0].x = wRelMousePosition.x;
    this.mControlPointList[0].y = wRelMousePosition.y;
  }

  // Touch Event Handling ----------------

  this.touchDown = function(evt) {
    this.processTouch(evt);
  }

  this.touchUp = function(evt) {
    this.processTouch(evt);
  }

  this.touchMove = function(evt) {
    this.processTouch(evt);
  }

  // Touch Event Processing ----------------
  
  this.processTouch = function(evt){

    if (!evt) evt = event;
    evt.preventDefault();
  
    var wActiveIndex = [];
    var wClosestIndex = [];
    for (var j = 1; j < this.mControlPointList.length ; ++j) {
      if (true == this.mControlPointList[j].active) {
        wActiveIndex.push(j);
        wClosestIndex.push(-1);
      }
    }

    var wTouchMatrix = [];
    for (var i = 0; i < evt.targetTouches.length ; ++i) {
      
      var wRelMousePosition = getDOMRelativeMousePosition(this.mDOM, evt.targetTouches[i].clientX, evt.targetTouches[i].clientY);
      var wXVal = wRelMousePosition.x;
      var wYVal= wRelMousePosition.y;

      var wNewRow = [];

      for (var j = 0; j < wActiveIndex.length ; ++j) {

        var wIndex = wActiveIndex[j];
        var wDx = wXVal - this.mControlPointList[wIndex].x;
        var wDy = wYVal - this.mControlPointList[wIndex].y;
        var wDr2 =  wDx*wDx + wDy*wDy;
        wNewRow.push ({
          dx : wDx,
          dy : wDy,
          dr2 : wDr2
        })
      }
      var wTouchPoint = {
        x : wXVal,
        y : wYVal,
        active_pt : wNewRow,
        
      }
      wTouchMatrix.push(wTouchPoint);
    }

    for (var i = 0; i < wActiveIndex.length ; ++i) {
      for (var j = i; j < wTouchMatrix.length ; ++j) {
        for (var k = wTouchMatrix.length - 1; k > j ; --k) {
          if ( wTouchMatrix[k].active_pt[i].dr2 < wTouchMatrix[k-1].active_pt[i].dr2) {
            var wTemp = wTouchMatrix[k][i];
            wTouchMatrix[k] = wTouchMatrix[k - 1];
            wTouchMatrix[k - 1] = wTouchMatrix[k];
          }
          else {
            break;
          }
        }
      }
    }

    for (var i = 1; i < this.mControlPointList.length ; ++i) {
      this.mControlPointList[i].active = false;
    }
    
    for (var i = 0; i < wActiveIndex.length ; ++i) {
      if ( i < wTouchMatrix.length) {
        var wIndex = wActiveIndex[i];
        this.mControlPointList[wIndex].active = true;
        this.mControlPointList[wIndex].x = wTouchMatrix[i].x;
        this.mControlPointList[wIndex].y = wTouchMatrix[i].y;
      }
    }

    
    for (var i = wActiveIndex.length; i <  wTouchMatrix.length ; ++i) {
      var wIsSet = false;
      for (var j = 1; j < this.mControlPointList.length; ++j) {
        if (false == this.mControlPointList[j].active) {
          this.mControlPointList[j].active = true;
          this.mControlPointList[j].x = wTouchMatrix[i].x;
          this.mControlPointList[j].y = wTouchMatrix[i].y;  
          wIsSet = true;
        }
      }
      if (false == wIsSet) {
        var wNewPoint = ControlPointStructure( evt.targetTouches[i].identifier);
        wNewPoint.active = true;
        wNewPoint.x = wXVal;
        wNewPoint.y = wYVal;
        wNewPoint.identifier = this.mControlPointList.length;
        this.mControlPointList.push(wNewPoint);
      }
    }
  }
  
  this.mDOM.addEventListener("mousedown", this.mouseDown.bind(this), false);
  this.mDOM.addEventListener("mousemove", this.mouseMove.bind(this), false);
  this.mDOM.addEventListener("mouseup", this.mouseUp.bind(this), false);
  this.mDOM.addEventListener("mouseenter", this.mouseUp.bind(this), false);
  this.mDOM.addEventListener("mouseleave", this.mouseUp.bind(this), false);

  this.mDOM.addEventListener("touchstart", this.touchDown.bind(this), false);
  this.mDOM.addEventListener("touchend", this.touchUp.bind(this), false);
  this.mDOM.addEventListener("touchmove", this.touchMove.bind(this), false);
  this.mDOM.addEventListener("touchcancel", this.touchUp.bind(this), false);
}

export default {
  DomTouchControl : DomTouchControl
}