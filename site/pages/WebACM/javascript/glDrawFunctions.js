DrawTypeEnum = {

    //   0 gl.POINTS To draw a series of points.
    //   1 gl.LINES To draw a series of unconnected line segments (individual lines).
    //   2 gl.LINE_STRIP To draw a series of connected line segments.
    //   3 gl.LINE_LOOP To draw a series of connected line segments. It also joins the first and last vertices to form a loop.
    //   4 gl.TRIANGLES To draw a series of separate triangles.
    //   5 gl.TRIANGLE_STRIP To draw a series of connected triangles in strip fashion.
    //   6 gl.TRIANGLE_FAN To draw a series of connected triangles sharing the first vertex in a fan-like fashion.

    POINTS: 0,
    LINES: 1,
    LINE_STRIP: 2,
    LINE_LOOP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6
};

BufferTypeEnum = {
    //  0. gl.STATIC_DRAW: Contents of the buffer are likely to be used often and not change often. Contents are written to the buffer, but not read.
    //  1. gl.DYNAMIC_DRAW: Contents of the buffer are likely to be used often and change often. Contents are written to the buffer, but not read.
    //  2. gl.STREAM_DRAW: Contents of the buffer are likely to not be used often. Contents are written to the buffer, but not read.

    STATIC_DRAW: 0,
    DYNAMIC_DRAW: 1,
    STREAM_DRAW: 2,
}


var gl;
var shaderProgram;


var gInitialCameraControl = {
    XOffset: -20,
    YOffset: 0,
    ZOffset: 0,
    RollOffset: 0,
    PitchOffset: -Math.PI / 6,
    YawOffset: Math.PI - Math.PI / 6,
    TargetIndex: 10000,
    TetherTargetIndex: 10000,
    TetherTargetEnable: false,
    ViewPointRollOffset: 0,
    ViewPointPitchOffset: 0,
    ViewPointYawOffset: 0,
}

var gCameraControl = {
    XOffset: gInitialCameraControl.XOffset,
    YOffset: gInitialCameraControl.YOffset,
    ZOffset: gInitialCameraControl.ZOffset,
    RollOffset: gInitialCameraControl.RollOffset,
    PitchOffset: gInitialCameraControl.PitchOffset,
    YawOffset: gInitialCameraControl.YawOffset,
    TargetIndex: gInitialCameraControl.TargetIndex,
    TetherTargetIndex: gInitialCameraControl.TetherTargetIndex,
    TetherTargetEnable: gInitialCameraControl.TetherTargetEnable,
    ViewPointRollOffset: gInitialCameraControl.ViewPointRollOffset,
    ViewPointPitchOffset: gInitialCameraControl.ViewPointPitchOffset,
    ViewPointYawOffset: gInitialCameraControl.ViewPointYawOffset

}

function getGL() {
    return gl;
}

function getGLCameraControl() {
    return gCameraControl;
}

function getGLShaderProgram() {
    return shaderProgram;
}


function initGL(iCanvas) {
    try {
        gl = iCanvas.getContext("experimental-webgl");
        gl.viewportWidth = iCanvas.width;
        gl.viewportHeight = iCanvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }

    initShaders();

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.DEPTH_TEST);
}

function resizeGL(iCanvas) {

    try {
        wGl = iCanvas.getContext("experimental-webgl");
        wGl.viewportWidth = iCanvas.width;
        wGl.viewportHeight = iCanvas.height;
    } catch (e) {
    }
}

function getGLShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShaders() {
    var fragmentShader = getGLShader(gl, "shader-fs");
    var vertexShader = getGLShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
    shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
    shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
}


var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var mvMatrixStack = [];


function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(getGLShaderProgram().pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(getGLShaderProgram().mvMatrixUniform, false, mvMatrix);

    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(getGLShaderProgram().nMatrixUniform, false, normalMatrix);
}

