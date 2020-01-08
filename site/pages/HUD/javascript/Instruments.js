function drawCursorCircle(iCanvasCtx, iX, iY, iValue, iHeight, iWidth) {
    
    var wFillColor = iCanvasCtx.fillStyle;
    var wLineColor = iCanvasCtx.strokeStyle;
    var wLineWidth = iCanvasCtx.lineWidth;
    
    iCanvasCtx.fillStyle = wFillColor;
    iCanvasCtx.strokeStyle = wFillColor;
    iCanvasCtx.lineWidth = iCanvasCtx.lineWidth+1;

    var wDiameter = iHeight;
    if(iWidth > wDiameter) wDiameter = iWidth;

    iCanvasCtx.beginPath();
    iCanvasCtx.arc(iX, iY, wDiameter/2,0,2*Math.PI);
    iCanvasCtx.stroke();
    
    iCanvasCtx.fillStyle = wFillColor;
    iCanvasCtx.strokeStyle = wLineColor;
    iCanvasCtx.lineWidth = wLineWidth;
}


function drawAircraftCursor(iCanvasCtx, iX, iY, iValue, iHeight, iWidth) {

    var wFillColor = iCanvasCtx.fillStyle;
    var wLineColor = iCanvasCtx.strokeStyle;
    var wLineWidth = iCanvasCtx.lineWidth;
    
    iCanvasCtx.fillStyle = wFillColor;
    iCanvasCtx.strokeStyle = wFillColor;
    iCanvasCtx.lineWidth = iCanvasCtx.lineWidth+1;

    var wStep = 0.05*iWidth;
    iCanvasCtx.beginPath();
    iCanvasCtx.moveTo( - 2.5*wStep, 0);
    iCanvasCtx.lineTo( - 1.5*wStep, 0);
    iCanvasCtx.lineTo( - 1*wStep, 0.5*wStep);

    iCanvasCtx.lineTo( - 0*wStep, -0.5*wStep);
    
    iCanvasCtx.lineTo( 1*wStep, 0.5*wStep);
    iCanvasCtx.lineTo( 1.5*wStep, 0);
    iCanvasCtx.lineTo( 2.5*wStep, 0);

    iCanvasCtx.stroke();

    iCanvasCtx.fillStyle = wFillColor;
    iCanvasCtx.strokeStyle = wLineColor;
    iCanvasCtx.lineWidth = wLineWidth;
}


function drawGaugeNeedle(iCanvasCtx, iX, iY, iValue, iHeight, iWidth) {

    var iFixedValue = iValue.toFixed(2);
    iCanvasCtx.textAlign = "center";
    iCanvasCtx.textBaseline = 'middle';
    iCanvasCtx.fillText(iFixedValue, iX, iY);
    /*
    iCanvasCtx.beginPath();
    iCanvasCtx.moveTo(0, 0);
    iCanvasCtx.lineTo(iX, 0);
    iCanvasCtx.lineTo(iX, iY);
    //          iCanvasCtx.rect(-iSize / 2 + iX, -2 * iSize + iY, iSize, 4 * iSize);
    //        iCanvasCtx.fill();
    iCanvasCtx.stroke();*/
}

function drawWheelNeedle(iCanvasCtx, iX, iY, iValue, iHeight, iWidth) {

    iCanvasCtx.textAlign = "center";
    iCanvasCtx.textBaseline = 'middle';
    if(Math.abs(iX) > Math.abs(iY))
    {
        iCanvasCtx.fillText(iValue, 0, 0);
    }
    else {
        iCanvasCtx.fillText(iValue, 0, 0);
    }
}

function drawSimpleDash(iCanvasCtx, iX, iY, iValue, iHeight, iWidth) {
    var wFillColor = iCanvasCtx.filleStyle;
    var wLineColor = iCanvasCtx.strokeStyle;
    
    iCanvasCtx.strokeStyle = wLineColor;

    iCanvasCtx.beginPath();
    iCanvasCtx.rect(-iWidth / 2 + iX, -iHeight/2 + iY, iWidth, iHeight);
    iCanvasCtx.fill();

    iCanvasCtx.filleStyle = wFillColor;
    iCanvasCtx.strokeStyle = wLineColor;

}

function drawNumberedDash(iCanvasCtx, iX, iY, iValue, iHeight, iWidth) {
    var wLineWidth = iCanvasCtx.linewidth;
    iCanvasCtx.linewidth = iWidth;
    iCanvasCtx.textAlign = "center";
    iCanvasCtx.textBaseline = 'middle';
    if(iHeight > iWidth)
    {
        iCanvasCtx.fillText(iValue, iX, iY - iHeight/2 - 15);
    }
    else
    {
        iCanvasCtx.fillText(iValue, iX - iWidth/2 - 15, iY);
    }
    
    drawSimpleDash(iCanvasCtx, iX, iY, iValue, iHeight, iWidth);

}


