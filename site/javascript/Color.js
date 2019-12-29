
function Color(iR, iG, iB, iAlpha) {
  this.r = iR;
  this.g = iG;
  this.b = iB;
  this.a = iAlpha;

  this.set = function(iR, iG, iB, iAlpha) {
    this.r = iR;
    this.g = iG;
    this.b = iB;
    this.a = iAlpha;
  }

  this.getRGBAString = function () {
    return 'rgba(' + this.r + ',' + this.g + ','+  this.b + ','+ this.a + ')';
  }

  this.getRGBString = function () {
    return 'rgb(' + this.r + ',' + this.g + ','+  this.b + ')';
  }

  this.mapValueToColorScale = function (iRatio) {

    var wRatio = iRatio;

    if (wRatio > 1) {
      wRatio = 1;
    }
    else if (wRatio < 0) {
      wRatio = 0;
    }

    wColorIndex = Math.floor(wRatio * 1785 + 0.5);
    if (wColorIndex <= 255) {
      return this.set(wColorIndex, 0, 0, 255);
    }
    if (wColorIndex <= 2 * 255) {
      return this.set(255, wColorIndex - 255, 0, 255);
    }
    if (wColorIndex <= 3 * 255) {
      return this.set(3 * 255 - wColorIndex, 255, 0, 255);
    }
    if (wColorIndex <= 4 * 255) {
      return this.set(0, 255, wColorIndex - 3 * 255, 255);
    }
    if (wColorIndex <= 5 * 255) {
      return this.set(0, 5 * 255 - wColorIndex, 255, 255);
    }
    if (wColorIndex <= 6 * 255) {
      return this.set(wColorIndex - 5 * 255, 0, 255, 255);
    }
    if (wColorIndex <= 7 * 255) {
      return this.set(255, wColorIndex - 6 * 255, 255, 255);
    }
    this.set(255, 255, 255, 255);
    return this;
  }

  this.mapColorScaleToValue = function (iValueMax, iValueMin) {
    wColorIndex = 0
    if ((this.g == 0) && (this.b == 0)) {
      wColorIndex = this.r;
    }
    else if ((this.r == 255) && (this.b == 0)) {
      wColorIndex = this.g + 255;
    }
    else if ((this.g == 255) && (this.b == 0)) {
      wColorIndex = 3 * 255 - this.r;
    }
    else if ((this.r == 0) && (this.g == 255)) {
      wColorIndex = this.b + 3 * 255;
    }
    else if ((this.r == 0) && (this.b == 255)) {
      wColorIndex = 5 * 255 - this.g;
    }
    else if ((this.g == 0) && (this.b == 255)) {
      wColorIndex = this.r + 5 * 255;
    }
    else if ((this.r == 255) && (this.b == 255)) {
      wColorIndex = this.g + 6 * 255;
    }

    return parseInt((wColorIndex / 1785) * (iValueMax - iValueMin) + iValueMin + 0.5);

  }


  this.mapValueToBinaryColorRGB = function (iValue) {
    wNewValue = iValue + 32768;
    wR = parseInt(wNewValue % 255);
    wTemp = parseInt(wNewValue / 255);
    wG = parseInt(wTemp % 255);
    wB = parseInt(wTemp / 255);
    this.set(wR, wG, wB, 255);
    return this;
  }

  this.mapBinaryColorRGBToValue = function () {
    return this.b * 255 * 255 + this.g * 255 + this.r - 32768
  }
}