function drawAnimatedFrame(iAnimatedFrame, iLatitude, iLongitude, iAltitude) {

    var wDrawList = iAnimatedFrame.DrawList;

    for (var wi = 0; wi < wDrawList.length; ++wi) {

        if (null != wDrawList[wi].ModelRef) {

            var wModel = wDrawList[wi].ModelRef;

            mvPushMatrix();

            var wPosition = convertGCtoNED(wDrawList[wi].Latitude, wDrawList[wi].Longitude, wDrawList[wi].Altitude, iLatitude, iLongitude, iAltitude);
            var wX = wPosition.North;
            var wY = wPosition.East;
            var wZ = wPosition.Down;

            if ((10000 < Math.abs(wX)) || (10000 < Math.abs(wY))) {
                continue;
            }

            mat4.translate(mvMatrix, [wX, wY, wZ]);
            mat4.rotate(mvMatrix, wDrawList[wi].yaw, [0, 0, 1]);
            mat4.rotate(mvMatrix, wDrawList[wi].pitch, [0, 1, 0]);
            mat4.rotate(mvMatrix, wDrawList[wi].roll, [1, 0, 0]);

            var wScale = mat4.create([wDrawList[wi].scale_x, 0, 0, 0, 0, wDrawList[wi].scale_y, 0, 0, 0, 0, wDrawList[wi].scale_z, 0, 0, 0, 0, 1]);

            mat4.multiply(mvMatrix, wScale);

            for (var wj = 0; wj < wModel.BufferList.length; ++wj) {
                gl.bindBuffer(gl.ARRAY_BUFFER, wModel.BufferList[wj].PositionBuffer);
                gl.vertexAttribPointer(getGLShaderProgram().vertexPositionAttribute, wModel.BufferList[wj].PositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, wModel.BufferList[wj].NormalBuffer);
                gl.vertexAttribPointer(getGLShaderProgram().vertexNormalAttribute, wModel.BufferList[wj].NormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, wModel.BufferList[wj].ColorBuffer);
                gl.vertexAttribPointer(getGLShaderProgram().vertexColorAttribute, wModel.BufferList[wj].ColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

                setMatrixUniforms();

                //   0 gl.POINTS To draw a series of points.
                //   1 gl.LINES To draw a series of unconnected line segments (individual lines).
                //   2 gl.LINE_STRIP To draw a series of connected line segments.
                //   3 gl.LINE_LOOP To draw a series of connected line segments. It also joins the first and last vertices to form a loop.
                //   4 gl.TRIANGLES To draw a series of separate triangles.
                //   5 gl.TRIANGLE_STRIP To draw a series of connected triangles in strip fashion.
                //   6 gl.TRIANGLE_FAN To draw a series of connected triangles sharing the first vertex in a fan-like fashion.

                var wEnum = gl.POINTS;
                switch (wModel.BufferList[wj].DrawTypeEnum) {
                    case DrawTypeEnum.POINTS:
                        wEnum = gl.POINTS;
                        break;
                    case DrawTypeEnum.LINES:
                        wEnum = gl.LINES;
                        break;
                    case DrawTypeEnum.LINE_STRIP:
                        wEnum = gl.LINE_STRIP;
                        break;
                    case DrawTypeEnum.LINE_LOOP:
                        wEnum = gl.LINE_LOOP;
                        break;
                    case DrawTypeEnum.TRIANGLES:
                        wEnum = gl.TRIANGLES;
                        break;
                    case DrawTypeEnum.TRIANGLE_STRIP:
                        wEnum = gl.TRIANGLE_STRIP;
                        break;
                    case DrawTypeEnum.TRIANGLE_FAN:
                        wEnum = gl.TRIANGLE_FAN;
                        break;

                }

                gl.drawArrays(wEnum, 0, wModel.BufferList[wj].PositionBuffer.numItems);
            }
            mvPopMatrix();
        }
    }
}

function drawGLAnimationDirectorScene(iAnimationDirector) {

    var wGL = getGL();

    gModelLibrary.updateNewModelIntoGLBuffer(gl);

    //View Point Manipulation
    wGL.viewport(0, 0, wGL.viewportWidth, wGL.viewportHeight);
    wGL.clear(wGL.COLOR_BUFFER_BIT | wGL.DEPTH_BUFFER_BIT);

    mat4.perspective(45, wGL.viewportWidth / wGL.viewportHeight, 0.1, 3000.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.rotate(mvMatrix, Math.PI / 2, [1, 0, 0]);
    mat4.rotate(mvMatrix, -Math.PI / 2, [0, 0, 1]);



    mat4.translate(mvMatrix, [-getGLCameraControl().XOffset, 0.0, 0.0]);


    var lightingDirection = [1.0, 0.0, -1.0];
    var adjustedLD = vec3.create();
    vec3.normalize(lightingDirection, adjustedLD);

    vec3.scale(adjustedLD, -1);

    wGL.uniform3fv(getGLShaderProgram().lightingDirectionUniform, adjustedLD);
    wGL.uniform3f(getGLShaderProgram().directionalColorUniform, 1.0, 1.0, 1.0);
    wGL.uniform3f(getGLShaderProgram().ambientColorUniform, 0.5, 0.5, 0.5);


    var wCameraCenter = iAnimationDirector.getPlaybackFrameCameraCenter();
    
    getGLCameraControl().ViewPointRollOffset  = -getGLCameraControl().RollOffset + wCameraCenter.roll;
    getGLCameraControl().ViewPointPitchOffset = -getGLCameraControl().PitchOffset + wCameraCenter.pitch;
    getGLCameraControl().ViewPointYawOffset   = -getGLCameraControl().YawOffset + wCameraCenter.yaw;


    mat4.rotate(mvMatrix, getGLCameraControl().ViewPointRollOffset  , [1, 0, 0]);
    mat4.rotate(mvMatrix, getGLCameraControl().ViewPointPitchOffset , [0, 1, 0]);
    mat4.rotate(mvMatrix, getGLCameraControl().ViewPointYawOffset   , [0, 0, 1]);

    drawAnimatedFrame(iAnimationDirector.FixedToCameraAnimationFrame, 0.0, 0.0, 0.0);

    mvPushMatrix();

    var wModulation = [wCameraCenter.Latitude, wCameraCenter.Longitude, wCameraCenter.Altitude];
    
    if ((null != iAnimationDirector.ModulatedRate_X) && (0 != iAnimationDirector.ModulatedRate_X)) {
        var wDA = (1/60)*(Math.PI/180);
        var wRatio = wCameraCenter.Latitude / wDA;
        var wRemainder = Math.floor(wRatio);
        wModulation[0] = wDA * wRemainder;
        wModulation[0] = 0;
    }

    if ((null != iAnimationDirector.ModulatedRate_Y) && (0 != iAnimationDirector.ModulatedRate_Y)) {
        var wDA = (1/60)*(Math.PI/180);
        var wRatio = wCameraCenter.Longitude / wDA;
        var wRemainder = Math.floor(wRatio);
        wModulation[1] = wDA * wRemainder;
        wModulation[1] = 0;
    }

    if ((null != iAnimationDirector.ModulatedRate_Z) && (0 != iAnimationDirector.ModulatedRate_Z)) {

        var wAlt = wCameraCenter.Altitude - iAnimationDirector.CameraTerrainElevation;
        if (iAnimationDirector.ModulatedRate_Z < wAlt) {
            wModulation[2] = wCameraCenter.Altitude - iAnimationDirector.ModulatedRate_Z;
        }
        else {
            wModulation[2] = iAnimationDirector.CameraTerrainElevation;
        }
        
    }

   var wPosition = convertGCtoNED(wModulation[0], wModulation[1], wModulation[2], wCameraCenter.Latitude, wCameraCenter.Longitude, wCameraCenter.Altitude);			
    
    if ((null != iAnimationDirector.ModulatedRate_X) && (0 != iAnimationDirector.ModulatedRate_X)) {
    
        var wRatio = wPosition.North / iAnimationDirector.ModulatedRate_X;
        var wRemainder = wRatio - Math.floor(wRatio);
        wModulation[0] = iAnimationDirector.ModulatedRate_X * wRemainder;
    }

    if ((null != iAnimationDirector.ModulatedRate_Y) && (0 != iAnimationDirector.ModulatedRate_Y)) {
    
        var wRatio = wPosition.East / iAnimationDirector.ModulatedRate_Y;
        var wRemainder = wRatio - Math.floor(wRatio);
        wModulation[1] = iAnimationDirector.ModulatedRate_Y * wRemainder;
    }
    
    wModulation[2] = wPosition.Down;
    
    mat4.translate(mvMatrix, wModulation);

    drawAnimatedFrame(iAnimationDirector.FixedToCameraAnimationFrame_Modulated, 0.0,0.0,0.0);

    mvPopMatrix();


    mvPushMatrix();
    
    drawAnimatedFrame(iAnimationDirector.StaticAnimationFrame, wCameraCenter.Latitude, wCameraCenter.Longitude, wCameraCenter.Altitude);

    var wFrame = iAnimationDirector.getPlaybackFrame();

    if (null != wFrame) {
        drawAnimatedFrame(wFrame.SingleFrame, wCameraCenter.Latitude, wCameraCenter.Longitude, wCameraCenter.Altitude);
    }

    iAnimationDirector.applyFunctionToIntegratedFrame(drawAnimatedFrame, 5, wCameraCenter.Latitude, wCameraCenter.Longitude, wCameraCenter.Altitude);

    mvPopMatrix();


}