function resizeCanvas(iCanvas) {
  iCanvas.width = iCanvas.parentNode.clientWidth - 2;
  iCanvas.height = iCanvas.parentNode.clientHeight - 2;
}

function clearCanvas(iDOM) {
  var wCtx = iDOM.getContext("2d");
  wCtx.clearRect(0, 0, iDOM.width, iDOM.height);
}

function drawCanvasCenteredAt(iDOM, iDrawFunction, iTranslateX = 0, iTranslateY = 0, iScaleX = 1.0, iScaleY = 1.0, iRotation = 0) {

  var wXTranslate = iTranslateX;
  var wYTranslate = iTranslateY;
  var wScaleX = iScaleX;
  var wScaleY = iScaleY;
  var wRotate = iRotation;

  var wCtx = iDOM.getContext("2d");

  wCtx.translate(wXTranslate, wYTranslate);
  wCtx.scale(wScaleX, wScaleY);
  wCtx.rotate(wRotate);

  iDrawFunction(iDOM);

  wCtx.rotate(-wRotate);
  wCtx.scale(1 / wScaleX, 1 / wScaleY);
  wCtx.translate(-wXTranslate, -wYTranslate);
}

function drawArrow(iDOM, iTailWidth, iTailLength, iHeadWidth, iHeadLength) {

  var wTailWidthHalf = Math.abs(iTailWidth / 2);
  var wHeadWidthHalf = Math.abs(iHeadWidth / 2);

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

  if (iPointArray.length == 0) {
    return;
  }

  var wCtx = iDOM.getContext("2d");
  wCtx.beginPath();

  var wX = iXScale * iPointArray[0][0] + iXOffset;
  var wY = iYScale * iPointArray[0][1] + iYOffset;
  wCtx.moveTo(wX, wY);

  for (var wi = 0; wi < iPointArray.length; ++wi) {
    wX = iXScale * iPointArray[wi][0] + iXOffset;
    wY = iYScale * iPointArray[wi][1] + iYOffset;
    wCtx.lineTo(wX, wY);
  }

  wCtx.lineJoin = "round";
  wCtx.stroke();
}

function drawPolyLineXY(iDOM, iPointArray, iXScale = 1.0, iYScale = 1.0, iXOffset = 0, iYOffset = 0) {

  if (iPointArray.length == 0) {
    return;
  }

  var wCtx = iDOM.getContext("2d");
  wCtx.beginPath();

  var wX = iXScale * iPointArray[0].x + iXOffset;
  var wY = iYScale * iPointArray[0].y + iYOffset;
  wCtx.moveTo(wX, wY);

  for (var wi = 0; wi < iPointArray.length; ++wi) {
    wX = iXScale * iPointArray[wi].x + iXOffset;
    wY = iYScale * iPointArray[wi].y + iYOffset;
    wCtx.lineTo(wX, wY);
  }

  wCtx.lineJoin = "round";
  wCtx.stroke();
}


