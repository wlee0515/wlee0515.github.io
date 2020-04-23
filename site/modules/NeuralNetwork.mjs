import { Matrix } from "./Matrix.mjs";

const ActivationFunction = {
  Direct : {
    Name: "Direct",
    activation : function (iInput) {
      return iInput;
    },

    derivative : function (iInput) {
      return 1;
    }
  },

  Sigmoid : {
    Name: "Sigmoid",
    activation : function (iInput) {
      return 1 / (1 + Math.exp(-iInput));

    },
    derivative : function (iInput) {
      var wValue = 1 / (1 + Math.exp(-iInput));
      return wValue*(1.0-wValue);
    }
  },

  Tanh : {
    Name: "Tanh",
    activation : function (iInput) {
      return Math.tanh(iInput);

    },
    derivative : function (iInput) {
      var wValue = 1/Math.cosh(iInput);
      return wValue*wValue;
    }
  },
  
  ReLU : {
    Name: "ReLU",
    activation : function (iInput) {
      if (iInput > 0.0) return iInput;
      return 0.0;
    },

    derivative : function (iInput) {
      if (iInput > 0.0) return 1;
      return 0.0;
    }
  },
  
  SoftPlus : {
    Name: "SoftPlus",
    activation : function (iInput) {
      return Math.log(1 + Math.exp(iInput));
    },

    derivative : function (iInput) {
      return 1/(1 + Math.exp(-iInput));
    }
  }

}

function Layer(iNodeCount, iActivationFunction = ActivationFunction.Direct) {
  this.NodeCount = iNodeCount;
  
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
      this.BiasList.push(new Matrix(this.LayerDefinition[wi].getSize(), 1, 1));
    }

    for (var wi = 0; wi < this.LayerDefinition.length - 1; ++wi) {
      var wNewMatrix = new Matrix(this.LayerDefinition[wi + 1].getSize(), this.LayerDefinition[wi].getSize(), 0);
      wNewMatrix.setRandom(-1, 2);
      this.WeightMatrixList.push(wNewMatrix);
    }

  }

  this.processInput = function (iInputVector) {

    this.ZList[0].setColumn(0, iInputVector);
    this.ZList[0].add(this.BiasList[0]);
    this.LayerList[0].copy(this.ZList[0]);
    this.LayerList[0].applyFunctionToCell(this.LayerDefinition[0].getActivationFunction().activation);
    for (var wi = 0; wi < this.WeightMatrixList.length; ++wi) {
      this.ZList[wi+1] = this.WeightMatrixList[wi].getMultiply(this.LayerList[wi]);    
      this.ZList[wi+1].add(this.BiasList[wi + 1]);
      this.LayerList[wi + 1].copy(this.ZList[wi + 1]);
      this.LayerList[wi+1].applyFunctionToCell(this.LayerDefinition[wi + 1].getActivationFunction().activation);
    }

    var wOutputZ = this.ZList[this.LayerList.length-1].getColumn(0);
    var wOutputNorm = this.LayerList[this.LayerList.length-1].getColumn(0);

    var wReturnRaw = [];
    var wReturnNorm = [];
    for(var wi = 0; wi < wOutputNorm.length; ++wi){
      wReturnRaw.push(wOutputZ[wi]);
      wReturnNorm.push(wOutputNorm[wi]);
    }

    return {
      raw : wReturnRaw,
      activation : wReturnNorm
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
    wDeltaList[wEndIndex].setColumn(0,iOutputVector);
    wDeltaList[wEndIndex].applyFunctionToCell(this.LayerDefinition[wEndIndex].getActivationFunction().activation);
    wDeltaList[wEndIndex].subtract(this.LayerList[wEndIndex]);
    wDeltaList[wEndIndex].Schur_product(wZSlopList[wEndIndex])

    for (var wi = wEndIndex - 1; wi >= 0; --wi) {
      var wWeightTranspose = this.WeightMatrixList[wi].getTranspose();
      wDeltaList[wi] = wWeightTranspose.getMultiply(wDeltaList[wi+1]);  
      wDeltaList[wi].Schur_product(wZSlopList[wi]);
    }

    var wOutput = this.LayerList[this.LayerList.length-1].getColumn(0);

    for(var wi = 0; wi < this.WeightMatrixList.length; ++wi){
      var wTransposeVec = this.LayerList[wi].getTranspose()
      var wWeitghtIncrement = wDeltaList[wi+1].getMultiply(wTransposeVec);
      wWeitghtIncrement.scale(iLearningRate);
      this.WeightMatrixList[wi].add(wWeitghtIncrement);
    }

    for(var wi = 0; wi < this.BiasList.length; ++wi){
      wDeltaList[wi].scale(iLearningRate);
      this.BiasList[wi].add(wDeltaList[wi]);
    }

    return this.processInput(iInputVector);
  }
}


function PrintNeuralNetworkToString( iNeuralNetwork) {

  var wNNLayers = iNeuralNetwork.LayerList;
  var wNNBias = iNeuralNetwork.BiasList;
  var wNNWeights = iNeuralNetwork.WeightMatrixList;

  var wRtrStr = "Layer [0] \n";
  wRtrStr += wNNLayers[0].printToString()
  wRtrStr +="\n";
  wRtrStr += "Bias [0] \n";
  wRtrStr += wNNBias[0].printToString()
  for(var wi = 0; wi < wNNWeights.length; ++wi) {
    wRtrStr +="\n";
    wRtrStr += "Weights [" + wi + "] \n";
    wRtrStr += wNNWeights[wi].printToString();
    wRtrStr +="\n";
    wRtrStr += "Layer [" + (wi+1) + "] \n";
    wRtrStr += wNNLayers[wi+1].printToString();
    wRtrStr +="\n";
    wRtrStr += "Bias [" + (wi+1) + "] \n";
    wRtrStr += wNNBias[wi+1].printToString();
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
      var iXY = {
        x: wLayerX,
        y: wNodeY,
        state : wNNLayers[wi].get(wj,0),
        bias : wNNLBias[wi].get(wj,0)
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
      for(var wk=0; wk < wColumn.length;++wk) {
        var wEndLocation = wNodeLocationArray[wi+1][wk];

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
      iCtx.arc(wNodeLocationArray[wi][wj].x + iNodeRadius, wNodeLocationArray[wi][wj].y + iNodeRadius, iNodeRadius/2, 0, 2 * Math.PI);
      iCtx.fill();
      iCtx.globalAlpha = 1.0;
      iCtx.stroke();
    }
  }



  iCtx.fillStyle = wOriginalColorFill;
  iCtx.strokeStyle = wOriginalColorStroke;
  iCtx.lineWidth = wOriginalLineWidth;

  iCtx.globalAlpha = 1.0;
}

export {
  ActivationFunction,
  Layer,
  NeuralNetwork,
  DrawNeuralNetwork,
  PrintNeuralNetworkToString
}