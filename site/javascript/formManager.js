<!--

  // This class creates and manages forms using a JSON object
  // parameters
  //   iIdPrefix   :   prefix added to form element id
  function FormManager(iIdPrefix) {

    // Callback function to call when the form is submitted 
    this.mCallBackFunction = null;

    // Database of all forms created by the Form Manager
    this.mFormDatabase = {};

    // setter for the callback function
    this.setCallBackFunction = function (iCallBackFunction) {
      this.mCallBackFunction = iCallBackFunction;
    }

    // call for the form submit click
    this.processFormSumitClick = function (iFormIdStr) {

      // retreive form object from database
      var wFormObject = this.mFormDatabase[iFormIdStr];

      if (null != wFormObject) {
        // get the JSON string generated by the form data
        var wJSONString = this.getObjFormJSONStr(iFormIdStr, wFormObject.FormObj);

        // Parse the JSON string into an object
        var wObj = JSON.parse(wJSONString);

        if (null != this.mCallBackFunction) {

          // Create form submit event
          var wEvent = {
            FormId: wFormObject.FormId,
            FormMetadata: wFormObject.FormMetadata,
            FormFilled: wObj
          };

          // Send Event to callback function
          this.mCallBackFunction(wEvent);
        }
      }

      else {
        alert("Error : Form Object does not exist");
      }
    }


    // This function creates the form entry in the FormObject Database
    // It will return the HTML formated string with the generated form data 
    // parameters:
    //   - iFormIdStr   :   The the ID of the form
    //   - iJSONObject  :   The form object with the structure of the form input
    //   - iMetaData    :   The Meta data that will provided with the form when the submit event is generated
    this.createForm = function (iFormIdStr, iJSONObject, iMetaData) {

      if (("" == iFormIdStr)) {
        return "";
      }

      // Create the form Id
      var wFormId = iIdPrefix == null ? iFormIdStr : iIdPrefix + "_" + iFormIdStr;

      // Create coby of the metadata and form object
      var wObject = null == iJSONObject ? null : JSON.parse(JSON.stringify(iJSONObject))
      var wMetadata = null == iMetaData ? null : JSON.parse(JSON.stringify(iMetaData))

      // Add form data entry to Form database
      this.mFormDatabase[wFormId] = {
        FormId: iFormIdStr,
        FormMetadata: wMetadata,
        FormObj: wObject,
      };

      // create submit form
      var wFormhtml = "";
      wFormhtml += '<div id="' + wFormId + '_form" class="input_form">';
      wFormhtml += this.createObjFormHtmlStr(wFormId, wObject);
      wFormhtml += '<button id="' + wFormId + '_submit" class="input_submit" onclick = "form_submit_click(\'' + wFormId + '\')" >Submit</button > ';
      wFormhtml += '</div>';

      return wFormhtml;
    }

    // This function creates a form from a JSON object
    // The structure of each entry is:
    //      - checkbox to include the variable
    //      - name of the variable
    //      - input box for the value
    //
    // parameters:
    //   - iIdPrefix    :   The the ID prefix for the form elements
    //   - iJSONObject  :   The form object with the structure of the form input
    this.createObjFormHtmlStr = function (iIdPrefix, iJSONObject) {

      var wForm = "";

      // Create a table for the JSON object form
      wForm += '<table class="input_table">';

      // Loop through all the properties of the JSON object
      for (key in iJSONObject) {
        // Create Element ID
        var wIdName = iIdPrefix + "." + key;
        var wCurrentKey = key;

        // Property entry, each property of the JSON object is a row in the table
        wForm += '<tr class="input_property">';

        // Check if the property is an object or array
        if (typeof (iJSONObject[wCurrentKey]) === "object") {

          // column 1, empty cell for the checkbox location, objects are included in the filled form if the child property is selected
          wForm += '<td></td>';

          // column 2, includes the name of the property
          wForm += '<td id="' + wIdName + '_label" class="key_label">' + wCurrentKey + '</td>';

          // column 3, contains the subform for the object
          wForm += '<td class="child_property_form">';
          wForm += this.createObjFormHtmlStr(wIdName, iJSONObject[wCurrentKey]);
          wForm += '</td>';
        }
        else {

          // column 1, checkbox to include the property in the filled form
          wForm += '<td>'
          wForm += '<input type="checkbox" id="' + wIdName + '_checkbox" class="input_checkbox" title = "Use Checkbox to include property" > ';
          wForm += '</td>'

          // column 2, includes the name of the property
          wForm += '<td id="' + wIdName + '_label" class="key_label">' + wCurrentKey + '</td>';
          wForm += '<td>'

          // column 3, contains the input for the variable. The input depends on the type of the variable
          if (typeof (iJSONObject[wCurrentKey]) === "string") {
            wForm += '<input type="text" id="' + wIdName + '_text" class="input_text">';
          }
          else if (typeof (iJSONObject[wCurrentKey]) === "number") {
            wForm += '<input type="number" id="' + wIdName + '_number" class="input_number">';
          }
          else if (typeof (iJSONObject[wCurrentKey]) === "boolean") {
            wForm += '<select id="' + wIdName + '_boolean" class="input_boolean">';
            wForm += '<option value="TRUE">TRUE</option>';
            wForm += '<option value="FALSE">FALSE</option>';
            wForm += '</select>';
          }
          wForm += '</td>'
        }

        wForm += '</tr>';
      }
      wForm += '</table>';
      return wForm;
    }

    // This function retreives the filled form from the user
    // This function return a JSON formated string with the filled form data 
    // parameters:
    //   - iIdPrefix    :   The the ID prefix for the form elements
    //   - iJSONObject  :   The form object with the structure of the form input
    this.getObjFormJSONStr = function (iIdPrefix, iJSONObject) {

      // check if the current JSON object is an array
      var wIsArray = false;
      if (true == Array.isArray(iJSONObject)) {
        wIsArray = true;
      }

      var wJSONStr = "";

      // Array type and object type has different brackest type
      wJSONStr += wIsArray ? '[' : '{';

      // Loop through each property in the JSONOBJECT
      for (key in iJSONObject) {

        // Creat the JSON Obect ID
        var wIdName = iIdPrefix + "." + key;
        var wCurrentKey = key;

        // Check if the property is an object or array
        if (typeof (iJSONObject[wCurrentKey]) === "object") {

          // get the subform JSON string
          var wFormObjStr = this.getObjFormJSONStr(wIdName, iJSONObject[wCurrentKey]);

          // check if the subform is empty
          if (("{}" != wFormObjStr) && ("[]" != wFormObjStr)) {

            // if not empty, add to current JSON string
            // Check if the property is the first in the list
            if (("[" != wJSONStr) && ("{" != wJSONStr)) {
              // if not first, add a comma
              wJSONStr += ",";
            }

            // add object to JSON string
            wJSONStr += wIsArray ? "" : '\"' + wCurrentKey + '\" : ';
            wJSONStr += wFormObjStr;
          }
        }
        else {

          // Check to see if the form is checked to be included in the FilledForm object
          var wCheckBox = document.getElementById(wIdName + '_checkbox');
          if (true == wCheckBox.checked) {

            // Check if the property is the first in the list
            if (("[" != wJSONStr) && ("{" != wJSONStr)) {
              // if not first, add a comma
              wJSONStr += ",";
            }

            // add object to JSON string base on the type of the property
            if (typeof (iJSONObject[wCurrentKey]) === "string") {
              wJSONStr += wIsArray ? "" : '\"' + wCurrentKey + '\" : ';
              wJSONStr += '\"' + document.getElementById(wIdName + '_text').value + '\" ';
            }
            else if (typeof (iJSONObject[wCurrentKey]) === "number") {
              var wValue = document.getElementById(wIdName + '_number').value;
              if ("" == wValue) wValue = 0;

              wJSONStr += wIsArray ? "" : '\"' + wCurrentKey + '\" : ';
              wJSONStr += wValue;
            }
            else if (typeof (iJSONObject[wCurrentKey]) === "boolean") {

              wJSONStr += wIsArray ? "" : '\"' + wCurrentKey + '\" : ';
              if ("TRUE" == document.getElementById(wIdName + '_boolean').value) {
                wJSONStr += "true";
              }
              else {
                wJSONStr += "false";
              }
            }
          }
        }
      }

      wJSONStr += wIsArray ? ']' : '}';
      return wJSONStr;
    }
  }

// This is a function to return Singleton of the FormManager
var gFormManager = new FormManager("Main");
function getFormManager() {
  return gFormManager;
}

// DOM event callback function for the form submit click
function form_submit_click(iFormIdStr) {
  getFormManager().processFormSumitClick(iFormIdStr);
}


-->