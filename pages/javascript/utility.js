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


-->