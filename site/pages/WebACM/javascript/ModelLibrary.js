
function findVertexBoxSize(iVertexArray) {

    if (0 < iVertexArray.length) {
        var wTop = [iVertexArray[0], iVertexArray[1], iVertexArray[2]];
        var wBottom = [iVertexArray[0], iVertexArray[1], iVertexArray[2]];

        for (var wi = 0; wi < iVertexArray.length; ++wi) {
            var wIndex = wi % 3;
            if (wTop[wIndex] < iVertexArray[wi]) wTop[wIndex] = iVertexArray[wi];
            if (wBottom[wIndex] > iVertexArray[wi]) wBottom[wIndex] = iVertexArray[wi];
        }

        return {
            Top: wTop,
            Bottom: wBottom
        }
    }

}

function DrawBuffer(/*iBufferTypeEnum,*/ iDrawTypeEnum, iVertexList, iVertixNormal, iColorList) {

    // this.BufferTypeEnum = iBufferTypeEnum;
    this.DrawTypeEnum = iDrawTypeEnum;
    this.PositionData = iVertexList;
    this.NormalData = iVertixNormal;
    this.ColorData = iColorList;

    this.PositoinItemSize = 3;
    this.NormalItemSize = 3;
    this.ColorItemSize = 4;

    var wLength = this.PositionData.length - this.PositionData.length % this.PositoinItemSize;
    if (this.PositionData.length >= wLength) {
        this.PositionData.length = wLength;
    }

    this.ItemCount = wLength / this.PositoinItemSize;


    var wNLength = this.ItemCount * this.NormalItemSize;

    while (this.NormalData.length < wNLength) {
        var wLastIndex = this.NormalData.length - this.NormalItemSize;
        this.NormalData.push(this.NormalData[wLastIndex]);
        this.NormalData.push(this.NormalData[wLastIndex + 1]);
        this.NormalData.push(this.NormalData[wLastIndex + 2]);

    }

    if (this.NormalData.length >= wNLength) {
        this.NormalData.length = wNLength;
    }

    var wCLength = this.ItemCount * this.ColorItemSize;

    while (this.ColorData.length < wCLength) {
        var wLastIndex = this.ColorData.length - this.ColorItemSize;
        this.ColorData.push(this.ColorData[wLastIndex]);
        this.ColorData.push(this.ColorData[wLastIndex + 1]);
        this.ColorData.push(this.ColorData[wLastIndex + 2]);
        this.ColorData.push(this.ColorData[wLastIndex + 3]);

    }

    if (this.ColorData.length >= wCLength) {
        this.ColorData.length = wCLength;
    }
}

function Model(iModelName) {

    this.ModelName = iModelName;
    this.ModelIsLoaded = false;
    this.BufferList = new Array();
    this.BoundingBoxTop = [0, 0, 0];
    this.BoundingBoxBottom = [0, 0, 0];

    this.addBuffer = function (iDrawTypeEnum, iVertexList, iVertixNormalList, iColorList) {

        this.BufferList.push(new DrawBuffer(iDrawTypeEnum, iVertexList, iVertixNormalList, iColorList));

        var wBoundingCorners = findVertexBoxSize(iVertexList);

        if (1 == this.BufferList.length) {
            this.BoundingBoxTop = wBoundingCorners.Top;
            this.BoundingBoxBottom = wBoundingCorners.Bottom;
        }
        else {
            for (var wi = 0; wi < 3; ++wi) {
                if (this.BoundingBoxTop[wi] < wBoundingCorners.Top[wi]) this.BoundingBoxTop[wi] = wBoundingCorners.Top[wi];
                if (this.BoundingBoxBottom[wi] > wBoundingCorners.Bottom[wi]) this.BoundingBoxBottom[wi] = wBoundingCorners.Bottom[wi];
            }
        }
    }
}

function ModelLibrary() {
    this.ModelList = new Array();

    this.addNewModel = function (iModelRef) {
        this.ModelList.push(iModelRef);
        iModelRef.ModelIsLoaded = false;
        this.HasNewModel = true;
    }

    this.findModel = function (iModelName) {

        for (var wi = 0; wi < this.ModelList.length; ++wi) {

            if (iModelName == this.ModelList[wi].ModelName) {
                return this.ModelList[wi];
            }
        }

        return null;
    }

    this.getModelNameList = function () {
        var wNameList = new Array();

        for (var wi = 0; wi < this.ModelList.length; ++wi) {

            wNameList.push(this.ModelList[wi].ModelName);
        }

        return wNameList;
    }

    this.updateNewModelIntoGLBuffer = function (iGL, iForceUpLoad) {

        if ((true == this.HasNewModel) || (true == iForceUpLoad)) {
            for (var wi = 0; wi < this.ModelList.length; ++wi) {

                if ((false == this.ModelList[wi].ModelIsLoaded) || (true == iForceUpLoad)) {

                    for (var wj = 0; wj < this.ModelList[wi].BufferList.length; ++wj) {

                        this.ModelList[wi].BufferList[wj].PositionBuffer = iGL.createBuffer();
                        iGL.bindBuffer(iGL.ARRAY_BUFFER, this.ModelList[wi].BufferList[wj].PositionBuffer);
                        iGL.bufferData(iGL.ARRAY_BUFFER, new Float32Array(this.ModelList[wi].BufferList[wj].PositionData), iGL.STATIC_DRAW);
                        this.ModelList[wi].BufferList[wj].PositionBuffer.itemSize = this.ModelList[wi].BufferList[wj].PositoinItemSize;
                        this.ModelList[wi].BufferList[wj].PositionBuffer.numItems = this.ModelList[wi].BufferList[wj].ItemCount;

                        this.ModelList[wi].BufferList[wj].NormalBuffer = iGL.createBuffer();
                        iGL.bindBuffer(iGL.ARRAY_BUFFER, this.ModelList[wi].BufferList[wj].NormalBuffer);
                        iGL.bufferData(iGL.ARRAY_BUFFER, new Float32Array(this.ModelList[wi].BufferList[wj].NormalData), iGL.STATIC_DRAW);
                        this.ModelList[wi].BufferList[wj].NormalBuffer.itemSize = this.ModelList[wi].BufferList[wj].NormalItemSize;
                        this.ModelList[wi].BufferList[wj].NormalBuffer.numItems = this.ModelList[wi].BufferList[wj].ItemCount;

                        this.ModelList[wi].BufferList[wj].ColorBuffer = iGL.createBuffer();
                        iGL.bindBuffer(iGL.ARRAY_BUFFER, this.ModelList[wi].BufferList[wj].ColorBuffer);
                        iGL.bufferData(iGL.ARRAY_BUFFER, new Float32Array(this.ModelList[wi].BufferList[wj].ColorData), iGL.STATIC_DRAW);
                        this.ModelList[wi].BufferList[wj].ColorBuffer.itemSize = this.ModelList[wi].BufferList[wj].ColorItemSize;
                        this.ModelList[wi].BufferList[wj].ColorBuffer.numItems = this.ModelList[wi].BufferList[wj].ItemCount;
                    }

                    this.ModelList[wi].ModelIsLoaded = true;
                }
            }

            this.HasNewModel = false;
        }
    }
}