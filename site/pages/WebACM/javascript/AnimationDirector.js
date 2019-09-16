
function DrawDescription(iId, iModelRef, iLatitude, iLongitude, iAltitude, iRoll, iPitch, iYaw) {
    this.Id = iId;
    this.Latitude = iLatitude;
    this.Longitude = iLongitude;
    this.Altitude = iAltitude;
    this.roll = iRoll;
    this.pitch = iPitch;
    this.yaw = iYaw;
    this.ModelRef = iModelRef;
    this.scale_x = 1.0;
    this.scale_y = 1.0;
    this.scale_z = 1.0;

}

function AnimationFrame() {

    this.DrawList = new Array();

    this.addDrawDescription = function (iId, iModelRef, iLatitude, iLongitude, iAltitude, iRoll, iPitch, iYaw) {
        var wNewDescription = new DrawDescription(iId, iModelRef, iLatitude, iLongitude, iAltitude, iRoll, iPitch, iYaw);
        this.DrawList.push(wNewDescription);
        return wNewDescription;
    }

    this.clearDrawList = function () {
        this.DrawList.length = 0;
    }

    this.getDrawDescriptionID = function (iId) {

        if (null != iId) {
            for (var wi = 0; wi < this.DrawList.length; ++wi) {
                if (iId == this.DrawList[wi].Id) {
                    return this.DrawList[wi];
                }
            }

        }
        return null;
    }


    this.deleteDrawDescription = function (iId) {

        if (null != iId) {

            var wNewDrawDescriptionArray = new Array();
            var wStartDeleting = false;
            for (var wi = 0; wi < this.DrawList.length; ++wi) {
                if (iId != this.DrawList[wi].Id) {
                    wNewDrawDescriptionArray.push(this.DrawList[wi]);
                }
            }
            this.DrawList = wNewDrawDescriptionArray;
        }
    }
}