function drawNumberLine(iDOM, iStartX, iStartY, iEndX, iEndY, iRefX, iRefY, iRefValue = 0, iUnitScale = 1, iMajorIncrement = 5, iMinorIncrement = 1, iMajorLength = 2, iMinorLength = 1, iMajorLineWidth = 2, iMinorLineWidth = 1) {

  var wDirection = {
    x: iEndX - iStartX,
    y: iEndY - iStartY
  }

  var wTotalMag = Math.sqrt(wDirection.x * wDirection.x + wDirection.y * wDirection.y);

  wDirection.x /= wTotalMag;
  wDirection.y /= wTotalMag;

  var wRefDirection = {
    x: iRefX - iStartX,
    y: iRefY - iStartY
  }

  var wDot = wRefDirection.x * wDirection.x + wRefDirection.y * wDirection.y;
  var wClosestPointOnLine = {
    x: wDot * wDirection.x,
    y: wDot * wDirection.y
  }

  var wRefMag = Math.sqrt(wClosestPointOnLine.x * wClosestPointOnLine.x + wClosestPointOnLine.y * wClosestPointOnLine.y);
  var wInvertRefMag = wTotalMag - wRefMag;
  if (wDot <= 0) {
    wInvertRefMag = wTotalMag + wRefMag;
  }

  var wPerpendicular = {
    x: wRefDirection.x - wClosestPointOnLine.x,
    y: wRefDirection.y - wClosestPointOnLine.y
  }

  var wPerpendicularMag = Math.sqrt(wPerpendicular.x * wPerpendicular.x + wPerpendicular.y * wPerpendicular.y);
  wPerpendicular.x /= wPerpendicularMag;
  wPerpendicular.y /= wPerpendicularMag;

  var wCtx = iDOM.getContext("2d");

  if (0 != iMinorIncrement) {
    var wPixelJump = Math.abs(iUnitScale) * iMinorIncrement;
    var wPixelJumpVector = {
      x: wPixelJump * wDirection.x,
      y: wPixelJump * wDirection.y
    }

    var wForwardCount = parseInt(Math.ceil(wInvertRefMag / wPixelJump));
    var wBackwardCount = parseInt(Math.ceil(wRefMag / wPixelJump));

    var wMinorStartX = wClosestPointOnLine.x + iStartX;
    var wMinorStartY = wClosestPointOnLine.y + iStartY;
    var wMinorEndX = wClosestPointOnLine.x + iStartX + iMinorLength * wPerpendicular.x;
    var wMinorEndY = wClosestPointOnLine.y + iStartY + iMinorLength * wPerpendicular.y;

    wCtx.lineWidth = iMinorLineWidth;
    for (var wi = -wBackwardCount; wi <= wForwardCount; ++wi) {
      var wNewStartX = wMinorStartX + wi * wPixelJumpVector.x;
      var wNewStartY = wMinorStartY + wi * wPixelJumpVector.y;
      var wNewEndX = wMinorEndX + wi * wPixelJumpVector.x;
      var wNewEndY = wMinorEndY + wi * wPixelJumpVector.y;

      wCtx.beginPath();
      wCtx.moveTo(wNewStartX, wNewStartY);
      wCtx.lineTo(wNewEndX, wNewEndY);
      wCtx.stroke();
    }
  }

  if (0 != iMajorIncrement) {
    var wPixelJump = Math.abs(iUnitScale) * iMajorIncrement;
    var wPixelJumpVector = {
      x: wPixelJump * wDirection.x,
      y: wPixelJump * wDirection.y
    }

    var wForwardCount = parseInt(Math.ceil(wInvertRefMag / wPixelJump));
    var wBackwardCount = parseInt(Math.ceil(wRefMag / wPixelJump));

    var wMajorStartX = wClosestPointOnLine.x + iStartX;
    var wMajorStartY = wClosestPointOnLine.y + iStartY;
    var wMajorEndX = wClosestPointOnLine.x + iStartX + iMajorLength * wPerpendicular.x;
    var wMajorEndY = wClosestPointOnLine.y + iStartY + iMajorLength * wPerpendicular.y;

    wCtx.lineWidth = iMajorLineWidth;
    for (var wi = -wBackwardCount; wi <= wForwardCount; ++wi) {
      var wNewStartX = wMajorStartX + wi * wPixelJumpVector.x;
      var wNewStartY = wMajorStartY + wi * wPixelJumpVector.y;
      var wNewEndX = wMajorEndX + wi * wPixelJumpVector.x;
      var wNewEndY = wMajorEndY + wi * wPixelJumpVector.y;

      wCtx.beginPath();
      wCtx.moveTo(wNewStartX, wNewStartY);
      wCtx.lineTo(wNewEndX, wNewEndY);
      wCtx.stroke();

      wCtx.textAlign = 'center';
      wCtx.textBaseline = 'middle';;
      wCtx.fillText("" + (parseInt(iRefValue) + wi * iMajorIncrement), iRefX + wi * wPixelJumpVector.x, iRefY + wi * wPixelJumpVector.y);
    }
  }

  wCtx.lineWidth = iMajorLineWidth;
  wCtx.beginPath();
  wCtx.moveTo(iStartX, iStartY);
  wCtx.lineTo(iEndX, iEndY);
  wCtx.stroke();
}