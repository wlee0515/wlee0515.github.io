var gMenuBarCreatorReserveKeys = [
  "Label",
  "SubMenu"
]

function MenuBarCreator() {

  this.mTopMenuItemClassname = "class_top_menu_item";
  this.mSubMenuItemClassname = "class_sub_menu_item";
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
  
    // general setup
    wCSSString += "." + this.mMenuLabelClassname ;
    wCSSString += "{ cursor: pointer; width:300px; }";
      
    wCSSString += "." + this.mTopMenuItemClassname + ", ";
    wCSSString += "." + this.mSubMenuItemClassname + "";
    wCSSString += "{    \
      padding: 5px;      \
      height: 20px;      \
      padding: 0px;      \
      }";

      wCSSString += "." + this.mSubMenuItemClassname + "";
      wCSSString += "{    \
        height: 20px;      \
        }";
        
    // Horizontal Menu
    wCSSString += "." + this.mTopMenuItemClassname;
    wCSSString += "{    \
      display: inline-block;   \
      }";
      
    wCSSString += "." + this.mTopMenuItemClassname + ":hover ." + this.mMenuLabelClassname + ",";
    wCSSString += "{background-color:blue;}";

    // Hiding sub menus
    wCSSString += "." + this.mSubMenuClassname;
    wCSSString += "{display : none;}";

    wCSSString += "." + this.mTopMenuItemClassname + ":hover > ." + this.mSubMenuClassname;
    wCSSString += "{ display : block; position: absolute}";

    wCSSString += "." + this.mSubMenuItemClassname + ":hover > ." + this.mSubMenuClassname;
    wCSSString += "{ display : inline-block; position: absolute}";

    // Keep color 
    wCSSString += "." + this.mTopMenuItemClassname + ":hover > ." + this.mMenuLabelClassname;
    wCSSString += "{ background-color:lime;}";

    wCSSString += "." + this.mSubMenuItemClassname + ":hover > ." + this.mMenuLabelClassname;
    wCSSString += "{ background-color:lime;}";
  
    return wCSSString + "</style>";

    /*
    #navbar,
    #div_navbar_spacing {
        width: 100%;
        height: 30px;
        background-color: darkcyan;
        padding: 0px;
        color: white;
    }


    .navbar_menu:hover .navbar_expand {
        position: absolute;
        display: block;
        background-color: black;
    }

    .navbar_menu_item,
    .navbar_expand_item {
        padding: 5px;
        height: 20px;
        display: inline-block;
        cursor: pointer;
    }

    .navbar_expand_item:hover {
        background-color: lime;
    }

    .navbar_menu_item_container {
        display: grid;
        grid-column: auto;
    }
*/
  }

  this.createMenuItemString = function (iMenuDefinitionObj, iMenuItemClassname) {

    var wReturnStr = "";

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
    
    return wReturnStr;
  }
}
