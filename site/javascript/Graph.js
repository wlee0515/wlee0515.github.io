function Graph () {
    this.renderCanvas = function(iCanvasDOM){
        
        var wCtx = iCanvasDOM.getContext("2d");
        wCtx.strokeStyle = "red";
        var wLine = [[100,0],[0,0],[0,100]];
        drawPolyLine(iCanvasDOM, wLine);
    }
}