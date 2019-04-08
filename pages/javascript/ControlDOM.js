<!--

function ControPointStructure(iX , iY, iActive, iIdentifier){
    this.mX = iX;
    this.mY = iY;
    this.mActive = iActive;
    this.mIdentifier = iIdentifier;
    this.mMovementX = 0;
    this.mMovementY = 0;
}

function ControlDOM(iControlDOM, iOperatingFrequency)
{
    this.mControlDOM = iControlDOM;
    this.mControlPoints = [];
    this.mFrequency = iOperatingFrequency;

    this.getControlDOM = function(){

        return this.mControlDOM;
    };

    this.getControlPoints = function(){
        return this.mControlPoints;
    };

    this.getFrequency = function(){
        return this.mFrequency;
    };

    this.init = function(){

        var wControlDOM = this.getControlDOM();
        //wCanvas.width  = wCanvas.parentNode.clientWidth - 2;
        //wCanvas.height = wCanvas.parentNode.clientHeight - 2;

        wControlDOM.addEventListener("mousedown", this.canvasMouseDown.bind(this), false);
        wControlDOM.addEventListener("mousemove", this.canvasMouseMove.bind(this), false);
        wControlDOM.addEventListener("mouseup",   this.canvasMouseUp.bind(this), false);

        wControlDOM.addEventListener("touchstart",  this.canvasTouchDown.bind(this), false);
        wControlDOM.addEventListener("touchend",    this.canvasTouchUp.bind(this), false);
        wControlDOM.addEventListener("touchmove",   this.canvasTouchMove.bind(this), false);
        wControlDOM.addEventListener("touchcancel", this.canvasTouchUp.bind(this), false);
    
        var wControlPoints = this.getControlPoints();

        wControlPoints[0] = new ControPointStructure(0,0,false, -1);

        for(var i = 0; i < wControlPoints.length; ++i){
            wControlPoints[i] = new ControPointStructure(0,0,false, i - 1);
        }
     
        this.setup();

        if(this.getFrequency() > 0 )
        {
            var wDeltaTime = 1/this.getFrequency();
            setInterval( this.run.bind(this) , 1000*wDeltaTime, wDeltaTime );
        }
    };

    this.setup = function () {

    };

    this.run = function (iDeltaTime) {

    };

    
    this.canvasMouseUp = function (evt) {
        this.getControlPoints()[0].mActive = false;
        this.processMouse(evt);
    };

    this.canvasMouseDown = function (evt) {
        this.getControlPoints()[0].mActive = true;
        this.processMouse(evt);
    };

    this.canvasMouseMove = function (evt) {
        if (!evt)
            evt = event;
        this.processMouse(evt);
    };

    this.processMouse = function (evt) {
        evt.preventDefault();

        var wNewX = evt.pageX - this.getControlDOM().offsetLeft;
        var wNewY = evt.pageY - this.getControlDOM().offsetTop;

        if(true == this.getControlPoints()[0].mActive)
        {
            this.getControlPoints()[0].mMovementX += wNewX - this.getControlPoints()[0].mX;
            this.getControlPoints()[0].mMovementY += wNewY - this.getControlPoints()[0].mY;
        }
        else
        {
            this.getControlPoints()[0].mMovementX = 0;
            this.getControlPoints()[0].mMovementY = 0;
        }

        this.getControlPoints()[0].mX = wNewX;
        this.getControlPoints()[0].mY = wNewY;
        
        this.onControlPointUpdate(this.getControlPoints());
    };

    this.canvasTouchDown = function (evt) {
        if (!evt)
            evt = event;
        this.processTouch(evt);
    };

    this.canvasTouchUp = function (evt) {
        if (!evt)
            evt = event;
        this.processTouch(evt);
    };

    this.canvasTouchMove = function (evt) {
        if (!evt)
            evt = event;
        this.processTouch(evt);
    };

    this.processTouch = function (evt){
    
        evt.preventDefault();

        var wControlPoints = this.getControlPoints()
        for (i = 0; i < evt.touches.length ; ++i) {
            var  wIsSet= false;
            for (j = 1; j < wControlPoints.length ; ++j) {
                if( wControlPoints[j].mIdentifier == evt.touches[i].identifier) {
                    wIsSet = true;
                    break;
                }
            }
                    
            if(wIsSet == false) {
                var wXVal = evt.touches[i].pageX - this.getControlDOM().offsetLeft;
                var wYVal = evt.touches[i].pageY - this.getControlDOM().offsetTop;
                wControlPoints.push(new ControPointStructure(wXVal, wYVal, true, evt.touches[i].identifier) );
            }
        }

        for (j = 0; j < wControlPoints.length ; ++j) {
            var wPastActiveState = wControlPoints[j].mActive;
            wControlPoints[j].mActive = false;
            for (i = 0; i < evt.touches.length ; ++i) {
                if( wControlPoints[j].mIdentifier == evt.touches[i].identifier) {
                    
                    var wXVal = evt.touches[i].pageX - this.getControlDOM().offsetLeft;
                    var wYVal = evt.touches[i].pageY - this.getControlDOM().offsetTop;

                    if(false == wPastActiveState)
                    {
                        wControlPoints[j].mX = wXVal;
                        wControlPoints[j].mY = wYVal;
                        wControlPoints[j].mMovementX = 0.0;
                        wControlPoints[j].mMovementY = 0.0;
                    }

                    wControlPoints[j].mActive = true;

                    wControlPoints[j].mMovementX += wXVal - wControlPoints[j].mX;
                    wControlPoints[j].mMovementY += wYVal - wControlPoints[j].mY;
                    
                    wControlPoints[j].mX = wXVal;
                    wControlPoints[j].mY = wYVal;

                    break;
                }
            }

            if(false == wControlPoints[j].mActive)
            {
                wControlPoints[j].mX = 0.0;
                wControlPoints[j].mY = 0.0;
                wControlPoints[j].mMovementX = 0.0;
                wControlPoints[j].mMovementY = 0.0;
            }
        }

        this.onControlPointUpdate(this.getControlPoints());
        /*
        var wControlPoints = this.getControlPoints()
        for (j = 0; j < wControlPoints.length ; ++j) {
            wControlPoints[j].mActive = false;
            for (i = 0; i < evt.touches.length ; ++i) {
                if( wControlPoints[j].mIdentifier == evt.touches[i].identifier) {
                    wControlPoints[j].mActive = true;
                }
            }
        }

        for (i = 0; i < evt.touches.length ; ++i) {
        
            var wXVal = evt.touches[i].pageX - this.getControlDOM().offsetLeft;
            var wYVal = evt.touches[i].pageY - this.getControlDOM().offsetTop;
            var wIsSet = false;
            for (j = 1; j < wControlPoints.length ; ++j) {
                if( wControlPoints[j].mIdentifier == evt.touches[i].identifier) {
                    wControlPoints[j].mActive = true;
                    wControlPoints[j].mX = wXVal;
                    wControlPoints[j].mY = wYVal;
                    wIsSet = true;
                    break;
                }
            }
                    
            if(wIsSet == false) {
                for (j = 1; j < wControlPoints.length ; ++j) {
                    if( false == wControlPoints[j].mActive) {
                        wControlPoints[j].mIdentifier = evt.touches[i].identifier;
                        wControlPoints[j].mActive = true;
                        wControlPoints[j].mX = wXVal;
                        wControlPoints[j].mY = wYVal;
                        wIsSet = true;
                        break;
                    }
                }
            }
        
            if(wIsSet == false) {
                wControlPoints[wControlPoints.length] = new ControPointStructure(wXVal , wYVal, true, evt.touches[i].identifier);
            }
        
            
            this.onControlPointUpdate(wControlPoints);
        }
        */
    };

    this.onControlPointUpdate = function(iControlPointArray){

    };

}


-->