function drawNumberedDashReflected(iCanvasCtx, iX, iY, iValue, iHeight, iWidth) {
    var wLineWidth = iCanvasCtx.linewidth;
    iCanvasCtx.linewidth = iWidth;
    iCanvasCtx.textAlign = "center";
    iCanvasCtx.textBaseline = 'middle';
    if(iHeight > iWidth)
    {
        iCanvasCtx.fillText(iValue, iX, iY + iHeight/2 + 15);
    }
    else
    {
        iCanvasCtx.fillText(iValue, iX + iWidth/2 + 15, iY);
    }
    
    drawSimpleDash(iCanvasCtx, iX, iY, iValue, iHeight, iWidth);

}

function Gauge() {

    this.reset = function ()
    {
        this.mIsRectangular = false;
        this.mScaleToLimits = false;
        this.mUseNeedle = false;

        //Ratio
        this.mGaugeMin = -1.0;
        this.mGaugeMax = 1.0;
        this.mGaugeMinorSeperation = 0.05;
        this.mGaugeMajorSeperation = 0.25;
        this.mGaugeValueScale = 180;

        //Pixel
        this.mGaugeMinorWidth = 1;
        this.mGaugeMajorWidth = 2;
        this.mGaugeMinorProtrusionHeight = 5;
        this.mGaugeMajorProtrusionHeight = 10;
        this.mGaugeBarHeight = 6;
        this.mGaugeSize = 150;

        //Angle radian
        this.mGaugeAngle = 0.6;

        this.mBarColorArray = [];
        this.mValueArray = [];

        this.drawNeedle = drawGaugeNeedle;
        this.drawMinorTic = drawSimpleDash;
        this.drawMajorTic = drawNumberedDash;
    }

    this.reset();

    this.drawTic = function (iCanvasCtx, iX, iY, iValue, iTicHeight, iTicWidth, iDrawFunction)
    {
        var wValue = iValue;
        if (true == this.mScaleToLimits) {
            if (iValue > 0) {
                wValue = iValue / this.mGaugeMax;
            }
            else {
                wValue = -iValue / this.mGaugeMin;
            }
        }
        iDrawFunction(iCanvasCtx, iX, iY, wValue * this.mGaugeValueScale, iTicHeight, iTicWidth);
    
    }

    this.drawGauge = function (iCanvasCtx, iGaugeCenterX, iGaugeCenterY) {

        iCanvasCtx.save();
        iCanvasCtx.translate(iGaugeCenterX, iGaugeCenterY);
        iCanvasCtx.rotate(this.mGaugeAngle);

        if (true == this.mIsRectangular) {
            if (false == this.mUseNeedle) this.drawRectangleGauge(iCanvasCtx, iGaugeCenterX, iGaugeCenterY);
            this.drawRectangleGaugeGrid(iCanvasCtx, iGaugeCenterX, iGaugeCenterY);
            if (true == this.mUseNeedle) this.drawRectangleGauge(iCanvasCtx, iGaugeCenterX, iGaugeCenterY);
        }
        else {
            if (false == this.mUseNeedle) this.drawRadialGauge(iCanvasCtx, iGaugeCenterX, iGaugeCenterY);
            this.drawRadialGaugeGrid(iCanvasCtx, iGaugeCenterX, iGaugeCenterY);
            if (true == this.mUseNeedle) this.drawRadialGauge(iCanvasCtx, iGaugeCenterX, iGaugeCenterY);
        }

        iCanvasCtx.restore();

    }

    this.drawRectangleGauge = function (iCanvasCtx, iGaugeCenterX, iGaugeCenterY) {
        
        iCanvasCtx.save();
        for (var i = 0; i < this.mValueArray.length; ++i) {

            var wValue = 0;
            if (true == this.mScaleToLimits) {
                if (this.mValueArray[i] > 0) {
                    wValue = this.mGaugeSize * this.mValueArray[i] * this.mGaugeMax;
                }
                else {
                    wValue = -this.mGaugeSize * this.mValueArray[i] * this.mGaugeMin;
                }
            }
            else {
                wValue = this.mGaugeSize * this.mValueArray[i];
            }
        
            var wHeight = (this.mValueArray.length - i) * this.mGaugeBarHeight;
            if (true == this.mUseNeedle) {

                this.drawTic(iCanvasCtx, wValue, -wHeight + this.mGaugeBarHeight/2, this.mValueArray[i], this.mGaugeBarHeight, this.mGaugeBarHeight, this.drawNeedle);
                if(null != this.mBarColorArray[i])
                {
                    iCanvasCtx.fillStyle = this.mBarColorArray[i];
                    iCanvasCtx.fill();
                }
           }
            else {
                iCanvasCtx.beginPath();
                iCanvasCtx.rect(0, -wHeight, wValue, this.mGaugeBarHeight);
                if(null != this.mBarColorArray[i])
                {
                    iCanvasCtx.fillStyle = this.mBarColorArray[i];
                    iCanvasCtx.fill();
                }
                iCanvasCtx.stroke();
            }
        }
        iCanvasCtx.restore();
    }

    this.drawRectangleGaugeGrid = function (iCanvasCtx, iGaugeCenterX, iGaugeCenterY) {

        var wGaugeHeight = this.mGaugeBarHeight * this.mValueArray.length;
        var wHalfGaugeHeight = wGaugeHeight / 2;
        wGaugeHeight += this.mGaugeMinorProtrusionHeight;

        for (var i = 0; i <= this.mGaugeMax; i += this.mGaugeMinorSeperation) {
            var wIndexRatio = i / this.mGaugeMajorSeperation;
            wIndexRatio = Math.abs(wIndexRatio - Math.round(wIndexRatio));

            if (wIndexRatio > 0.000001) {
                var wX = i * this.mGaugeSize;
                this.drawTic(iCanvasCtx, wX, -wHalfGaugeHeight, i, wGaugeHeight, this.mGaugeMinorWidth, this.drawMinorTic);
            }
        }

        for (var i = -this.mGaugeMinorSeperation; i >= this.mGaugeMin; i -= this.mGaugeMinorSeperation) {
            var wIndexRatio = i / this.mGaugeMajorSeperation;
            wIndexRatio = Math.abs(wIndexRatio - Math.round(wIndexRatio));

            if (wIndexRatio > 0.000001) {
                var wX = i * this.mGaugeSize;
                this.drawTic(iCanvasCtx, wX, -wHalfGaugeHeight, i, wGaugeHeight, this.mGaugeMinorWidth, this.drawMinorTic);
            }
        }

        var wGaugeHeight = this.mGaugeBarHeight * this.mValueArray.length;
        wGaugeHeight += this.mGaugeMajorProtrusionHeight;

        var wGaugeSizeSep = this.mGaugeMajorSeperation * this.mGaugeSize;

        for (var i = 0; i <= this.mGaugeMax; i += this.mGaugeMajorSeperation) {
            var wX = i * this.mGaugeSize;
            this.drawTic(iCanvasCtx, wX, -wHalfGaugeHeight, i, wGaugeHeight, this.mGaugeMajorWidth, this.drawMajorTic);
        }

        for (var i = -this.mGaugeMajorSeperation; i >= this.mGaugeMin; i -= this.mGaugeMajorSeperation) {
            var wX = i * this.mGaugeSize;
            this.drawTic(iCanvasCtx, wX, -wHalfGaugeHeight, i, wGaugeHeight, this.mGaugeMajorWidth, this.drawMajorTic);
        }
    }

    this.drawRadialGauge = function (iCanvasCtx, iGaugeCenterX, iGaugeCenterY) {
        iCanvasCtx.save();

        for (var i = 0; i < this.mValueArray.length ; ++i) {

            var wStartRadius = this.mGaugeSize - (i) * this.mGaugeBarHeight;
            var wEndAngle = 0;
            
            if (true == this.mScaleToLimits) {
                if (this.mValueArray[i] > 0) {
                    wEndAngle = this.mValueArray[i] * this.mGaugeMax * Math.PI;
                }
                else {
                    wEndAngle = - this.mValueArray[i] * this.mGaugeMin * Math.PI;
                }
            }
            else {
                wEndAngle = this.mValueArray[i] * Math.PI;
            }

            var wEndRadius = wStartRadius - this.mGaugeBarHeight;

            if (true == this.mUseNeedle) {
                iCanvasCtx.rotate(wEndAngle);
                var wBarCenter = (wEndRadius + wStartRadius) / 2;
                this.drawTic(iCanvasCtx, 0, -wBarCenter, this.mValueArray[i], this.mGaugeBarHeight, this.mGaugeBarHeight, this.drawNeedle);
                if(null != this.mBarColorArray[i])
                {
                    iCanvasCtx.fillStyle = this.mBarColorArray[i];
                    iCanvasCtx.fill();
                }
                iCanvasCtx.rotate(-wEndAngle);
            }
            else {

                var  wHalfPie = Math.PI / 2;
                wEndAngle -= wHalfPie;

                iCanvasCtx.beginPath();

                iCanvasCtx.arc(0, 0, wStartRadius, -wHalfPie, wEndAngle, (0 > this.mValueArray[i]));
                iCanvasCtx.arc(0, 0, wEndRadius, wEndAngle, -wHalfPie, !(0 > this.mValueArray[i]));

                iCanvasCtx.closePath();
                if(null != this.mBarColorArray[i])
                {
                    iCanvasCtx.fillStyle = this.mBarColorArray[i];
                    iCanvasCtx.fill();
                }
                iCanvasCtx.stroke();
            }
        }
        iCanvasCtx.restore();

    }

    this.drawRadialGaugeGrid = function (iCanvasCtx, iGaugeCenterX, iGaugeCenterY) {

        var wGaugeHeight = this.mValueArray.length * this.mGaugeBarHeight;
        var wGaugeDashRadialCenter = this.mGaugeSize - (wGaugeHeight) / 2;

        wGaugeHeight += this.mGaugeMinorProtrusionHeight;

        for (var i = 0; i <= this.mGaugeMax; i += this.mGaugeMinorSeperation) {
            var wIndexRatio = i / this.mGaugeMajorSeperation;
            wIndexRatio = Math.abs(wIndexRatio - Math.round(wIndexRatio));

            if (wIndexRatio > 0.000001) {
                this.drawTic(iCanvasCtx, 0, -wGaugeDashRadialCenter, i, wGaugeHeight, this.mGaugeMinorWidth, this.drawMinorTic);
            }
            iCanvasCtx.rotate(this.mGaugeMinorSeperation * Math.PI);
        }
        iCanvasCtx.rotate(-i * Math.PI);

        iCanvasCtx.rotate(-this.mGaugeMinorSeperation * Math.PI);
        for (var i = -this.mGaugeMinorSeperation; i >= this.mGaugeMin; i -= this.mGaugeMinorSeperation) {
            var wIndexRatio = i / this.mGaugeMajorSeperation;
            wIndexRatio = Math.abs(wIndexRatio - Math.round(wIndexRatio));

            if (wIndexRatio > 0.000001) {
                this.drawTic(iCanvasCtx, 0, -wGaugeDashRadialCenter, i, wGaugeHeight, this.mGaugeMinorWidth, this.drawMinorTic);
            }
            iCanvasCtx.rotate(-this.mGaugeMinorSeperation * Math.PI);
        }
        iCanvasCtx.rotate(-i * Math.PI);

        var wGaugeHeight = this.mValueArray.length * this.mGaugeBarHeight;
        wGaugeHeight += this.mGaugeMajorProtrusionHeight;

        for (var i = 0; i <= this.mGaugeMax; i += this.mGaugeMajorSeperation) {
            this.drawTic(iCanvasCtx, 0, -wGaugeDashRadialCenter, i, wGaugeHeight, this.mGaugeMajorWidth, this.drawMajorTic);
            iCanvasCtx.rotate(this.mGaugeMajorSeperation * Math.PI);
        }
        iCanvasCtx.rotate(-i * Math.PI);

        iCanvasCtx.rotate(-this.mGaugeMajorSeperation * Math.PI);
        for (var i = -this.mGaugeMajorSeperation; i >= this.mGaugeMin; i -= this.mGaugeMajorSeperation) {
            if (false == ((i == this.mGaugeMin) && (this.mGaugeMin == -1) && (this.mGaugeMax == 1)))
            {
                this.drawTic(iCanvasCtx, 0, -wGaugeDashRadialCenter, i, wGaugeHeight, this.mGaugeMajorWidth, this.drawMajorTic);
            }
            iCanvasCtx.rotate(-this.mGaugeMajorSeperation * Math.PI);
        }
        iCanvasCtx.rotate(-i * Math.PI);
    }
}

