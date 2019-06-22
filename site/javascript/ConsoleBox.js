<!--

  function ConsoleBox(iInitX = 0, iInitY = 0, iIsAvailable = true) {

    if (true == iIsAvailable) {
      this.mMoveMode = false;
      this.mBodyTop = iInitY;
      this.mBodyLeft = iInitX;
      this.mMouseMoveDeltaTop = 0;
      this.mMouseMoveDeltaLeft = 0;
      this.mCmdCallbackList = [];

      this.mSection = document.createElement('div');
      this.mSection.style.position = "fixed";
      this.mSection.style.top = this.mBodyTop;
      this.mSection.style.left = this.mBodyLeft;

      this.mMoveButton = document.createElement('input');
      this.mMoveButton.type = "button";
      this.mMoveButton.value = "Move";
      this.mMoveButton.style.width = "60px";

      this.mMinimizeButton = document.createElement('input');
      this.mMinimizeButton.type = "button";
      this.mMinimizeButton.value = "_";

      this.mBreak1 = document.createElement('br');

      this.mTextArea = document.createElement('textarea');
      this.mTextArea.style.width = "360px";
      this.mTextArea.style.resize = "both";
      this.mTextArea.style.overflow = "auto";

      this.mBreak2 = document.createElement('br');

      this.mCmdLine = document.createElement('input');
      this.mCmdLine.style.width = "300px";

      this.mSendButton = document.createElement('input');
      this.mSendButton.type = "button";
      this.mSendButton.value = "Send";
      this.mSendButton.style.width = "60px";

      this.mSection.appendChild(this.mMoveButton);
      this.mSection.appendChild(this.mMinimizeButton);
      this.mSection.appendChild(this.mBreak1);
      this.mSection.appendChild(this.mTextArea);
      this.mSection.appendChild(this.mBreak2);
      this.mSection.appendChild(this.mCmdLine);
      this.mSection.appendChild(this.mSendButton);
      document.body.appendChild(this.mSection);

      this.MoveButtonDown = function (evt) {
        this.mMoveMode = true;
        this.mMouseMoveDeltaTop = evt.pageY - this.mBodyTop;
        this.mMouseMoveDeltaLeft = evt.pageX - this.mBodyLeft;
      }

      this.MoveButtonUp = function (evt) {
        this.mMoveMode = false;
        this.mBodyTop = evt.pageY - this.mMouseMoveDeltaTop;
        this.mBodyLeft = evt.pageX - this.mMouseMoveDeltaLeft;
        this.mSection.style.top = this.mBodyTop;
        this.mSection.style.left = this.mBodyLeft;
      }

      this.BodyMouseMove = function (evt) {
        if (true == this.mMoveMode) {
          this.mBodyTop = evt.pageY - this.mMouseMoveDeltaTop;
          this.mBodyLeft = evt.pageX - this.mMouseMoveDeltaLeft;
          this.mSection.style.top = this.mBodyTop;
          this.mSection.style.left = this.mBodyLeft;
        }
      }

      this.MinimizeButtonOnclick = function () {
        if (this.mTextArea.style.display != "none") {
          this.mBreak1.style.display = "none";
          this.mTextArea.style.display = "none";
          this.mBreak2.style.display = "none";
          this.mCmdLine.style.display = "none";
          this.mSendButton.style.display = "none";
        }
        else {
          this.mBreak1.style.display = "inline";
          this.mTextArea.style.display = "inline";
          this.mBreak2.style.display = "inline";
          this.mCmdLine.style.display = "inline";
          this.mSendButton.style.display = "inline";
        }
      }
      
      this.SendButtonOnclick = function () {
        if ("" != this.mCmdLine.value) {
          var wInput = this.mCmdLine.value;
          this.addTextToConsole("cmd>" + wInput + "\n");
          for (var i = 0; i < this.mCmdCallbackList.length; ++i) {
            if (null != this.mCmdCallbackList[i]) this.mCmdCallbackList[i](wInput);
          }

          this.mCmdLine.value = "";
        }
      }

      this.mMoveButton.addEventListener("mousedown", this.MoveButtonDown.bind(this), false);
      this.mMoveButton.addEventListener("mouseup", this.MoveButtonUp.bind(this), false);
      this.mMinimizeButton.addEventListener("mousedown", this.MinimizeButtonOnclick.bind(this), false);
      this.mSendButton.addEventListener("mousedown", this.SendButtonOnclick.bind(this), false);

      document.body.addEventListener("mousemove", this.BodyMouseMove.bind(this), false);


      this.addTextToConsole = function (iText) {
        if (null != this.mTextArea) {
          this.mTextArea.value += iText;
          this.mTextArea.scrollTop = this.mTextArea.scrollHeight;
        }
      }
      
    }

    this.log = function (ilog) {
      this.addTextToConsole("log>" + ilog + "\n");
    }

    this.addToCmdLineCallBack = function (iFunction) {
      if (null != this.mCmdCallbackList) {
        this.mCmdCallbackList.push(iFunction);
      }
    };
  }


-->