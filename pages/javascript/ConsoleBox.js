<!--

function ConsoleBox()
{
    this.mLogEnable = false;
    this.mLogFile = "";
    this.mLatestLogs = "";
    
    this.mCmdCallbackList = [];

    this.getLogEnableFlag =  function () {
        return this.mLogEnable;
    }
    
    this.setLogEnableFlag =  function (iFlag) {
        this.mLogEnable = iFlag;
    }

    this.getLog =  function () {
        return this.mLogFile;
    }
    
    this.getLatestLog = function () {
        var wlog = this.mLatestLogs;
        this.mLatestLogs = "";
        return wlog;
    }

    this.clearLog = function () {
        this.mLogFile = "";
        this.mLatestLogs = "";
    }

    this.log = function(iLogEntry){
        //if(true == this.mLogEnable)
        {
            this.mLogFile += iLogEntry + "\n";
            this.mLatestLogs += iLogEntry + "\n";
        }
    };

    
    this.addToCmdLineCallBack = function(iFunction){
        this.mCmdCallbackList.push(iFunction);
    };

    var wSection = document.createElement('div');
    //wSection.style.position = "fixed";
    wSection.style.top = "100";
    wSection.style.left = "100";
    wSection.style.position = "fixed";

    var wMoveButton = document.createElement('input');
    wMoveButton.type ="button";
    wMoveButton.value = "Move";
    wMoveButton.style.width = "60px";

    var wMinimizeButton = document.createElement('input');
    wMinimizeButton.type ="button";
    wMinimizeButton.value = "_";

    var wBreak1 = document.createElement('br');

    var wTextArea = document.createElement('textarea');
    wTextArea.style.width = "360px";

    var wBreak2 = document.createElement('br');

    var wCmdLine = document.createElement('input');
    wCmdLine.style.width = "300px";

    var wSendButton = document.createElement('input');
    wSendButton.type ="button";
    wSendButton.value = "Send";
    wSendButton.style.width = "60px";

    wSection.appendChild(wMoveButton);
    wSection.appendChild(wMinimizeButton);
    wSection.appendChild(wBreak1);
    wSection.appendChild(wTextArea);
    wSection.appendChild(wBreak2);
    wSection.appendChild(wCmdLine);
    wSection.appendChild(wSendButton);
    document.body.appendChild(wSection);

    this.updateTextArea = function(){
        wTextArea.value += this.getLatestLog();
        wTextArea.scrollTop = wTextArea.scrollHeight;
    }

    this.pushCmdLineBt = function(){
        var wInput = wCmdLine.value;
        wCmdLine.value = "";
        this.log(wInput);
        for(var i = 0; i < this.mCmdCallbackList.length; ++i){
            if(null != this.mCmdCallbackList[i]) this.mCmdCallbackList[i](wInput);
        }
    }

    this.pushCmdLineKb = function(e){
        if (e.keyCode == 13) {
            this.pushCmdLineBt();
        }
    }

    setInterval( this.updateTextArea.bind(this), 100 );
        
    wSendButton.onclick =  this.pushCmdLineBt.bind(this);
        
    wCmdLine.onkeyup = this.pushCmdLineKb.bind(this);

    var wMouseDown = false;
    var wMouseX = false;
    var wMouseY = false;

    wMoveButton.onmousedown = function (e) {
        wMouseX = e.clientX;
        wMouseY = e.clientY;
        wMouseDown = true;
    }
        
    wMoveButton.onmouseup = function () {
        wMouseDown = false;
    }

    wMoveButton.onmouseleave = function() {
        wMouseDown = false;
    }

    document.body.onmousemove = function(e) {
            
        if(true == wMouseDown )
        {
            wSection.style.left = stringToInt(wSection.style.left, 0) + e.clientX - wMouseX;
            wSection.style.top =  stringToInt(wSection.style.top, 0) + e.clientY - wMouseY;

            wMouseX = e.clientX;
            wMouseY = e.clientY;
        }
    }

    wMinimizeButton.onclick = function(){
        if(wTextArea.style.display  != "none"){
            wBreak1.style.display = "none";
            wTextArea.style.display = "none";
            wBreak2.style.display = "none";
            wCmdLine.style.display = "none";
            wSendButton.style.display = "none";
        }
        else{
            wBreak1.style.display = "inline";
            wTextArea.style.display = "inline";
            wBreak2.style.display = "inline";
            wCmdLine.style.display = "inline";
            wSendButton.style.display = "inline";
        }
    }
}


-->