function Wheel() {

    this.reset = function(){
        this.mIsPerpendicular = false;
        this.mIsVertical = false;
        this.mValueScale = 180/Math.PI;
        this.mNormalizeSignPI = false;
        this.mNormalizeAngle = false;
        this.mDrawNeedle = true;

        //Ratio
        this.mWheelMinorSeperation = 5*(Math.PI/180);
        this.mWheelMajorSeperation = 30 * (Math.PI / 180);

        //Pixel
        this.mWheelMinorWidth = 1;
        this.mWheelMajorWidth = 2;
        this.mWheelMinorHeight = 5;
        this.mWheelMajorHeight = 10;
        this.mWheelRadius = 150;

        //Angle radian
        this.mWheelViewAngle = Math.PI;
        this.mWheelAngle = 0;
        this.mWheelPosition = 0.6;

        this.drawNeedle = drawWheelNeedle;
        this.drawMinorTic = drawSimpleDash;
        this.drawMajorTic = drawNumberedDash;
    }

    this.reset();

    this.convertValue = function(iValue){

        var iFixedValue = iValue;

        if(true == this.mNormalizeAngle)
        {
            while (iFixedValue < 0) {
                iFixedValue += 2*Math.PI;
            }
            while (iFixedValue >= 2*Math.PI) {
                iFixedValue -= 2*Math.PI;
            }
        }

        if(true == this.mNormalizeSignPI)
        {
            while (iFixedValue < -Math.PI) {
                iFixedValue += 2*Math.PI;
            }
            while (iFixedValue >= Math.PI) {
                iFixedValue -= 2*Math.PI;
            }
        }

        return iFixedValue*this.mValueScale;
    }

    this.setPosition = function (iValue){
        this.mWheelPosition = iValue / this.mValueScale;
    }

    
    this.getPosition = function (){
        return this.mWheelPosition * this.mValueScale;
    }

    this.drawTic = function (iCanvasCtx, iX, iY, iValue, iTicHeight, iTicWidth, iDrawFunction)
    {
        iDrawFunction(iCanvasCtx, iX, iY, Math.round(this.convertValue(iValue)), iTicHeight, iTicWidth);
    }

    this.drawWheel = function (iCanvasCtx, iWheelCenterX, iWheelCenterY) {

        iCanvasCtx.save();
        iCanvasCtx.translate(iWheelCenterX, iWheelCenterY);
        iCanvasCtx.rotate(this.mWheelAngle);

        if (true == this.mIsPerpendicular) {
            this.drawPerpendicularWheelGrid(iCanvasCtx, iWheelCenterX, iWheelCenterY);
        }
        else {
            this.drawFlatWheelGrid(iCanvasCtx, iWheelCenterX, iWheelCenterY);
        }
        
        iCanvasCtx.rotate(-this.mWheelAngle);
        if(true == this.mDrawNeedle)  this.drawWheelNeedle(iCanvasCtx, iWheelCenterX, iWheelCenterY);

        iCanvasCtx.restore();

    }
    
    this.drawWheelNeedle = function (iCanvasCtx, iWheelCenterX, iWheelCenterY){
        var wHeight = this.mWheelRadius;
        if(true == this.mIsPerpendicular) wHeight = this.mWheelMajorHeight;

        wHeight *= -1;
        if(true == this.mIsVertical){
            this.drawTic(iCanvasCtx,wHeight*Math.cos(this.mWheelAngle), wHeight*Math.sin(this.mWheelAngle), this.mWheelPosition, this.mWheelRadius, this.mWheelRadius, this.drawNeedle);
        }
        else {
            this.drawTic(iCanvasCtx, wHeight*Math.sin(this.mWheelAngle), wHeight*Math.cos(this.mWheelAngle), this.mWheelPosition, this.mWheelRadius, this.mWheelRadius, this.drawNeedle);
        }
    }

    this.drawPerpendicularWheelGrid = function (iCanvasCtx, iWheelCenterX, iWheelCenterY) {
              
        var wFullCircle = false;
        var wHalfViewAngle = this.mWheelViewAngle / 2;
        if (wHalfViewAngle > Math.Pi)
        {
            wHalfViewAngle = Math.Pi;
            wFullCircle = true;
        }

        var wStartAngle = this.mWheelPosition - wHalfViewAngle;
        var wEndAngle = this.mWheelPosition + wHalfViewAngle;
        var wStarMinortTic = Math.floor(wStartAngle / this.mWheelMinorSeperation) * this.mWheelMinorSeperation;
        var wEndMinorTic = Math.ceil(wStartAngle / this.mWheelMinorSeperation) * this.mWheelMinorSeperation;

        for (var i = wStarMinortTic; i < wEndAngle; i += this.mWheelMinorSeperation) {
            if (wStartAngle > i) {
                continue;
            }
            var wRotation = i - this.mWheelPosition;

            var wIndexRatio = i / this.mWheelMajorSeperation;
            wIndexRatio = Math.abs(wIndexRatio - Math.round(wIndexRatio));

            if (wIndexRatio > 0.000001) {
                var wRotation = i - this.mWheelPosition;
                
                if(true == this.mIsVertical){
                    this.drawTic(iCanvasCtx, 0 , -this.mWheelRadius * Math.sin(wRotation), i, this.mWheelMinorWidth, this.mWheelMinorHeight, this.drawMinorTic);
                }
                else{
                    this.drawTic(iCanvasCtx, this.mWheelRadius * Math.sin(wRotation), 0, i, this.mWheelMinorHeight, this.mWheelMinorWidth, this.drawMinorTic);
                }
            }
        }

        var wStarMajorTic = Math.floor(wStartAngle / this.mWheelMajorSeperation) * this.mWheelMajorSeperation;

        for (var i = wStarMajorTic; i < wEndAngle; i += this.mWheelMajorSeperation) {
            if (wStartAngle > i) {
                continue;
            }
            var wRotation = i - this.mWheelPosition;
            
            if(true == this.mIsVertical){
                this.drawTic(iCanvasCtx, 0, -this.mWheelRadius * Math.sin(wRotation), i, this.mWheelMajorWidth, this.mWheelMajorHeight, this.drawMajorTic);
            }
            else{
                this.drawTic(iCanvasCtx, this.mWheelRadius * Math.sin(wRotation), 0, i, this.mWheelMajorHeight, this.mWheelMajorWidth, this.drawMajorTic);
            }
        }
    }

    this.drawFlatWheelGrid = function (iCanvasCtx, iWheelCenterX, iWheelCenterY) {

        var wFullCircle = false;
        var wHalfViewAngle = this.mWheelViewAngle / 2;
        if (wHalfViewAngle > Math.Pi)
        {
            wHalfViewAngle = Math.Pi;
            wFullCircle = true;
        }

        var wStartAngle = this.mWheelPosition - wHalfViewAngle;
        var wEndAngle = this.mWheelPosition + wHalfViewAngle;
        var wStarMinortTic = Math.floor(wStartAngle / this.mWheelMinorSeperation) * this.mWheelMinorSeperation;
        var wEndMinorTic = Math.ceil(wStartAngle / this.mWheelMinorSeperation) * this.mWheelMinorSeperation;

        for (var i = wStarMinortTic; i < wEndAngle; i += this.mWheelMinorSeperation) {
            if (wStartAngle > i) {
                continue;
            }
            var wRotation = i - this.mWheelPosition;
            
            if(true == this.mIsVertical){
                wRotation -= Math.PI/2;
            }

            var wIndexRatio = i / this.mWheelMajorSeperation;
            wIndexRatio = Math.abs(wIndexRatio - Math.round(wIndexRatio));

            if (wIndexRatio > 0.000001) {
                iCanvasCtx.rotate(wRotation);
                this.drawTic(iCanvasCtx, 0, -this.mWheelRadius, i, this.mWheelMinorHeight, this.mWheelMinorWidth, this.drawMinorTic);
                iCanvasCtx.rotate(-wRotation);
            }
        }

        var wStarMajorTic = Math.floor(wStartAngle / this.mWheelMajorSeperation) * this.mWheelMajorSeperation;

        for (var i = wStarMajorTic; i < wEndAngle; i += this.mWheelMajorSeperation) {
            if (wStartAngle > i) {
                continue;
            }
            var wRotation = i - this.mWheelPosition;

            if(true == this.mIsVertical){
                wRotation -= Math.PI/2;
            }
            iCanvasCtx.rotate(wRotation);
            this.drawTic(iCanvasCtx, 0, -this.mWheelRadius, i, this.mWheelMajorHeight, this.mWheelMajorWidth, this.drawMajorTic);
            iCanvasCtx.rotate(-wRotation);
        }
    }
}


