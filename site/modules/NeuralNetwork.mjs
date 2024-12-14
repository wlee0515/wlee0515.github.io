import { Matrix } from "./Matrix.mjs";

const ActivationFunction = {
  Direct: {
    Name: "Direct",
    activation: function (iInput) {
      return iInput;
    },
    derivative: function (iInput) {
      return 1;
    }
  },

  Sigmoid: {
    Name: "Sigmoid",
    activation: function (iInput) {
      return 1 / (1 + Math.exp(-iInput));
    },
    derivative: function (iInput) {
      var wValue = 1 / (1 + Math.exp(-iInput));
      return wValue * (1.0 - wValue);
    }
  },

  Tanh: {
    Name: "Tanh",
    activation: function (iInput) {
      return Math.tanh(iInput);
    },
    derivative: function (iInput) {
      var wValue = 1 / Math.cosh(iInput);
      return wValue * wValue;
    }
  },

  ReLU: {
    Name: "ReLU",
    activation: function (iInput) {
      if (iInput > 0.0) return iInput;
      return 0.0;
    },
    derivative: function (iInput) {
      if (iInput > 0.0) return 1;
      return 0.0;
    }
  },

  LeakyReLU: {
    Name: "LeakyReLU",
    activation: function (iInput) {
      if (iInput > 0.0) return iInput;
      return 0.1 * iInput;
    },
    derivative: function (iInput) {
      if (iInput > 0.0) return 1;
      return 0.1;
    }
  },

  SoftPlus: {
    Name: "SoftPlus",
    activation: function (iInput) {
      return Math.log(1 + Math.exp(iInput));
    },
    derivative: function (iInput) {
      return 1 / (1 + Math.exp(-iInput));
    }
  }

}

function Layer(iNodeCount, iActivationFunction = ActivationFunction.Direct, iHasBias = true) {
  this.NodeCount = iNodeCount;
  this.HasBias = iHasBias;

  this.ActivationFunction = iActivationFunction;
  if (null == this.ActivationFunction) {
    this.ActivationFunction = ActivationFunction.Direct;
  }

  this.getSize = function () {
    return this.NodeCount;
  }

  this.getActivationFunction = function () {
    return this.ActivationFunction;
  }
  
  this.getHasBias = function () {
    return this.HasBias;
  }

}

function NeuralNetwork(iLayerSizeList = []) {

  this.LayerDefinition = iLayerSizeList;
  this.LayerList = [];
  this.ZList = [];
  this.BiasList = [];
  this.WeightMatrixList = [];

  {
    for (var wi = 0; wi < this.LayerDefinition.length; ++wi) {
      this.LayerList.push(new Matrix(this.LayerDefinition[wi].getSize(), 1, 0));
      this.ZList.push(new Matrix(this.LayerDefinition[wi].getSize(), 1, 0));
      if(this.LayerDefinition[wi].getHasBias()){
        this.BiasList.push(new Matrix(this.LayerDefinition[wi].getSize(), 1, 1));
      }
      else {
        this.BiasList.push(null);
      }
    }

    for (var wi = 0; wi < this.LayerDefinition.length - 1; ++wi) {
      var wNewMatrix = new Matrix(this.LayerDefinition[wi + 1].getSize(), this.LayerDefinition[wi].getSize(), 0);
      wNewMatrix.setRandom(-1, 2);
      this.WeightMatrixList.push(wNewMatrix);
    }

  }

  this.processInput = function (iInputVector) {

    this.ZList[0].setColumn(0, iInputVector);
    if (null != this.BiasList[wi + 1]) {
      this.ZList[0].add(this.BiasList[0]);
    }
    this.LayerList[0].copy(this.ZList[0]);
    this.LayerList[0].applyFunctionToCell(this.LayerDefinition[0].getActivationFunction().activation);
    for (var wi = 0; wi < this.WeightMatrixList.length; ++wi) {
      this.ZList[wi + 1] = this.WeightMatrixList[wi].getMultiply(this.LayerList[wi]);
      if (null != this.BiasList[wi + 1]) {
        this.ZList[wi + 1].add(this.BiasList[wi + 1]);
      }
      this.LayerList[wi + 1].copy(this.ZList[wi + 1]);
      this.LayerList[wi + 1].applyFunctionToCell(this.LayerDefinition[wi + 1].getActivationFunction().activation);
    }

    var wOutputZ = this.ZList[this.LayerList.length - 1].getColumn(0);
    var wOutputNorm = this.LayerList[this.LayerList.length - 1].getColumn(0);

    var wReturnRaw = [];
    var wReturnNorm = [];
    for (var wi = 0; wi < wOutputNorm.length; ++wi) {
      wReturnRaw.push(wOutputZ[wi]);
      wReturnNorm.push(wOutputNorm[wi]);
    }

    return {
      raw: wReturnRaw,
      activation: wReturnNorm
    }
  }

  this.trainPair = function (iInputVector, iOutputVector, iLearningRate) {

    this.processInput(iInputVector);

    var wDeltaList = [];
    var wZSlopList = [];
    for (var wi = 0; wi < this.LayerList.length; ++wi) {
      wDeltaList.push(this.LayerList[wi].getCopy());
      wZSlopList.push(this.ZList[wi].getCopy());
      wZSlopList[wi].applyFunctionToCell(this.LayerDefinition[wi].getActivationFunction().derivative);
    }

    var wEndIndex = this.LayerList.length - 1;
    wDeltaList[wEndIndex].setColumn(0, iOutputVector);
    wDeltaList[wEndIndex].applyFunctionToCell(this.LayerDefinition[wEndIndex].getActivationFunction().activation);
    wDeltaList[wEndIndex].subtract(this.LayerList[wEndIndex]);
    wDeltaList[wEndIndex].Schur_product(wZSlopList[wEndIndex])

    for (var wi = wEndIndex - 1; wi >= 0; --wi) {
      var wWeightTranspose = this.WeightMatrixList[wi].getTranspose();
      wDeltaList[wi] = wWeightTranspose.getMultiply(wDeltaList[wi + 1]);
      wDeltaList[wi].Schur_product(wZSlopList[wi]);
    }

    var wOutput = this.LayerList[this.LayerList.length - 1].getColumn(0);

    for (var wi = 0; wi < this.WeightMatrixList.length; ++wi) {
      var wTransposeVec = this.LayerList[wi].getTranspose()
      var wWeitghtIncrement = wDeltaList[wi + 1].getMultiply(wTransposeVec);
      wWeitghtIncrement.scale(iLearningRate);
      this.WeightMatrixList[wi].add(wWeitghtIncrement);
    }

    for (var wi = 0; wi < this.BiasList.length; ++wi) {
      
      if (null != this.BiasList[wi]) {
        wDeltaList[wi].scale(iLearningRate);
        this.BiasList[wi].add(wDeltaList[wi]);
      }
    }

    return this.processInput(iInputVector);
  }
}


