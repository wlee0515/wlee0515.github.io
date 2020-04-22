import { Matrix } from "./Matrix.mjs";

function sigmoid(iInput) {
  return 1 / (1 + Math.exp(-iInput));
}

function sigmoidDerivative(iInput) {
  var wValue = sigmoid(iInput);
  return wValue*(1.0-wValue);
}

function NeuralNetwork(iLayerSizeList = []) {
  this.LayerList = [];
  this.WeightMatrixList = [];

  {
    for (var wi = 0; wi < iLayerSizeList.length; ++wi) {
      this.LayerList.push(new Matrix(iLayerSizeList[wi], 1, 0));
    }

    for (var wi = 0; wi < iLayerSizeList.length - 1; ++wi) {
      var wNewMatrix = new Matrix(iLayerSizeList[wi + 1], iLayerSizeList[wi], 0);
      wNewMatrix.setRandom(-1, 2);
      this.WeightMatrixList.push(wNewMatrix);
    }

  }

  this.processInput = function (iInputVector) {

    this.LayerList[0].setColumn(0, iInputVector);
    this.LayerList[0].applyFunctionToCell(sigmoid);
    for (var wi = 0; wi < this.WeightMatrixList.length; ++wi) {
      this.LayerList[wi+1] = this.WeightMatrixList[wi].getMultiply(this.LayerList[wi]);
      this.LayerList[wi+1].applyFunctionToCell(sigmoid);
    }

    var wOutput = this.LayerList[this.LayerList.length-1].getColumn(0);

    var wReturn = [];
    for(var wi = 0; wi < wOutput.length; ++wi){
      wReturn.push(wOutput[wi]);
    }

    return wReturn;
  }
}

function DrawNeuralNetwork(iCtx, iNeuralNetwork, iNodeRadius, iNodeSpacing, iLayerSpacing, iPositiveColor, iNegativeColor) {

  var wOriginalColorFill = iCtx.fillStyle;
  var wOriginalColorStroke = iCtx.strokeStyle;
  var wOriginalLineWidth = iCtx.lineWidth;

  var wNNLayers = iNeuralNetwork.LayerList;
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
        state : wNNLayers[wi].get(wj,0)
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
    }
  }

  iCtx.fillStyle = wOriginalColorFill;
  iCtx.strokeStyle = wOriginalColorStroke;
  iCtx.lineWidth = wOriginalLineWidth;

  iCtx.globalAlpha = 1.0;
}

export {
  NeuralNetwork,
  DrawNeuralNetwork
}