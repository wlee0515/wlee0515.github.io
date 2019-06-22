var anArray;

$(function(){
	"use strict";
	$('.submitButton').click(submitButtonClicked);

});


	function submitButtonClicked(){
		"use strict";
		anArray = [];
		var field1 = parseFloat($('.field1').val());
		var field2 = parseFloat($('.field2').val());
		var field3 = parseFloat($('.field3').val());

		if (field1 <= 100 && field2 <= 100 && field3 <= 100 && field1 >= 0 && field2 >= 0 && field3 >= 0) {
				anArray.push(field1);
				anArray.push(field2);
				anArray.push(field3);
				for(var x = 0; x < anArray.length; x++){
					applyValues(anArray[x], ".col" + (x + 1));
				}
		} else {
			anArray = [];
			alert("value must be between 0 and 100");

		}
	}

	function applyValues(fieldValue, colClassName){
		"use strict";
		var theValue = fieldValue * 300 / 100;
		$(colClassName).css('height', theValue);


	}