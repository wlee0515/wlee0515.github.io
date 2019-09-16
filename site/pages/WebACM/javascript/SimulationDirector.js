
function SimulationModel(iId, iModelRef, iTracerModelRef) {
    this.Id = iId;
    this.ModelRef = iModelRef;
    this.TracerModelRef = iTracerModelRef;

    this.Position = new Float64Array(3);
    this.Velocity = new Float64Array(3);
    this.Acceleration = new Float64Array(3);

    this.AngularPosition = new Float64Array(3);
    this.AngularVelocity = new Float64Array(3);
    this.AngularAcceleration = new Float64Array(3);

    this.PositionHistory = new Array();
    this.PositionHistoryStartIndex = 0;

    this.reset = function () {

        this.Position[0] = 0;
        this.Position[1] = 0;
        this.Position[2] = 0;
        this.AngularPosition[0] = 0;
        this.AngularPosition[1] = 0;
        this.AngularPosition[2] = 0;
        this.Velocity[0] = 0;
        this.Velocity[1] = 0;
        this.Velocity[2] = 0;
        this.AngularVelocity[0] = 0;
        this.AngularVelocity[1] = 0;
        this.AngularVelocity[2] = 0;
        this.Acceleration[0] = 0;
        this.Acceleration[1] = 0;
        this.Acceleration[2] = 0;
        this.AngularAcceleration[0] = 0;
        this.AngularAcceleration[1] = 0;
        this.AngularAcceleration[2] = 0;

        this.PositionHistory.length = 0;
    }

    this.setPosition = function (iLatitude, iLongitude, iAltitude, iRoll, iPitch, iYaw) {

        this.Position[0] = iLatitude;
        this.Position[1] = iLongitude;
        this.Position[2] = iAltitude;
        this.AngularPosition[0] = iRoll;
        this.AngularPosition[1] = iPitch;
        this.AngularPosition[2] = iYaw;
    }

    this.setVelocity = function (iX, iY, iZ, iRoll, iPitch, iYaw) {

        this.Velocity[0] = iX;
        this.Velocity[1] = iY;
        this.Velocity[2] = iZ;
        this.AngularVelocity[0] = iRoll;
        this.AngularVelocity[1] = iPitch;
        this.AngularVelocity[2] = iYaw;
    }

    this.setAcceleration = function (iX, iY, iZ, iRoll, iPitch, iYaw) {

        this.Acceleration[0] = iX;
        this.Acceleration[1] = iY;
        this.Acceleration[2] = iZ;
        this.AngularAcceleration[0] = iRoll;
        this.AngularAcceleration[1] = iPitch;
        this.AngularAcceleration[2] = iYaw;
    }

    this.integrate = function (iDt) {

        if (6 > this.PositionHistory.length) {
            var wPositionData = new Float64Array(6);
            wPositionData[0] = this.Position[0];
            wPositionData[1] = this.Position[1];
            wPositionData[2] = this.Position[2];
            wPositionData[3] = this.AngularPosition[0];
            wPositionData[4] = this.AngularPosition[1];
            wPositionData[5] = this.AngularPosition[2];

            this.PositionHistory.push(wPositionData);
            this.PositionHistoryStartIndex = 0;

        }
        else {

            if (0 != this.PositionHistory.length) {
                var wPositionData = this.PositionHistory[this.PositionHistoryStartIndex];
                wPositionData[0] = this.Position[0];
                wPositionData[1] = this.Position[1];
                wPositionData[2] = this.Position[2];
                wPositionData[3] = this.AngularPosition[0];
                wPositionData[4] = this.AngularPosition[1];
                wPositionData[5] = this.AngularPosition[2];

                this.PositionHistoryStartIndex++;
                this.PositionHistoryStartIndex %= this.PositionHistory.length;
            }
        }

        var wDeltaPosition = vec3.create([0, 0, 0]);
        for (var wi = 0; wi < 3; ++wi) {
            this.Velocity[wi] += this.Acceleration[wi] * iDt;
            wDeltaPosition[wi] = this.Velocity[wi] * iDt;

            this.AngularVelocity[wi] += this.AngularAcceleration[wi] * iDt;
            this.AngularPosition[wi] += this.AngularVelocity[wi] * iDt;
        }

        var wNewPosition = addNEDToGC(this.Position[0], this.Position[1], this.Position[2], wDeltaPosition[0], wDeltaPosition[1], wDeltaPosition[2]);
        this.Position[2] = wNewPosition.Altitude;
        this.Position[1] = wNewPosition.Longitude;
        this.Position[0] = wNewPosition.Latitude;
    }

    this.drawAnimatedFrame = function (iAnimationElement) {

        var wSimMadelRef = this;

        if (null != wSimMadelRef.ModelRef) {
            iAnimationElement.SingleFrame.addDrawDescription(wSimMadelRef.Id, wSimMadelRef.ModelRef,
                wSimMadelRef.Position[0], wSimMadelRef.Position[1], wSimMadelRef.Position[2],
                wSimMadelRef.AngularPosition[0], wSimMadelRef.AngularPosition[1], wSimMadelRef.AngularPosition[2]
            )
        }

        var wLastPosition = wSimMadelRef.PositionHistory[wSimMadelRef.PositionHistoryStartIndex];
        if (null != wLastPosition) {


            var wRot1 = mat4.create();
            mat4.identity(wRot1);
            mat4.rotate(wRot1, wSimMadelRef.AngularPosition[2], [0, 0, 1]);
            mat4.rotate(wRot1, wSimMadelRef.AngularPosition[1], [0, 1, 0]);
            mat4.rotate(wRot1, wSimMadelRef.AngularPosition[0], [1, 0, 0]);

            var wPLeft1 = mat4.multiplyVec3(wRot1, [0, wSimMadelRef.ModelRef.BoundingBoxBottom[1], 0]);
            var wPRight1 = mat4.multiplyVec3(wRot1, [0, wSimMadelRef.ModelRef.BoundingBoxTop[1], 0]);

            var wRot2 = mat4.create();
            mat4.identity(wRot2);
            mat4.rotate(wRot2, wLastPosition[5], [0, 0, 1]);
            mat4.rotate(wRot2, wLastPosition[4], [0, 1, 0]);
            mat4.rotate(wRot2, wLastPosition[3], [1, 0, 0]);

            var wPLeft2 = mat4.multiplyVec3(wRot2, [0, wSimMadelRef.ModelRef.BoundingBoxBottom[1], 0]);
            var wPRight2 = mat4.multiplyVec3(wRot2, [0, wSimMadelRef.ModelRef.BoundingBoxTop[1], 0]);

            var wDeltaPosition = convertGCtoNED(wLastPosition[0], wLastPosition[1], wLastPosition[2],
                wSimMadelRef.Position[0], wSimMadelRef.Position[1], wSimMadelRef.Position[2])


            wPLeft2[0] += wDeltaPosition.North;
            wPLeft2[1] += wDeltaPosition.East;
            wPLeft2[2] += wDeltaPosition.Down;

            wPRight2[0] += wDeltaPosition.North;
            wPRight2[1] += wDeltaPosition.East;
            wPRight2[2] += wDeltaPosition.Down;

            var wDLeft = [wPLeft2[0] - wPLeft1[0], wPLeft2[1] - wPLeft1[1], wPLeft2[2] - wPLeft1[2]];
            var wDRight = [wPRight2[0] - wPRight1[0], wPRight2[1] - wPRight1[1], wPRight2[2] - wPRight1[2]];

            var wLLeft = Math.sqrt(wDLeft[0] * wDLeft[0] + wDLeft[1] * wDLeft[1] + wDLeft[2] * wDLeft[2]);
            var wLRight = Math.sqrt(wDRight[0] * wDRight[0] + wDRight[1] * wDRight[1] + wDRight[2] * wDRight[2]);

            var wLLeft_XY = Math.sqrt(wDLeft[0] * wDLeft[0] + wDLeft[1] * wDLeft[1]);
            var wLRight_XY = Math.sqrt(wDRight[0] * wDRight[0] + wDRight[1] * wDRight[1]);

            var wYawLeft = Math.atan2(wDLeft[1], wDLeft[0]);
            var wYawRight = Math.atan2(wDRight[1], wDRight[0]);

            if (wLLeft_XY[0] < 0.001) {
                return;
            }

            if (wLRight_XY[0] < 0.001) {
                return;
            }

            var wPitchLeft = Math.atan2(-wDLeft[2], wLLeft_XY);
            var wPitchRight = Math.atan2(-wDRight[2], wLRight_XY);

            var wTL_Position = addNEDToGC(wSimMadelRef.Position[0], wSimMadelRef.Position[1], wSimMadelRef.Position[2], wPLeft1[0], wPLeft1[1], wPLeft1[2]);
            var wTR_Position = addNEDToGC(wSimMadelRef.Position[0], wSimMadelRef.Position[1], wSimMadelRef.Position[2], wPRight1[0], wPRight1[1], wPRight1[2]);


            var wLineR = gModelLibrary.findModel("Line_R");

            if (null != wLineR) {

                var wBuffer = iAnimationElement.IntegratedFrame.addDrawDescription(wSimMadelRef.Id, wLineR,
                    wTL_Position.Latitude, wTL_Position.Longitude, wTL_Position.Altitude,
                    0.0, wPitchLeft, wYawLeft
                );
                wBuffer.scale_x = wLLeft;

            }

            var wLineG = gModelLibrary.findModel("Line_G");

            if (null != wLineG) {

                var wBuffer = iAnimationElement.IntegratedFrame.addDrawDescription(wSimMadelRef.Id, wLineG,
                    wTR_Position.Latitude, wTR_Position.Longitude, wTR_Position.Altitude,
                    0.0, wPitchRight, wYawRight
                );
                wBuffer.scale_x = wLRight;

            }
        }
    }

}

