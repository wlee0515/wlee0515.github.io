
function MenuBarCreator() {

  this.mTopMenuItemClassname = "class_top_menu_item";
  this.mSubMenuClassname = "class_sub_menu";
  this.mSubMenuItemClassname = "class_sub_menu_item";

  this.generateHTMLString = function (iMenuDefinitionObj) {

    return this.createMenuItemString(iMenuDefinitionObj, this.mTopMenuItemClassname);
  }

  this.createMenuItemString = function (iMenuDefinitionObj, iMenuItemClassname) {

    var wReturnStr = "";

    for (key in iMenuDefinitionObj) {
      var wObj = iMenuDefinitionObj[key];
      if (null != wObj) {
        if (null != wObj.Label) {
          wReturnStr += "<label class='" + iMenuItemClassname + "'";
          if (null != wObj.Click_DOM_Id) {
            wReturnStr += " for='" + wObj.Click_DOM_Id + "'";
          }
          wReturnStr += ">" + wObj.Label + "</label>";

          if (null != wObj.Submenu) {
            wReturnStr += "<div class='" + this.mSubMenuClassname + "'>";
            wReturnStr += this.createMenuItemString(wObj.Submenu, this.mSubMenuItemClassname);
            wReturnStr += "</div>";
          }
        }
      }
    }
    return wReturnStr;
  }
}
