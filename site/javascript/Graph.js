function GraphAxis() {
    this.mScale = 1.0;
    this.mOffset = 0.0;
}

function Graph() {

    this.mVerticalAxis = [];
    this.mHorizontalAxis = [];

    this.getVerticalAxis = function (iAxisIndex) {
        if (null == this.mVerticalAxis[iAxisIndex]) {
            this.mVerticalAxis[iAxisIndex] = new GraphAxis();

        }
        return this.mVerticalAxis[iAxisIndex];
    }

    this.getHorizontalAxis = function (iAxisIndex) {
        if (null == this.mHorizontalAxis[iAxisIndex]) {
            this.mHorizontalAxis[iAxisIndex] = new GraphAxis();
        }
        return this.mHorizontalAxis[iAxisIndex];
    }

    this.removeVerticalAxis = function (iAxisIndex) {
        this.mVerticalAxis[iAxisIndex] = null;
    }

    this.removeHorizontalAxis = function (iAxisIndex) {
        this.mHorizontalAxis[iAxisIndex] = null;
    }

    this.setVertticalAxisScale = function (iAxisIndex, iScale) {
        this.getVerticalAxis(iAxisIndex).mScale = iScale;
    }

    this.setVertticalAxisOffset = function (iAxisIndex, iOffset) {
        this.getVerticalAxis(iAxisIndex).mOffset = iOffset;
    }

    this.setHorizontalAxisScale = function (iAxisIndex, iScale) {
        this.getHorizontalAxis(iAxisIndex).mScale = iScale;
    }

    this.setHorizontalAxisOffset = function (iAxisIndex, iOffset) {
        this.getHorizontalAxis(iAxisIndex).mOffset = iOffset;
    }

    this.renderCanvas = function (iCanvasDOM) {

        var wCtx = iCanvasDOM.getContext("2d");
        wCtx.strokeStyle = "red";
        var wLine = [[100, 0], [0, 0], [0, 100]];
        drawPolyLine(iCanvasDOM, wLine);

        wCtx.strokeStyle = "green";
        for(key in this.mVerticalAxis){
            var wAxis = this.mVerticalAxis[key];
            if(null != wAxis) {
                var wLine = [[100, wAxis.mOffset], [-100, wAxis.mOffset]];
                drawPolyLine(iCanvasDOM, wLine);        
            }
        }
        
        for(key in this.mHorizontalAxis){
            var wAxis = this.mHorizontalAxis[key];
            if(null != wAxis) {
                var wLine = [[wAxis.mOffset, 100], [wAxis.mOffset, -100]];
                drawPolyLine(iCanvasDOM, wLine);        
            }
        }
    }
}