function SimulationDirector() {
    this.ModelList = new Array();

    this.getModelAt = function (iIndex) {
        if (0 <= iIndex) {
            if (0 != this.ModelList.length) {
                return this.ModelList[iIndex % this.ModelList.length]
            }
        }
        return null;
    }


    this.getModelIndex = function (iId) {

        for (var wi = 0; wi < this.ModelList.length; ++wi) {
            if (iId == this.ModelList[wi].Id) {
                return wi;
            }
        }

        return -1;
    }


    this.addSimulationModel = function (iId, iModelRef, iTracerModelRef) {
        var wNewModel = new SimulationModel(iId, iModelRef, iTracerModelRef);
        this.ModelList.push(wNewModel);

        return wNewModel;
    }


    this.deleteSimulationModel = function (iId) {
        var wModelList = new Array();

        for (var wi = 0; wi < this.ModelList.length; ++wi) {

            if (iId != this.ModelList[wi].Id) {
                wModelList.push(this.ModelList[wi]);
            }
        }
        this.ModelList = wModelList;
    }

    this.integrate = function (iDt) {
        for (var wi = 0; wi < this.ModelList.length; ++wi) {
            this.ModelList[wi].integrate(iDt);
        }
    }

    this.drawAnimationFrame = function (iAnimationElement) {

        for (var wi = 0; wi < this.ModelList.length; ++wi) {

            var wSimModelRef = this.ModelList[wi];

            wSimModelRef.drawAnimatedFrame(iAnimationElement);
        }
    }


    this.integrate_Specific = function (iDt, iId) {

        for (var wi = 0; wi < this.ModelList.length; ++wi) {

            if (iId == this.ModelList[wi].Id) {
                this.ModelList[wi].integrate(iDt);
            }
        }
    }

    this.drawAnimationFrame_Specific = function (iAnimationElement, iId) {

        for (var wi = 0; wi < this.ModelList.length; ++wi) {

            var wSimModelRef = this.ModelList[wi];

            if (iId == wSimModelRef.Id) {
                wSimModelRef.drawAnimatedFrame(iAnimationElement);
            }
        }
    }

    this.getSimulationModelIdList = function () {
        var wIdList = new Array();

        for (var wi = 0; wi < this.ModelList.length; ++wi) {

            wIdList.push(this.ModelList[wi].Id);
        }

        return wIdList;
    }

}