<!--

function resizeCanvas(iDOMId) {
  var wCanvas = document.getElementById("display");
  if (null != wCanvas) {
    wCanvas.width = wCanvas.parentNode.clientWidth - 2;
    wCanvas.height = wCanvas.parentNode.clientHeight - 2;
  }
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
-->