function PrintNeuralNetworkToString(iNeuralNetwork) {

  var wNNLayers = iNeuralNetwork.LayerList;
  var wNNBias = iNeuralNetwork.BiasList;
  var wNNWeights = iNeuralNetwork.WeightMatrixList;

  var wRtrStr = "Layer [0] \n";
  wRtrStr += wNNLayers[0].printToString()
  wRtrStr += "\n";
  if (null != wNNBias[0]) {
    wRtrStr += "Bias [0] \n";
    wRtrStr += wNNBias[0].printToString()  
  }
  for (var wi = 0; wi < wNNWeights.length; ++wi) {
    wRtrStr += "\n";
    wRtrStr += "Weights [" + wi + "] \n";
    wRtrStr += wNNWeights[wi].printToString();
    wRtrStr += "\n";
    wRtrStr += "Layer [" + (wi + 1) + "] \n";
    wRtrStr += wNNLayers[wi + 1].printToString();
    wRtrStr += "\n";
    if (null != wNNBias[0]) {
      wRtrStr += "Bias [" + (wi + 1) + "] \n";
      wRtrStr += wNNBias[wi + 1].printToString();
    }
  }
  return wRtrStr;
}


function DrawNeuralNetwork(iCtx, iNeuralNetwork, iNodeRadius, iNodeSpacing, iLayerSpacing, iPositiveColor, iNegativeColor) {

  var wOriginalColorFill = iCtx.fillStyle;
  var wOriginalColorStroke = iCtx.strokeStyle;
  var wOriginalLineWidth = iCtx.lineWidth;

  var wNNLayers = iNeuralNetwork.LayerList;
  var wNNLBias = iNeuralNetwork.BiasList;
  var wDisplayStartX = -((wNNLayers.length - 1) * iLayerSpacing) / 2

  var wNodeLocationArray = [];

  //Calculate Node Location
  for (var wi = 0; wi < wNNLayers.length; ++wi) {
    var wShape = wNNLayers[wi].getShape();
    var wLayerX = wDisplayStartX + wi * iLayerSpacing;

    var wDisplayStartY = -((wShape.rows - 1) * iNodeSpacing) / 2

    var wNewNodeLayer = [];
    for (var wj = 0; wj < wShape.rows; ++wj) {
      var wNodeY = wDisplayStartY + wj * iNodeSpacing;
      var wBias = null;
      if (null != wNNLBias[wi]) {
        wBias = wNNLBias[wi];
      }
      var iXY = {
        x: wLayerX,
        y: wNodeY,
        state: wNNLayers[wi].get(wj, 0),
        bias: wBias
      };
      wNewNodeLayer.push(iXY)
    }

    wNodeLocationArray.push(wNewNodeLayer);
  }

  //Draw Contact

  var wNNWeights = iNeuralNetwork.WeightMatrixList;
  for (var wi = 0; wi < wNNWeights.length; ++wi) {
    var wShape = wNNWeights[wi].getShape();
    for (var wj = 0; wj < wShape.columns; ++wj) {
      var wStartLocation = wNodeLocationArray[wi][wj];

      var wColumn = wNNWeights[wi].getColumn(wj);
      for (var wk = 0; wk < wColumn.length; ++wk) {
        var wEndLocation = wNodeLocationArray[wi + 1][wk];

        if (wColumn[wk] < 0) {
          iCtx.fillStyle = iNegativeColor;
          iCtx.strokeStyle = iNegativeColor;
        }
        else {
          iCtx.fillStyle = iPositiveColor;
          iCtx.strokeStyle = iPositiveColor;
        }

        iCtx.globalAlpha = Math.abs(wStartLocation.state);
        iCtx.beginPath();
        iCtx.lineWidth = Math.abs(wColumn[wk]) * wOriginalLineWidth;
        iCtx.moveTo(wStartLocation.x, wStartLocation.y);
        iCtx.lineTo(wEndLocation.x, wEndLocation.y);
        iCtx.stroke();
      }
    }
  }


  //Draw Node
  for (var wi = 0; wi < wNodeLocationArray.length; ++wi) {
    for (var wj = 0; wj < wNodeLocationArray[wi].length; ++wj) {

      if (wNodeLocationArray[wi][wj].state < 0) {
        iCtx.fillStyle = iNegativeColor;
        iCtx.strokeStyle = iNegativeColor;
      }
      else {
        iCtx.fillStyle = iPositiveColor;
        iCtx.strokeStyle = iPositiveColor;
      }

      iCtx.globalAlpha = Math.abs(wNodeLocationArray[wi][wj].state);
      iCtx.beginPath();
      iCtx.lineWidth = wOriginalLineWidth;
      iCtx.arc(wNodeLocationArray[wi][wj].x, wNodeLocationArray[wi][wj].y, iNodeRadius, 0, 2 * Math.PI);
      iCtx.fill();
      iCtx.globalAlpha = 1.0;
      iCtx.stroke();

      if (null != wNodeLocationArray[wi][wj].bias){
        if (wNodeLocationArray[wi][wj].bias < 0) {
          iCtx.fillStyle = iNegativeColor;
          iCtx.strokeStyle = iNegativeColor;
        }
        else {
          iCtx.fillStyle = iPositiveColor;
          iCtx.strokeStyle = iPositiveColor;
        }
  
        iCtx.globalAlpha = Math.abs(wNodeLocationArray[wi][wj].bias);
        iCtx.beginPath();
        iCtx.lineWidth = wOriginalLineWidth;
        iCtx.arc(wNodeLocationArray[wi][wj].x + iNodeRadius, wNodeLocationArray[wi][wj].y + iNodeRadius, iNodeRadius / 2, 0, 2 * Math.PI);
        iCtx.fill();
        iCtx.globalAlpha = 1.0;
        iCtx.stroke();
  
      }
    }
  }

  iCtx.fillStyle = wOriginalColorFill;
  iCtx.strokeStyle = wOriginalColorStroke;
  iCtx.lineWidth = wOriginalLineWidth;

  iCtx.globalAlpha = 1.0;
}


