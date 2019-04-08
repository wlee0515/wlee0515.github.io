<!--

function matrix(iRow=0, iColumn=0, iInit = 0) {
  this.rows = iRow;
  this.columns = iColumn;
  this.data = [];
  for(var i = 0; i < iColumn; ++i){
    var wColumn = [];
    for(var k = 0; k < iRow; ++k){
      wColumn.push(iInit);
    }
    this.data.push(wColumn);
  }
  
  this.get = function(iRow, iColumn) {
    return this.data[iColumn][iRow];
  }
  
  this.getColumn = function(iColumn) {
    if ((iColumn < 0) || (iColumn >= this.columns)){
      alert("Error: 'matrix.getColumn' -> column our of range");
      return null;
    }
    return this.data[iColumn];
  }
  
  this.set = function(iRow, iColumn, iValue) {
    if ((iRow < this.rows) && (iColumn < this.columns)) {
      if ((iRow >= 0) && (iColumn >=0)) {
        this.data[iColumn][iRow] = iValue;
      }
    }
  }
  
  this.setColumn = function( iColumn, iValue) {
    if ((iColumn < 0) || (iColumn >= this.columns)){
      alert("Error: 'matrix.setColumn' -> column our of range");
      return null;
    }
    if (iValue.length != this.rows) {
      alert("Error: 'matrix.setColumn' -> 'iValue' length not equal to matrix rows");
    }
    if ( iColumn < this.columns) {
      if (iColumn >=0) {
        for (var i  = 0; i < iValue.length; ++i){
          this.data[iColumn][i] = iValue[i];          
        }
      }
    }
  }
  
  this.addRow = function(iCount) {
    this.rows += iCount;
    for(var i = 0; i < this.columns ; ++i){
      for(var k = 0; k < iCount; ++k){
         this.data[i].push(0);
      }
      this.data.push(wColumn);
    }
  }
  
  this.addColumn = function(iCount) {
    this.columns += iCount;
    for(var i = 0; i < iCount ; ++i){
      var wColumn = [];
      for(var k = 0; k < this.rows; ++k){
        wColumn.push(0);
      }
      this.data.push(wColumn);
    }
  }

  this.copy = function (iMat) {
    this.rows = iMat.rows;
    this.columns = iMat.columns;
    this.data = [];
    for(var i = 0; i < this.columns ; ++i){
      var wColumn = [];
      for(var k = 0; k < this.rows; ++k){
        wColumn.push(iMat.data[i][k]);
      }
      this.data.push(wColumn);
    }
  }
  
  this.getCopy = function () {
    var wNewMat = new matrix(0, 0, 0);
    wNewMat.copy(this);
    return wNewMat;
  }
  
  this.applyFunctionToCell = function (iFunction) {
    for(var i = 0; i < this.columns; ++i){
      for(var k = 0; k < this.rows; ++k){
         this.data[i][k] = iFunction(this.data[i][k]);
      }
    }
  }
  
  this.scale = function (iScaler) {
    for(var i = 0; i < this.columns; ++i){
      for(var k = 0; k < this.rows; ++k){
         this.data[i][k] *= iScaler;
      }
    }
  }
  
  this.getScaled = function (iScaler) {
    var wTemp = this.getCopy();
    wTemp.scale(iScaler);
    return wTemp;
  }
  
  this.add = function (iMat) {
    if (iMat.rows != this.rows) {
      alert("Error: 'matrix.add' -> row count mismatch");
    }
    if (iMat.columns != this.columns) {
      alert("Error: 'matrix.add' -> column count mismatch");
    }    
    for(var i = 0; i < this.columns; ++i){
      for(var k = 0; k < this.rows; ++k){
         this.data[i][k] += iMat.data[i][k];
      }
    }
  }
  
  this.getAddition = function (iMat) {
    var wTemp = this.getCopy();
    wTemp.add(iMat);
    return wTemp;
  }
  
  this.subtract = function (iMat) {
    if (iMat.rows != this.rows) {
      alert("Error: 'matrix.subtract' -> row count mismatch");
    }
    if (iMat.columns != this.columns) {
      alert("Error: 'matrix.subtract' -> column count mismatch");
    }
    for(var i = 0; i < this.columns; ++i){
      for(var k = 0; k < this.rows; ++k){
         this.data[i][k] -= iMat.data[i][k];
      }
    }
  }
  
  this.getSubtraction = function (iMat) {
    var wTemp = this.getCopy();
    wTemp.subtract(iMat);
    return wTemp;
  }
  
  this.Hadamard_product = function (iMat) {
    if (iMat.rows != this.rows) {
      alert("Error: 'matrix.Hadamard_product' -> row count mismatch");
    }
    if (iMat.columns != this.columns) {
      alert("Error: 'matrix.Hadamard_product' -> column count mismatch");
    }
    for(var i = 0; i < this.columns; ++i){
      for(var k = 0; k < this.rows; ++k){
         this.data[i][k] *= iMat.data[i][k];
      }
    }
  }
  
  this.getHadamard_product = function (iMat) {
    var wTemp = this.getCopy();
    wTemp.Hadamard_product(iMat);
    return wTemp;
  }
  
  this.getMultiply = function (iMat) {
    if (iMat.rows != this.columns) {
      alert("Error: 'matrix.getMultiply' -> size mismatch");
    }

    var wNewMat = new matrix(this.rows, iMat.columns, 0);
    for(var i = 0; i < this.rows; ++i){
      for(var j = 0; j < iMat.columns; ++j){
        var integrator = 0.0;
        for(var k = 0; k < this.columns; ++k){
          integrator += this.data[k][i] * iMat.data[j][k];
        }
        wNewMat.data[j][i] = integrator;
      }
    }
    return wNewMat;
  }
  
  this.getTranspose = function() {
    var wNewMat = new matrix(this.columns, this.rows, 0);
    for(var i = 0; i < this.rows; ++i){
      for(var j = 0; j < this.columns; ++j){
        wNewMat.data[i][j] = this.data[j][i];
      }
    }
    return wNewMat;
  }
  
  this.dotColumn = function (iMat) {
    if (iMat.rows != this.rows) {
      alert("Error: 'matrix.dotColumn' -> row count mismatch");
    }
    if (iMat.columns != this.columns) {
      alert("Error: 'matrix.dotColumn' -> column count mismatch");
    }
    var wMat = new matrix(1, this.columns, 0);
    for(var i = 0; i < this.columns; ++i){
      var wIntegrator = 0;
      for(var k = 0; k < this.rows; ++k){
         wIntegrator += this.data[i][k]*iMat.data[i][k];
      }
      wMat.data[i][0] = wIntegrator;
    }
    return wMat;
  }
}

function applyColumnCalculation(iFunction, iMatrix) {
    var wNewMat = new matrix( 1, iMatrix.columns, 0);
    for(var i = 0; i < iMatrix.columns; ++i){
      wNewMat.data[i][0] = iFunction(iMatrix.data[i]);
    }
    return wNewMat;
}


function useMatrixAsArg2(iFunction, iMatArg1, iMatArg2) {
    if (iMatArg1.rows != iMatArg2.rows) {
      alert("Error: 'matrix.useMatrixAsArg2' -> row count mismatch");
    }
    if (iMatArg1.columns != iMatArg2.columns) {
      alert("Error: 'matrix.useMatrixAsArg2' -> column count mismatch");
    }
    
    var wNewMat = new matrix( iMatArg1.rows, iMatArg1.columns, 0);
    for(var i = 0; i < iMatArg1.columns; ++i){
      for(var k = 0; k < iMatArg1.rows; ++k){
        wNewMat.data[i][k] = iFunction( iMatArg1.data[i][k],  iMatArg2.data[i][k]);
      }
    }
    return wNewMat;
}

-->