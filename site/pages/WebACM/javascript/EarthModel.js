var gEarthRadius = 6371000;

function normalizeAngle(iAngle) {
    var wNewAngle = iAngle;
    while (wNewAngle > Math.PI) {
        wNewAngle -= 2 * Math.PI;
    }

    while (wNewAngle < -Math.PI) {
        wNewAngle += 2 * Math.PI;
    }
    return wNewAngle;
}

function convertGCtoNED(iLatitude, iLongitude, iAltitude, iRefLatitude, iRefLongitude, iRefAltitude) {

    var wDLat = normalizeAngle(iLatitude - iRefLatitude);
    var wDLong = normalizeAngle(iLongitude - iRefLongitude);

    var wRadius = gEarthRadius;
    var wDx = wDLat;
    wDx *= wRadius;
    var wDy = wDLong * Math.cos(iLatitude);
    wDy *= wRadius;
    var wAlt = iAltitude - iRefAltitude;

    return {
        North: wDx,
        East: wDy,
        Down: -wAlt
    };
}

function addNEDToGC(iLatitude, iLongitude, iAltitude, iNorth, iEast, iDown) {

    var wRadius = gEarthRadius + iAltitude;
    var wDLat = iNorth / wRadius;
    var wNewLat = iLatitude + wDLat;

    var wDLong = iEast / (Math.cos(wNewLat) * wRadius);
    var wNewLong = iLongitude + wDLong;

    var wNewAlt = iAltitude - iDown;

    return {
        Latitude: wNewLat,
        Longitude: wNewLong,
        Altitude: wNewAlt
    }
}


function RunwayDefinition(iId, iLatitude, iLongitude, iElevation, iBearing, iLength, iWidth) {
    this.Id = iId;
    this.Latitude = iLatitude;
    this.Longitude = iLongitude;
    this.Elevation = iElevation;
    this.Bearing = iBearing;
    this.Length = iLength;
    this.Width = iWidth;

}

function RunwayManager() {
    this.RunwayList = new Array();
    this.RunwayPositionNeedsUpdate = true;
    this.isFirstPass = true;

    this.addRunwayDiscription = function (iId, iLatitude, iLongitude, iElevation, iBearing, iLength, iWidth) {
        this.RunwayList.push(new RunwayDefinition(iId, iLatitude, iLongitude, iElevation, iBearing, iLength, iWidth));
        this.RunwayPositionNeedsUpdate = true;
        this.isFirstPass = true;
    }


    this.getClosestRunway = function (iLatitude, iLongitude) {

        if (0 != this.RunwayList.length) {

            var wIndex = 0;
            var wDLat0 = iLatitude - this.RunwayList[0].Latitude;
            var wDLong0 = iLongitude - this.RunwayList[0].Longitude;
            var wClosestDistance = wDLat0 * wDLat0 + wDLong0 * wDLong0;

            for (var wi = 1; wi < this.RunwayList.length; ++wi) {
                var wDLat = iLatitude - this.RunwayList[wi].Latitude;
                var wDLong = iLongitude - this.RunwayList[wi].Longitude;
                var wClosestDistance_Temp = wDLat * wDLat + wDLong * wDLong;

                if (wClosestDistance_Temp < wClosestDistance) {
                    wClosestDistance = wClosestDistance_Temp;
                    wIndex = wi;
                }
            }

            return this.RunwayList[wIndex];
        }

        return null;
    }



    this.drawAnimationFrame = function (iAnimationFrame, iRunwayModelRef) {

        for (var wi = 0; wi < this.RunwayList.length; ++wi) {

            var wRunway = this.RunwayList[wi];

            if (null != iRunwayModelRef) {
                var wDescription = iAnimationFrame.addDrawDescription(wRunway.Id, iRunwayModelRef,
                    wRunway.Latitude, wRunway.Longitude, wRunway.Elevation,
                    0, 0, wRunway.Bearing
                )
                wDescription.scale_x = wRunway.Length;
                wDescription.scale_y = wRunway.Width;

            }
        }
    }

}