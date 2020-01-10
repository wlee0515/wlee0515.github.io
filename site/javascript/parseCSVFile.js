function parseCSVtoDataset(iCSVFileString, iHasHeader = true) {
  if ("" == iCSVFileString) {
    return [];
  }

  var wLines = iCSVFileString.split('\n');

  if (2 >= wLines.length) {
    return [];
  }

  var wDataSet = [];

  var wFirstLine = wLines[0].split(',');
  var wSecondLine = wLines[1].split(',');

  var wDataLength = iHasHeader ? wLines.length - 1 : wLines.length;

  for (var wi = 0; wi < wFirstLine.length; ++wi) {
    var wName = "Data_" + wi;
    if (true == iHasHeader) wName = wFirstLine[wi];
    var wValue = Number(wSecondLine[wi]);
    var wDataType = "string";
    if (false == isNaN(wValue)) wDataType = "number";

    wDataSet.push({ 
      mName: wName,
      mDataType: wDataType,
      mData: ("number" == wDataType) ? new Float64Array(wDataLength) : new Array(wDataLength),
     });
  }

  var wStartIndex = 0;
  if (true == iHasHeader) wStartIndex = 1;

  for (var wi = wStartIndex; wi < wLines.length; ++wi) {
    var wRow = wLines[wi].split(',');

    for (var wj = 0; wj < wDataSet.length; ++wj) {
      if (wj < wRow.length) {
        var wValue = wRow[wj];
        if ("number" == wDataSet[wj].mDataType) {
          wValue = Number(wValue);
        }
        wDataSet[wj].mData[wi - wStartIndex] = wValue;
      }
      else {
        var wValue = "NA";
        if ("number" == wDataSet[wj].mDataType) {
          wValue = 0;
        }
        wDataSet[wj].mData[wi - wStartIndex] = wValue;
      }
    }
  }

  return wDataSet
}