function ArtificialHorizon() {
    
    this.drawRollGyro = function(iCanvasCtx, iX, iY, iValue, iHeight, iWidth) {

        if (0 == iValue) {

            this.mPitchWheel.drawWheel(iCanvasCtx, 0, 0);
            this.mVelocityAzimuthWheel.drawWheel(iCanvasCtx, 0, 0);
            drawNumberedDash(iCanvasCtx, iX, iY, this.mRollWheel.convertValue(this.mRollWheel.mWheelPosition).toFixed(2), iHeight, iWidth);
            drawNumberedDashReflected(iCanvasCtx, iX,-iY, this.mRollWheel.convertValue(this.mRollWheel.mWheelPosition).toFixed(2), iHeight, iWidth);
        }

    }

    this.drawPitchGyroMajor = function (iCanvasCtx, iX, iY, iValue, iHeight, iWidth) {

        if (0 == Math.abs(iValue)) {
            drawSimpleDash(iCanvasCtx, iX, iY, iValue, 1, this.mYawWheel.mWheelRadius);
        }
        else if (180 == Math.abs(iValue)) {
            
            drawSimpleDash(iCanvasCtx, iX, iY, iValue, 1, this.mYawWheel.mWheelRadius);
        }
        else{
            drawNumberedDash(iCanvasCtx, -this.mPitchWheel.mWheelRadius/10,iY, iValue, iHeight, iWidth);
            drawNumberedDashReflected(iCanvasCtx,this.mPitchWheel.mWheelRadius/10, iY, iValue, iHeight, iWidth);
        }
    }

    this.drawPitchGyroMinor = function (iCanvasCtx, iX, iY, iValue, iHeight, iWidth) {

        if (0 == Math.abs(iValue)) {
        }
        else if (180 == Math.abs(iValue)) {
        }
        else{
            drawSimpleDash(iCanvasCtx, -this.mPitchWheel.mWheelRadius/10, iY, iValue, iHeight, iWidth);
            drawSimpleDash(iCanvasCtx, this.mPitchWheel.mWheelRadius/10, iY, iValue, iHeight, iWidth);
        }
    }

    this.drawPitchGyroNeedle = function (iCanvasCtx, iX, iY, iValue, iHeight, iWidth) {
        
        this.mYawWheel.drawWheel(iCanvasCtx,0,0); 
    }
    
    this.drawVelAzimuthCursor = function (iCanvasCtx, iX, iY, iValue, iHeight, iWidth) {

        if (0 == Math.abs(iValue)) {

            this.mVelocityElevationWheel.drawWheel(iCanvasCtx, iX, iY);
        }
    }

    this.drawVelElevationCursor = function (iCanvasCtx, iX, iY, iValue, iHeight, iWidth) {

        if (0 == Math.abs(iValue)) {
            
            drawCursorCircle(iCanvasCtx, iX, iY, iValue, iHeight, iWidth);

            var wText = "( " + this.mVelocityAzimuthWheel.convertValue(this.mVelocityAzimuthWheel.mWheelPosition).toFixed(2)
                + "," + this.mVelocityElevationWheel.convertValue(this.mVelocityElevationWheel.mWheelPosition).toFixed(2) + " )";

            iCanvasCtx.textAlign = "left";
            iCanvasCtx.textBaseline = 'top';
            iCanvasCtx.fillText(wText, iX + iWidth, iY + iHeight);
        }
    }

    this.reset = function (){
        this.mGyroRadius = 175;
        this.mRollWheel = new Wheel();
        this.mPitchWheel = new Wheel();
        this.mYawWheel = new Wheel();

        this.mVelocityAzimuthWheel = new Wheel();
        this.mVelocityElevationWheel = new Wheel();

        this.mRollAngleReq = 0;
        this.mPitchAngleReq  = 0;
        this.mYawAngleReq  = 0;

        this.mVelocityAzimuthAngleReq = 0;
        this.mVelocityElevationAngleReq  = 0;

        this.mRollWheel.mIsPerpendicular = false;
        this.mRollWheel.mIsVertical = false;
        this.mRollWheel.mWheelViewAngle = 2 * Math.PI;
        this.mRollWheel.mWheelRadius = this.mGyroRadius;
        this.mRollWheel.mNormalizeSignPI = true;
        this.mRollWheel.drawMajorTic = this.drawRollGyro.bind(this);
        this.mRollWheel.mDrawNeedle = true;
        this.mRollWheel.mWheelMinorSeperation = 180*(Math.PI/180);
        this.mRollWheel.mWheelMajorSeperation = 180 * (Math.PI / 180);
        this.mRollWheel.drawNeedle = drawAircraftCursor;
            
        this.mPitchWheel.mIsPerpendicular = true;
        this.mPitchWheel.mIsVertical = true;
        this.mPitchWheel.mWheelViewAngle = Math.PI / 4;
        this.mPitchWheel.mWheelRadius = this.mGyroRadius;
        this.mPitchWheel.mNormalizeSignPI = true;
        this.mPitchWheel.drawMajorTic = this.drawPitchGyroMajor.bind(this);
        this.mPitchWheel.drawMinorTic = this.drawPitchGyroMinor.bind(this);
        this.mPitchWheel.mDrawNeedle = true;
        this.mPitchWheel.mWheelMinorSeperation = 5*(Math.PI/180);
        this.mPitchWheel.mWheelMajorSeperation = 10 * (Math.PI / 180);
        this.mPitchWheel.drawNeedle = this.drawPitchGyroNeedle.bind(this);

        this.mYawWheel.mIsPerpendicular = true;
        this.mYawWheel.mIsVertical = false;
        this.mYawWheel.mWheelViewAngle = 0.5*Math.PI;
        this.mYawWheel.mWheelRadius = this.mGyroRadius;
        this.mYawWheel.mNormalizeAngle = true;
        this.mYawWheel.mDrawNeedle = true;
        this.mYawWheel.mWheelMinorSeperation = 10*(Math.PI/180);
        this.mYawWheel.mWheelMajorSeperation = 30 * (Math.PI / 180);
        this.mYawWheel.mWheelMinorHeight = 2;
        this.mYawWheel.mWheelMajorHeight = 4;

        
        this.mVelocityAzimuthWheel = new Wheel();
        this.mVelocityElevationWheel = new Wheel();

        this.mVelocityAzimuthWheel.mIsPerpendicular = true;
        this.mVelocityAzimuthWheel.mIsVertical = false;
        this.mVelocityAzimuthWheel.mWheelViewAngle = this.mYawWheel.mWheelViewAngle;
        this.mVelocityAzimuthWheel.mWheelRadius = this.mGyroRadius;
        this.mVelocityAzimuthWheel.mNormalizeSignPI = true;
        this.mVelocityAzimuthWheel.drawMajorTic = this.drawVelAzimuthCursor.bind(this);
        this.mVelocityAzimuthWheel.mWheelMinorSeperation = 180*(Math.PI/180);
        this.mVelocityAzimuthWheel.mWheelMajorSeperation = 180 * (Math.PI / 180);
        this.mVelocityAzimuthWheel.mDrawNeedle = false;
            

        this.mVelocityElevationWheel.mIsPerpendicular = true;
        this.mVelocityElevationWheel.mIsVertical = true;
        this.mVelocityElevationWheel.mWheelViewAngle = this.mYawWheel.mWheelViewAngle;
        this.mVelocityElevationWheel.mWheelRadius = this.mGyroRadius;
        this.mVelocityElevationWheel.mNormalizeSignPI = true;
        this.mVelocityElevationWheel.drawMajorTic = this.drawVelElevationCursor.bind(this);
        this.mVelocityElevationWheel.mWheelMinorSeperation = 180*(Math.PI/180);
        this.mVelocityElevationWheel.mWheelMajorSeperation = 180 * (Math.PI / 180);
        this.mVelocityElevationWheel.mDrawNeedle = false;
        
    }

    this.reset();

    this.processTime = function (iDt){
        
        this.mRollWheel.setPosition( iDt*(this.mRollAngleReq - this.mRollWheel.getPosition()) +  this.mRollWheel.getPosition());
        this.mPitchWheel.setPosition( iDt*(this.mPitchAngleReq - this.mPitchWheel.getPosition()) + this.mPitchWheel.getPosition());
        this.mYawWheel.setPosition( iDt*(this.mYawAngleReq - this.mYawWheel.getPosition()) + this.mYawWheel.getPosition());

        this.mVelocityAzimuthWheel.setPosition( iDt*(this.mVelocityAzimuthAngleReq - this.mVelocityAzimuthWheel.getPosition()) + this.mVelocityAzimuthWheel.getPosition());
        this.mVelocityElevationWheel.setPosition( iDt*(this.mVelocityElevationAngleReq - this.mVelocityElevationWheel.getPosition()) + this.mVelocityElevationWheel.getPosition());
    }
    
    this.processTime(0.1);
    
    this.requestPosition = function (iRoll, iPitch, iYaw, iVelAzimuth, iVelElevation ){
        
        this.mRollAngleReq = iRoll;
        this.mPitchAngleReq  = iPitch;
        this.mYawAngleReq  = iYaw;

        this.mVelocityAzimuthAngleReq = iVelAzimuth;
        this.mVelocityElevationAngleReq  = iVelElevation;
    }
    
    this.settPosition = function (iRoll, iPitch, iYaw, iVelAzimuth, iVelElevation ){
        
        this.mRollWheel.setPosition(iRoll);
        this.mPitchWheel.setPosition(iPitch);
        this.mYawWheel.setPosition(iYaw);

        this.mVelocityAzimuthWheel.setPosition(iVelAzimuth);
        this.mVelocityElevationWheel.setPosition(iVelElevation);
    }

    this.drawArtificialHorizon = function(iCanvasCtx, iCenterX, iCenterY){
        
        var wRadius = 2*this.mGyroRadius;
        this.mRollWheel.mWheelRadius = 0.45*wRadius;
        this.mPitchWheel.mWheelRadius = wRadius;
        this.mYawWheel.mWheelRadius = wRadius;
        this.mVelocityAzimuthWheel.mWheelRadius = wRadius;
        this.mVelocityElevationWheel.mWheelRadius = wRadius;

        this.mRollWheel.drawWheel(iCanvasCtx, iCenterX, iCenterY);
    }

}
