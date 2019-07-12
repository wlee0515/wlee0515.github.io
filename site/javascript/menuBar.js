var gMenuBarCreatorReserveKeys = [
  "Label",
  "SubMenu"
]

function MenuBarCreator() {

  this.mTopMenuItemClassname = "class_top_menu_item";
  this.mSubMenuItemClassname = "class_sub_menu_item";
  this.mMenuClassname = "class_menu";
  this.mSubMenuClassname = "class_sub_menu";
  this.mMenuLabelClassname = "class_menu_label";

  this.generateHTMLString = function (iMenuDefinitionObj) {

    var wHTMLString = "";
    wHTMLString += this.createCSSString();
    wHTMLString += this.createMenuItemString(iMenuDefinitionObj, this.mTopMenuItemClassname)
    return wHTMLString;
  }

  this.createCSSString = function (iMenuDefinitionObj, iMenuItemClassname) {
    var wCSSString = "<style>";
  
    //-------------------
    // general setup
    wCSSString += "." + this.mMenuLabelClassname ;
    wCSSString += "{ \
      cursor: pointer; \
      display: inline-block; \
      width:100%; \
      height:100%; \
      white-space: nowrap; \
    }";
        
    //-------------------
    // Horizontal Menu
    wCSSString += "." + this.mTopMenuItemClassname;
    wCSSString += "{    \
      display: inline-block;   \
      }";
      
    wCSSString += "." + this.mTopMenuItemClassname + ":hover ." + this.mMenuLabelClassname + ",";
    wCSSString += "{background-color:blue;}";

    //-------------------
    // Hiding sub menus
    wCSSString += "." + this.mSubMenuClassname;
    wCSSString += "{display : none;}";

    wCSSString += "." + this.mTopMenuItemClassname + ":hover > ." + this.mSubMenuClassname;
    wCSSString += "{ display : block;  position: absolute;}";

    wCSSString += "." + this.mSubMenuItemClassname + ":hover > ." + this.mSubMenuClassname;
    wCSSString += "{ display : inline-block; position: absolute;}";

    //-------------------
    // Keep color 
    wCSSString += "." + this.mTopMenuItemClassname + ":hover > ." + this.mMenuLabelClassname;
    wCSSString += "{ background-color:lime;}";

    wCSSString += "." + this.mSubMenuItemClassname + ":hover > ." + this.mMenuLabelClassname;
    wCSSString += "{ background-color:lime;}";
  
    //-------------------
    
    // Visual Decor
    
    wCSSString += "." + this.mTopMenuItemClassname + ", ";
    wCSSString += "." + this.mSubMenuItemClassname + "";
    wCSSString += "{    \
      padding: 0px;      \
      height: 20px;      \
      }";

      wCSSString += "." + this.mMenuLabelClassname + "";
      wCSSString += "{    \
        padding: 0px;      \
        height: 20px;      \
        }";

    wCSSString += "." + this.mMenuClassname;
    wCSSString += "{background-color:grey;}";

    return wCSSString + "</style>";

  }

  this.createMenuItemString = function (iMenuDefinitionObj, iMenuItemClassname) {

    var wReturnStr = "";
    
    wReturnStr += "<div class='" + this.mMenuClassname + "'>";

    for (key in iMenuDefinitionObj) {
      var wObj = iMenuDefinitionObj[key];
      if (null != wObj) {
        if (null != wObj.Label) {
          wReturnStr += "<div class='" + iMenuItemClassname + "'>";
          wReturnStr += "<label class='" + this.mMenuLabelClassname + "'";
          
          for (key in wObj) {
            if (false == gMenuBarCreatorReserveKeys.includes(key)) {
              if (null != wObj[key]){
                wReturnStr += " " + key + "='" + wObj[key] + "'";
              }    
            }
          }

          wReturnStr += ">" + wObj.Label + "</label>";

          if (null != wObj.SubMenu) {
            wReturnStr += "<div class='" + this.mSubMenuClassname + "'>";
            wReturnStr += this.createMenuItemString(wObj.SubMenu, this.mSubMenuItemClassname);
            wReturnStr += "</div>";
          }
          wReturnStr += "</div>";
        }
      }      
    }

    wReturnStr += "</div>";
    
    return wReturnStr;
  }
}