/*------------------------------------------------*/

function createTensor(iWidth, iHeight, iDepth) {
  var wFloatDataArray = new Float64Array(iWidth*iHeight*iDepth);
  return {
    width : iWidth,
    height : iHeight,
    depth : iDepth,
    data : wFloatDataArray
  }
}

function getTensorData_XY(iTensor, iX, iY) {
  if (( iX < 0) || (iY < 0)) {
    alert("[getTensorData_XY] input x and y cannot be negative");
    return null;
  }
  if ( iX > iTensor.width) {
    alert("[getTensorData_XY] input x is greater than [iTensor.width]");
    return null;
  }
  if ( iY > iTensor.height) {
    alert("[getTensorData_XY] input y is greater than [iTensor.height]");
    return null;
  }
  
  var wFloatDataArray = new Float64Array(iTensor.depth);
  var wIndex = (iY* iTensor.width  + iX )*iTensor.depth;
  for (var wi = 0; wi < iTensor.depth; ++wi) {
    wFloatDataArray[wi] = iTensor.data[wi + wIndex];
  }

  return wFloatDataArray;
}

function getTensorData_XYZ(iTensor, iX, iY, iZ) {
  if (( iX < 0) || (iY < 0) || (iZ < 0)) {
    alert("[getTensorData_XYZ] input x, y and Z cannot be negative");
    return null;
  }
  if ( iX > iTensor.width) {
    alert("[getTensorData_XYZ] input x is greater than [iTensor.width]");
    return null;
  }
  if ( iY > iTensor.height) {
    alert("[getTensorData_XYZ] input y is greater than [iTensor.height]");
    return null;
  }
  if ( iZ > iTensor.depth) {
    alert("[getTensorData_XYZ] input z is greater than [iTensor.depth]");
    return null;
  }
  
  return iTensor.data[(iY* iTensor.width  + iX )*iTensor.depth + iZ];
}

