<!--

function Maze(iWidth, iHeight)
{
    this.HOLE = 0;
    this.TILE = 1;
    this.END = 2;
    this.START = 3;
    this.HIGHLIGHT = 4;

    this.reset = function()
    {
        this.mMazeWidth = iWidth;
        this.mMazeHeight = iHeight;

        this.mMazeArray = [];

        var wMazeLength = iWidth* iHeight;
        for(var i = 0; i <  wMazeLength; ++i)
        {
            this.mMazeArray.push(1);
        }
        
        this.mMazeStartIndex = 0;
        this.mMazeEndIndex = wMazeLength - 1;

        this.mMazeArray[this.mMazeStartIndex ] = this.START ;
        this.mMazeArray[this.mMazeEndIndex ] = this.END;

        this.cellDrawFunction = null;
    }

    
    this.getMazeIndex = function(x, y) {
        return y * iWidth + x;
    }

    this.getMazeCoordinate = function(iIndex) {
        return {
            x: iIndex % iWidth,
            y: Math.floor(iIndex / iWidth)
        };
    }

    this.toggleMazeIndex = function(iIndex) {
        if(iIndex < this.mMazeArray.length)
        {
            this.mMazeArray[iIndex]++;
            this.mMazeArray[iIndex] %= 2;
        }
    }

    this.toggleMazeCoordinate = function(iX, iY) {
        var wIndex = this.getMazeIndex(iX, iY);
        this.toggleMazeIndex(wIndex);
    }
    
    this.generateRandomMaze = function() {
        for(var i = 0; i <  this.mMazeArray.length; ++i)
        {
            if(Math.random() >0.25)
            {
                this.mMazeArray[i] = this.TILE;
            }
            else
            {
                this.mMazeArray[i] = this.HOLE;
            }
        }
        
        this.mMazeStartIndex = 0;
        this.mMazeEndIndex = this.mMazeArray.length - 1;
        
        this.mMazeArray[this.mMazeStartIndex ] = this.START ;
        this.mMazeArray[this.mMazeEndIndex ] = this.END;

    }
    
    this.draw = function(iDOM) {
        var wCtx = iDOM.getContext("2d");
        var wCanvasHeight = iDOM.height;
        var wCanvasWidth = iDOM.width;
        wCtx.clearRect(0, 0, wCanvasWidth, wCanvasHeight);
        var wCellHeight = wCanvasHeight / iHeight;
        var wCellWidth = wCanvasWidth / iWidth;

        var wBoxHeight = 0.9*(wCellHeight);
        var wBoxWidth = 0.9*(wCellWidth);

        for (var i = 0; i < this.mMazeArray.length ; ++i) {

            if (this.HOLE != this.mMazeArray[i]) {
                var wCoordinate = this.getMazeCoordinate(i)
                var wCellHeightCenter = (0.5 + wCoordinate.y) * wCellHeight;
                var wCellWidthCenter = (0.5 + wCoordinate.x) * wCellWidth;
                wCtx.translate(wCellWidthCenter, wCellHeightCenter);


                wCtx.beginPath();
                wCtx.lineWidth = 2;
                wCtx.strokeStyle = "blue";
                if (this.START == this.mMazeArray[i]) {
                    wCtx.fillStyle = "red";
                }
                else if (this.END == this.mMazeArray[i]) {
                    wCtx.fillStyle = "green";
                }
                else {
                    wCtx.fillStyle = "white";
                }

                if(this.HIGHLIGHT == this.mMazeArray[i]){
                    wCtx.lineWidth = 3;
                    wCtx.strokeStyle = "lime";
                }

                wCtx.rect(-0.5 * wBoxWidth,- 0.5 * wBoxHeight, wBoxWidth, wBoxHeight);
                wCtx.fill();
                wCtx.stroke();

                
                if(null != this.cellDrawFunction)
                {
                    this.cellDrawFunction(wCtx, i, wBoxWidth, wBoxHeight);
                }
                wCtx.translate(-wCellWidthCenter, -wCellHeightCenter);
            }
        }
    }

    this.reset();
}



-->