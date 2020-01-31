
window.addEventListener("load", function(event) {

	var wInput = document.createElement("input");

	wInput.type = "image";
	wInput.src = "https://wlee0515.github.io/favicon.ico";
	wInput.style.width = "75%";
	wInput.style.height = "75%";
	wInput.style.position = "relative";
	wInput.style.top = "10%";
	
	
	var wDiv= document.createElement("div");
//	wDiv.style.borderRadius= "50%";
	wDiv.style.width = "75px";
	wDiv.style.height = "75px";
//	wDiv.style.background = "black";
//	wDiv.style.border = "5px solid orange";
	wDiv.style.position = "fixed";
	if ((null != gFramePosition) && (1 == gFramePosition)){
		wDiv.style.right = "10px";
		wDiv.style.top = "10px";	
	}
	else {
		wDiv.style.right = "10px";
		wDiv.style.bottom = "10px";	
	}
	wDiv.style.cursor = "pointer";
	wDiv.style.padding = "0px";
	wDiv.style.margins = "auto";
	wDiv.style.textAlign = "center";
	wDiv.style.zIndex = 5000;
	
	wDiv.onclick = function () {
		window.location.href = "https://wlee0515.github.io/";
		
	};

	wDiv.appendChild(wInput); // put it into the DOM

	document.body.appendChild(wDiv); // put it into the DOM


});