function AnimationDirector(iMaxFrameCount) {

    this.maxFrameCount = iMaxFrameCount;

    this.RecordingIndex = -1;
    this.PlaybackIndex = 0;
    this.EndIndex = 0;
    this.StartIndex = 0;

    this.ModulatedRate_X = null;
    this.ModulatedRate_Y = null;
    this.ModulatedRate_Z = null;

    this.FixedToCameraAnimationFrame = new AnimationFrame();
    this.FixedToCameraAnimationFrame_Modulated = new AnimationFrame();
    this.StaticAnimationFrame = new AnimationFrame();
    this.AnimationElementList = new Array();

    this.CameraFocusID = "";
    this.TetherCameraFocusID = "";
    this.CameraTerrainElevation = 0;
    this.DrawAllIntegratedFrames = false;

    this.createAnimationElement = function () {

        return {
            SingleFrame: new AnimationFrame(),
            IntegratedFrame: new AnimationFrame()
        }
    }

    this.clearAnimationFrames = function () {

        this.RecordingIndex = -1;
        this.PlaybackIndex = 0;
        this.EndIndex = 0;
        this.StartIndex = 0;
        this.AnimationElementList.length = 0;
    }

    this.getFrameCount = function () {

        var wDistance = this.EndIndex - this.StartIndex;
        if (0 > wDistance) wDistance += this.AnimationElementList.length;

        return wDistance;
    }

    this.getFrameAt = function (iIndex) {

        if (null == this.maxFrameCount) {

            while (iIndex > this.AnimationElementList.length) {

                this.StartIndex = 0;
                this.EndIndex = this.AnimationElementList.length;

                var wNewFrame = this.createAnimationElement();
                this.AnimationElementList.push(wNewFrame);
            }

            return this.AnimationElementList[iIndex];

        }
        else {

            var wRealIndex = iIndex + this.StartIndex;

            if (this.maxFrameCount > this.AnimationElementList.length) {

                while (wRealIndex >= this.maxFrameCount) {

                    this.EndIndex = this.AnimationElementList.length;

                    var wNewFrame = this.createAnimationElement();
                    this.AnimationElementList.push(wNewFrame);
                }

                this.StartIndex = 0;
                this.EndIndex = this.AnimationElementList.length;

                var wNewFrame = this.createAnimationElement();
                this.AnimationElementList.push(wNewFrame);
                return wNewFrame;
            }
            else {
                this.EndIndex++;
                this.EndIndex %= this.AnimationElementList.length;
                this.StartIndex = this.EndIndex + 1;
                this.StartIndex %= this.AnimationElementList.length;

                this.AnimationElementList[this.EndIndex].clearDrawList();
                return this.AnimationElementList[this.EndIndex];
            }
        }
        return null;
    }

    this.getNextRecordingFrame = function () {

        ++this.RecordingIndex;

        var wNewRecordingIndex = this.StartIndex + this.RecordingIndex;

        if (wNewRecordingIndex < this.AnimationElementList.length) {
            return this.AnimationElementList[wNewRecordingIndex];
        }

        if (null == this.maxFrameCount) {

            this.StartIndex = 0;
            this.EndIndex = this.AnimationElementList.length;

            var wNewFrame = this.createAnimationElement();
            this.AnimationElementList.push(wNewFrame);
            return wNewFrame;
        }
        else {

            if (this.maxFrameCount > this.AnimationElementList.length) {

                this.StartIndex = 0;
                this.EndIndex = this.AnimationElementList.length;

                var wNewFrame = this.createAnimationElement();
                this.AnimationElementList.push(wNewFrame);
                return wNewFrame;
            }
            else {
                this.EndIndex++;
                this.EndIndex %= this.AnimationElementList.length;
                this.StartIndex = this.EndIndex + 1;
                this.StartIndex %= this.AnimationElementList.length;

                this.AnimationElementList[this.EndIndex].clearDrawList();
                return this.AnimationElementList[this.EndIndex];
            }
        }
        return null;
    }

    this.getPlaybackFrame = function () {

        if (0 != this.AnimationElementList.length) {
            return this.AnimationElementList[this.PlaybackIndex % this.AnimationElementList.length];
        }
        return null;
    }

    this.setPlaybackPercentage = function (iValue) {
        var wPercentage = iValue / 100;
        if (1.0 < wPercentage) wPercentage = 1.0;
        if (0 > wPercentage) wPercentage = 0.0;

        var wDistance = this.EndIndex - this.StartIndex;
        if (0 > wDistance) wDistance += this.AnimationElementList.length;

        var wTravel = Math.floor(wPercentage * wDistance);

        this.PlaybackIndex = wTravel + this.StartIndex;

        if (0 != this.AnimationElementList.length) {
            this.PlaybackIndex %= this.AnimationElementList.length;
        }
    }

    this.getPlaybackFrameNumber = function () {

        var wTraveled = this.PlaybackIndex - this.StartIndex;
        if (0 > wTraveled) wTraveled += this.AnimationElementList.length;

        return wTraveled;
    }


    this.getPlaybackPercentage = function () {

        var wTraveled = this.getPlaybackFrameNumber();

        var wDistance = this.getFrameCount();

        if (0 == wDistance) return 0;
        return 100 * (wTraveled / wDistance);
    }

    this.setPlaybackToStart = function () {

        this.PlaybackIndex = this.StartIndex;
    }

    this.setPlaybackToEnd = function () {

        this.PlaybackIndex = this.EndIndex;
    }


    this.setRecordingFrameToStart = function () {

        this.RecordingIndex = this.StartIndex - 1;
    }

    this.setRecordingFrameToEnd = function () {

        this.RecordingIndex = this.EndIndex;
    }

    this.isPlaybackAtStart = function () {

        return this.PlaybackIndex == this.StartIndex;
    }

    this.isPlaybackAtEnd = function () {

        return this.PlaybackIndex == this.EndIndex;
    }

    this.incrementPlaybackIndex = function () {

        if (this.PlaybackIndex != this.EndIndex) {
            this.PlaybackIndex++;
            this.PlaybackIndex %= this.AnimationElementList.length;
        }
    }

    this.decrementPlaybackIndex = function () {

        if (this.PlaybackIndex != this.StartIndex) {
            this.PlaybackIndex--;
            if (0 > this.PlaybackIndex) this.PlaybackIndex += this.AnimationElementList.length;
            this.PlaybackIndex %= this.AnimationElementList.length;
        }
    }

    this.wCenterSet = false;
    this.Latitude = null;
    this.Longitude = null;
    this.Altitude = null;

    this.getPlaybackFrameCameraCenter = function () {

        if ("" != this.CameraFocusID) {
            var wPlaybackFrame = this.getPlaybackFrame();

            if (null != wPlaybackFrame) {
                var wCameraFocus = wPlaybackFrame.SingleFrame.getDrawDescriptionID(this.CameraFocusID);

                if (null == wCameraFocus) {
                    wCameraFocus = this.StaticAnimationFrame.getDrawDescriptionID(this.CameraFocusID);
                }

                var wCameraTether = null;
                if ("" != this.TetherCameraFocusID) {
                    wCameraTether = wPlaybackFrame.SingleFrame.getDrawDescriptionID(this.TetherCameraFocusID);

                    if (null == wCameraTether) {
                        wCameraTether = this.StaticAnimationFrame.getDrawDescriptionID(this.TetherCameraFocusID);
                    }
                }

                if (null != wCameraFocus) {

                    if ((null == wCameraTether) || (wCameraFocus == wCameraTether)) {

                        if (false == this.wCenterSet) {
                            this.wCenterSet = false;
                            this.Latitude = wCameraFocus.Latitude;
                            this.Longitude = wCameraFocus.Longitude;
                            this.Altitude = wCameraFocus.Altitude;
                            return {
                                Latitude: wCameraFocus.Latitude,
                                Longitude: wCameraFocus.Longitude,
                                Altitude: wCameraFocus.Altitude,

                                roll: 0,
                                pitch: 0,
                                yaw: 0
                            }

                        }
                        else {
                            return {
                                Latitude: this.Latitude,
                                Longitude: this.Longitude,
                                Altitude: this.Altitude,

                                roll: 0,
                                pitch: 0,
                                yaw: 0
                            }
                        }
                    }
                    else {

                        var dX = wCameraTether.Latitude - wCameraFocus.Latitude;
                        var dY = wCameraTether.Longitude - wCameraFocus.Longitude;
                        var dZ = wCameraTether.Altitude - wCameraFocus.Altitude;

                        var wRadiusXY = Math.sqrt(dX * dX + dY * dY);

                        return {
                            Latitude: wCameraFocus.Latitude,
                            Longitude: wCameraFocus.Longitude,
                            Altitude: wCameraFocus.Altitude,

                            roll: 0,
                            pitch: Math.atan2(dZ, wRadiusXY),
                            yaw: Math.atan2(dX, dY)
                        }
                    }
                }
            }

        }

        return {
            Latitude: 0,
            Longitude: 0,
            Altitude: this.CameraTerrainElevation,

            roll: 0,
            pitch: 0,
            yaw: 0
        }
    }

    this.applyFunctionToIntegratedFrame = function (iDrawFunction, iFrameSkip, iLatitude, iLongitude, iAltitude) {

        if (0 != this.AnimationElementList.length) {
            var wEndFrame = this.getPlaybackFrameNumber();
            if (true == this.DrawAllIntegratedFrames) {
                wEndFrame = this.EndIndex;
            }

            var wTravelLength = wEndFrame - this.StartIndex;
            if (0 > wTravelLength) wTravelLength += this.AnimationElementList.length;

            var wInc = iFrameSkip + 1;
            for (var wi = 0; wi < wTravelLength; wi += wInc) {
                wFrameIndex = this.StartIndex + wi;
                wFrameIndex %= this.AnimationElementList.length;

                iDrawFunction(this.AnimationElementList[wFrameIndex].IntegratedFrame, iLatitude, iLongitude, iAltitude);
            }

            iDrawFunction(this.AnimationElementList[wEndFrame].IntegratedFrame, iLatitude, iLongitude, iAltitude);

        }
    }

    this.deleteDescription = function (iId) {


        for (var wi = 0; wi < this.AnimationElementList.length; ++wi) {
            this.AnimationElementList[wi].SingleFrame.deleteDrawDescription(iId);
            this.AnimationElementList[wi].IntegratedFrame.deleteDrawDescription(iId);
        }

        this.FixedToCameraAnimationFrame.deleteDrawDescription(iId);
        this.FixedToCameraAnimationFrame_Modulated.deleteDrawDescription(iId);
        this.StaticAnimationFrame.deleteDrawDescription(iId);
    }

}