function extractCanvasTensor(iCanvas) {

  var wCtx = iCanvas.getContext("2d");
  var wWidth = iCanvas.width;
  var wHeight = iCanvas.height;

  var wImage = wCtx.getImageData(0,0,wWidth,wHeight);

  var wImageData = wImage.data;

  var wTensor = createTensor(wWidth , wHeight, 3);

  // iterate over all pixels
  var wLength = wImageData.length;
  for(var wi = 0, wj = 0; wi < wLength; wi += 4, wj += 3) {
    wTensor.data[wj] = wImageData[wi];
    wTensor.data[wj + 1] = wImageData[wi + 1];
    wTensor.data[wj + 2] = wImageData[wi + 2];
  }

  return wTensor;
}

function drawTensorLayerToCanvas(iTensor, iLayerIndex, iMin, iMax, iCanvas) {
  
  if (iLayerIndex < 0) {
    alert("[drawTensorLayerToCanvas] iLayerIndex cannot be less than 0")
    return;
  }
  
  if (iLayerIndex >= iTensor.depth) {
    alert("[drawTensorLayerToCanvas] iLayerIndex cannot be greater or equal to Tensor.depth of [" + iTensor.depth + "]")
    return;
  }

  var wCtx = iCanvas.getContext("2d");
  var wImage = wCtx.createImageData(iTensor.width, iTensor.height);
  var wImageData = wImage.data;
  var wLength = wImageData.length;
  var wScale = 255/(iMax - iMin);
  var wValue = 0;
  for(var wi = 0, wj = 0; wi < wLength; wi += 4, wj += iTensor.depth) {
    wValue = iTensor.data[wj + iLayerIndex];
    //wValue = wValue > iMax ? iMax : wValue < iMin ? iMin : wValue;
    wValue = Math.round(wScale*wValue)
    wImageData[wi+0] = wValue;
    wImageData[wi+1] = wValue;
    wImageData[wi+2] = wValue;
    wImageData[wi+3] = 255;
  }

  wCtx.putImageData(wImage, 0, 0);
}

function convolutionalLayer(iInputTensorDepth, iOutputFilterCount, iActivationFunction = ActivationFunction.Direct) {

  this.KernelWidth = 3;
  this.KernelHeight = 3;
  this.KernelDepth = iInputTensorDepth;
  this.NeralNetworkList = [];
  {
    for(var wi = 0; wi < iOutputFilterCount; ++wi){
      this.NeralNetworkList.push(
        new NeuralNetwork([ new Layer(this.KernelDepth*this.KernelHeight*this.KernelHeight, ActivationFunction.Direct)
          , new Layer(1, iActivationFunction)])
      )
    }
  }

  this.processInput = function (iInputTensor) {
    if (iInputTensor.depth != this.KernelDepth) {
      alert("[convolutionalLayer.processInput] input Layer Depth needs to be [" + this.KernelDepth + "]")
      return 0;
    }

    
    var wX0 = Math.floor(this.KernelWidth/2);
    var wXN = iInputTensor.width - wX0;
    
    var wY0 = Math.floor(this.KernelHeight/2);
    var wYN = iInputTensor.width - wY0;
    
    for(var wi = wX0; wi < wXN; ++wi ){
      for(var wj = wX0; wj < wYN; ++wj ){
        var wIndex = (wj* iTensor.width  + wi )*iTensor.depth;

      }
    }
  }

  this.trainPair = function (iInputTensor, iOutputTensor, iLearningRate) {
  }
}
/*------------------------------------------------*/

export {
  ActivationFunction,
  Layer,
  NeuralNetwork,
  DrawNeuralNetwork,
  PrintNeuralNetworkToString,
  
  createTensor,
  getTensorData_XY,
  getTensorData_XYZ,
  extractCanvasTensor,
  drawTensorLayerToCanvas
}