﻿function convertColorIdToColor(iColorId) {
  var wB = parseInt(iColorId % 255);
  var wG = parseInt(Math.floor(iColorId % (255 * 255) / 255));
  var wR = parseInt(Math.floor(iColorId % (255 * 255 * 255) / (255 * 255)));

  return `rgb(${wR},${wG},${wB})`;
}

function convertColorToColorId(iR, iG, iB) {
  var iColorId = parseInt(iB);
  iColorId += 255 * parseInt(iG);
  iColorId += 255 * 255 * parseInt(iR);
  return iColorId;
}

function getRandomColor() {

  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getUrlParameter(iParameter) {
  var wPageURL = window.location.search.substring(1);
  var wURLVariables = wPageURL.split('&');
  for (var i = 0; i < wURLVariables.length; i++) {
    var wParameterName = wURLVariables[i].split('=');
    if (wParameterName[0] == iParameter) {
      return wParameterName[1];
    }
  }

  return "";
}

function getAllScroll(iDOM) {
  var wScrollX = 0;
  var wScrollY = 0;

  var wCurrentDOM = iDOM;

  while (wCurrentDOM != document.body) {
    wCurrentDOM = wCurrentDOM.parentNode;
    wScrollX += parseInt(wCurrentDOM.scrollLeft);
    wScrollY += parseInt(wCurrentDOM.scrollTop);
  }
  
//  wScrollX += parseInt(window.pageXOffset);
//  wScrollY += parseInt(window.pageYOffset);

  return {
    x: wScrollX,
    y: wScrollY,
  };

}

function getDOMRelativeMousePosition(iDOM, iMouseX, iMouseY) {
  
  var wScroll = getAllScroll(iDOM);
  return {
    x: iMouseX - iDOM.offsetLeft + wScroll.x,
    y: iMouseY - iDOM.offsetTop  + wScroll.y
  }
}
