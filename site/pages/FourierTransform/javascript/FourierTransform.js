<!--

  function calculateFourierTransformCoefficient(iOrder, iComplexFunction) {
    var wSampleSize = 10000;
    var wT0 = 0;
    var wT1 = 1;
    var wTStep = (wT1 - wT0) / wSampleSize;

    var wWaveLength = -1 * iOrder * 2 * Math.PI;
    var wSum = {
      Order: iOrder,
      Real: 0,
      Imaginary: 0
    };

    for (var wi = wT0; wi <= wT1; wi += wTStep) {
      var wT = wi;
      var wAngle = wWaveLength * wT;
      var wEvaluateFunction = iComplexFunction(wT);

      var wCos = Math.cos(wAngle);
      var wSin = Math.sin(wAngle);

      var wReal =
        wCos * wEvaluateFunction.Real - wSin * wEvaluateFunction.Imaginary;
      var wImaginary =
        wSin * wEvaluateFunction.Real + wCos * wEvaluateFunction.Imaginary;

      wSum.Real += wTStep * wReal;
      wSum.Imaginary += wTStep * wImaginary;
    }

    return wSum;
  }

function evaluateFourierTransformCoefficientArray(iDt, iOrder, iFourierCoefficientArray) {

  var wCoefficientEndSize = 2 * iOrder + 1;

  if (wCoefficientEndSize >= iFourierCoefficientArray.length) {
    wCoefficientEndSize = iFourierCoefficientArray.length;
  }

  if (0 >= wCoefficientEndSize) {
    return;
  }

  var wX = 0;
  var wY = 0;
  for (var wk = 0; wk < wCoefficientEndSize; wk++) {
    var wComponent = iFourierCoefficientArray[wk];

    var wCos = Math.cos(wComponent.Order * 2 * Math.PI * iDt);
    var wSin = Math.sin(wComponent.Order * 2 * Math.PI * iDt);

    var wReal = wCos * wComponent.Real - wSin * wComponent.Imaginary;
    var wImaginary = wSin * wComponent.Real + wCos * wComponent.Imaginary;

    wX += wReal;
    wY += wImaginary;
  }

  return {
    Real: wX,
    Imaginary: wY
  }
}


-->