<!--

function getUrlParameter(iParameter)
{
    var wPageURL = window.location.search.substring(1);
    var wURLVariables = wPageURL.split('&');
    for (var i = 0; i < wURLVariables.length; i++) 
    {
        var wParameterName = wURLVariables[i].split('=');
        if (wParameterName[0] == iParameter) 
        {
            return wParameterName[1];
        }
    }

    return "";
}

function getAllScroll(iDOM){
    var wScrollX = iDOM.scrollLeft;
    var wScrollY = iDOM.scrollTop;
    
    var wCurrentDOM = iDOM;
    
    while(wCurrentDOM != document.body){
    
       wScrollX += wCurrentDOM.scrollLeft;
       wScrollY += wCurrentDOM.scrollTop;
      
       wCurrentDOM = wCurrentDOM.parentNode;
    }
    
    
       wScrollX += wCurrentDOM.scrollLeft;
       wScrollY += wCurrentDOM.scrollTop;
   
    return {
    x: wScrollX,
    y: wScrollY,
    };
  
}

-->