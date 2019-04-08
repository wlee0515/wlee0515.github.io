<!--

function normalizeAngle(iAngle)
{
  var wAngle = iAngle;
  while (wAngle > Math.PI)
  {
    wAngle -= 2*Math.PI;
  }

  while (wAngle < -Math.PI)
  {
    wAngle += 2 * Math.PI;
  }
  return wAngle;
}

-->