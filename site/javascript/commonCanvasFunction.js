<!--

function resizeCanvas(iCanvas) {
  iCanvas.width = iCanvas.parentNode.clientWidth - 2;
  iCanvas.height = iCanvas.parentNode.clientHeight - 2;
}

function clearCanvas(iDOM) {
  var wCtx = iDOM.getContext("2d");
  wCtx.clearRect(0, 0, iDOM.width, iDOM.height);
}

function drawCanvasCenteredAt(iDOM, iDrawFunction, iTranslateX, iTranslateY, iRotation, iScale) {

  var wXTranslate = iTranslateX;
  var wYTranslate = iTranslateY;
  var wRotate = iRotation;
  var wScale = iScale;

  var wCtx = iDOM.getContext("2d");

  wCtx.translate(wXTranslate, wYTranslate);
  wCtx.scale(wScale, wScale);
  wCtx.rotate(wRotate);

  iDrawFunction(iDOM);

  wCtx.rotate(-wRotate);
  wCtx.scale(1 / wScale, 1 / wScale);
  wCtx.translate(-wXTranslate, -wYTranslate);
}

function drawArrow(iDOM, iTailWidth, iTailLength, iHeadWidth, iHeadLength) {

  var wTailWidthHalf = Math.abs(iTailWidth/2);
  var wHeadWidthHalf = Math.abs(iHeadWidth/2);

  var wCtx = iDOM.getContext("2d");
  wCtx.beginPath();
  wCtx.moveTo(0, 0);
  wCtx.lineTo(0, wTailWidthHalf);
  wCtx.lineTo(iTailLength, wTailWidthHalf);
  wCtx.lineTo(iTailLength, wHeadWidthHalf);
  wCtx.lineTo(iTailLength + iHeadLength, 0);
  wCtx.lineTo(iTailLength, -wHeadWidthHalf);
  wCtx.lineTo(iTailLength, -wTailWidthHalf);
  wCtx.lineTo(0, -wTailWidthHalf);
  wCtx.closePath();

  wCtx.lineJoin = "round";
  wCtx.stroke();
  wCtx.fill();
}

function drawComplexFunction(iDOM, iStartTime, iEndTime, iTimeStep, iComplexFunction) {

  if (iTimeStep > 0) {
    if (iStartTime > iEndTime) {
      return;
    }
  }
  else if (iTimeStep < 0) {
    if (iStartTime < iEndTime) {
      return;
    }
  }
  else {
    return;
  }

  var wCtx = iDOM.getContext("2d");
  wCtx.beginPath();

  for (var wi = iStartTime; wi < iEndTime; wi += iTimeStep) {
    var wT = wi;

    var wPt = iComplexFunction(wT);
    var wX = wPt.Real;
    var wY = wPt.Imaginary;

    if (iStartTime == wi) {
      wCtx.moveTo(wX, wY);
    } else {
      wCtx.lineTo(wX, wY);
    }
  }
  wCtx.stroke();
}

function drawPolyLine(iDOM, iPointArray, iXScale = 1.0, iYScale = 1.0, iXOffset = 0, iYOffset = 0) {

  if (iPointArray.length == 0){
    return;
  }

  var wCtx = iDOM.getContext("2d");
  wCtx.beginPath();
  
  var wX = iXScale*iPointArray[0][0] + iXOffset;
  var wY = iYScale*iPointArray[0][1] + iYOffset;
  wCtx.moveTo(wX, wY);

  for (var wi = 0; wi < iPointArray.length; ++wi) {
    wX = iXScale*iPointArray[wi][0] + iXOffset;
    wY = iYScale*iPointArray[wi][1] + iYOffset;
    wCtx.lineTo(wX, wY);
  }

  wCtx.lineJoin = "round";
  wCtx.stroke();
}

function drawPolyLineXY(iDOM, iPointArray, iXScale = 1.0, iYScale = 1.0, iXOffset = 0, iYOffset = 0) {

  if (iPointArray.length == 0){
    return;
  }

  var wCtx = iDOM.getContext("2d");
  wCtx.beginPath();
  
  var wX = iXScale*iPointArray[0].x + iXOffset;
  var wY = iYScale*iPointArray[0].y + iYOffset;
  wCtx.moveTo(wX, wY);

  for (var wi = 0; wi < iPointArray.length; ++wi) {
    wX = iXScale*iPointArray[wi].x + iXOffset;
    wY = iYScale*iPointArray[wi].y + iYOffset;
    wCtx.lineTo(wX, wY);
  }

  wCtx.lineJoin = "round";
  wCtx.stroke();
}
-->