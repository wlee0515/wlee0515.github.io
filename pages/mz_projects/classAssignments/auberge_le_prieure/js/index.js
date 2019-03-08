/* globals QuebecTaxesClass */

var jsonData;
var obj = new QuebecTaxesClass();

$(function() {
	"use strict";
	
	$.getJSON("json/data.json", function(result) {
		jsonData = result;
		parseJSON(result);
		build();
		setEvents();
	});
});

var asItemNames = [];
var afItemPrices = [];
var asItemImages = [];
var asDescrptions = [];
var asCategory = [];

function parseJSON(data) {
	"use strict";
	for (var keys in data) {
		if (data.hasOwnProperty(keys)) {

			for (var i = 0; i < data[keys].length; ++i) {
			asItemNames.push(data[keys][i].NAME);
			afItemPrices.push(data[keys][i].PRICE);
			asItemImages.push(data[keys][i].PICTURE);
			asDescrptions.push(data[keys][i].DESCRIPTIONS);
			asCategory.push(keys);
			}
		}
	}
}

function build() {
	"use strict";
	//---------------
	var body = document.getElementsByTagName('BODY')[0];
	//---------------
	var entree = document.createElement('DIV');
	entree.setAttribute('id', 'id_container_entree');
	entree.setAttribute('class', 'class_container');
	entree.innerHTML = "<h>ENTRÉES</h>"



	var principal = document.createElement('DIV');
	principal.setAttribute('id', 'id_container_principal');
	principal.setAttribute('class', 'class_container');
	principal.innerHTML = "<h>PLATS PRINCIPAUX</h>"


	var desert = document.createElement('DIV');
	desert.setAttribute('id', 'id_container_desert');
	desert.setAttribute('class', 'class_container');
	desert.innerHTML = "<h>DESSERTS</h>"

	//---------------
		for (var a = 0; a < asItemNames.length; a++) {
			//---------------
			var divForItems = document.createElement('DIV');
			divForItems.setAttribute('id', 'id_ForItems_' + a);
			divForItems.setAttribute('class', 'class_ForItems');
			//---------------
			var images = document.createElement("IMG"); 
			images.setAttribute("src",asItemImages[a]);
			images.setAttribute('class','class_ForImages');
			divForItems.appendChild(images); 
			//---------------
			var divForItemNames = document.createElement('DIV');
			divForItemNames.setAttribute('id', 'id_ForItemNames_' + a);
			divForItemNames.setAttribute('class', 'class_ForItemNames');
			//---------------
			var textNodeForItemNames = document.createTextNode(asItemNames[a]);
			divForItemNames.appendChild(textNodeForItemNames);
			//---------------
			divForItems.appendChild(divForItemNames);
			
				//---------------
				var divForDescrptions = document.createElement('DIV');
				divForDescrptions.setAttribute('id', 'id_ForDescrptions_' + a);
				divForDescrptions.setAttribute('class', 'class_ForDescrptions');
				//---------------
					var textNodeForDescrptions = document.createTextNode(asDescrptions[a]);
					divForDescrptions.appendChild(textNodeForDescrptions);
					//---------------
					divForItemNames.appendChild(divForDescrptions);
				

				//---------------
				
				var divForPricesAndCheckBox = document.createElement('DIV');
				divForPricesAndCheckBox.setAttribute('id', 'id_ForPricesAndCheckbox_' + a);
				divForPricesAndCheckBox.setAttribute('class', 'class_ForPricesAndCheckbox');
				divForItems.appendChild(divForPricesAndCheckBox);

				//---------------
				var divForPrices = document.createElement('DIV');
				divForPrices.setAttribute('id', 'id_ForPrices_' + a);
				divForPrices.setAttribute('class', 'class_ForPrices');
					var textNodeForTitleToPrices = document.createTextNode("PRICE : ");
					divForPrices.appendChild(textNodeForTitleToPrices);
					var textNodeForPrices = document.createTextNode("$" + afItemPrices[a]);
					divForPrices.appendChild(textNodeForPrices);
				divForPricesAndCheckBox.appendChild(divForPrices);
			
			//---------------
				var divForCheckboxe = document.createElement('DIV');
				divForCheckboxe.setAttribute('id', 'id_ForCheckboxe_' + a);
				divForCheckboxe.setAttribute('class', 'class_ForCheckboxe');
				//---------------
					var box = document.createElement('INPUT');
					box.setAttribute('type', 'checkbox');
					box.setAttribute('id', asItemNames[a]);
					box.setAttribute('name', (a));
					box.setAttribute('class', 'class_box');
					divForCheckboxe.appendChild(box);
				//---------------
				divForPricesAndCheckBox.appendChild(divForCheckboxe);
				//---------------

				

			if(asCategory[a] == "ENTRÉES")
			{
				entree.appendChild(divForItems);
			}

			if(asCategory[a] == "PLATS PRINCIPAUX")
			{
				principal.appendChild(divForItems);
			}

			if(asCategory[a] == "DESSERTS")
			{
				desert.appendChild(divForItems);
			}

			//---------------
		}
	//---------------

	var menuContainer = document.createElement('DIV');
	menuContainer.setAttribute('id', 'id_menu');

	menuContainer.appendChild(entree);
	menuContainer.appendChild(principal);
	menuContainer.appendChild(desert);

	body.appendChild(menuContainer);
	//---------------
	var resume = document.createElement('DIV');
	resume.setAttribute('id', 'id_resume');
	resume.setAttribute('class', 'class_resume');

		var resumeTitle = document.createElement('H');
		resumeTitle.setAttribute('id', 'id_ResumeTitle');
		resumeTitle.innerHTML = "Chosen Items";
		resume.appendChild(resumeTitle);

		var divForChosenItems = document.createElement('DIV');
		divForChosenItems.setAttribute('id', 'id_ForChosenItems');
		divForChosenItems.setAttribute('class', 'class_ForChosenItems');
		resume.appendChild(divForChosenItems);
		var divForCalculation = document.createElement('DIV');
		divForCalculation.setAttribute('id', 'id_ForCalculation');
		divForCalculation.setAttribute('class', 'class_ForCalculation');
		resume.appendChild(divForCalculation);
	body.appendChild(resume);
	//---------------
}

var cart = [];
var prices = [];

function setEvents() {
	"use strict";
	$("input").click(function() {
		var theID = $(this).attr('id');
		var theNumber = $(this).attr('name');
		if ($(this).is(':checked')) {
			cart.push(theID);
			prices.push(afItemPrices[theNumber]);
		} else {
			removeFromArray(cart, theID);
			removeFromArray(prices, afItemPrices[theNumber]);
		}
		displayCart(cart);
	});
}

function displayCart() {
	"use strict";
	var currentCartData = $('#id_ForChosenItems').val();
	if (cart.length === 0) {
		$('#id_ForChosenItems').html("");
	}
	for (var i = 0; i < cart.length; i++) {
		currentCartData += cart[i] + ' : $' + prices[i] + '</br>';
		$('#id_ForChosenItems').html(currentCartData);
	}
	doCalculation();
}

function removeFromArray(theArray, theElement) {
	"use strict";
	var theIndex = theArray.indexOf(theElement);
	while (theIndex !== -1) {
		theArray.splice(theIndex, 1);
		theIndex = theArray.indexOf(theElement);
	}
}

function doCalculation() {
	"use strict";
	var total = 0;
	for (var i = 0; i < prices.length; i++) {
		total += prices[i];
	}
	if (prices.length !== 0) {
		var str = "TOTAL : ";
		str += total.toFixed(2);
		str += "$<p>";
		str += "TOTAL WITH TAXES : $";
		str += obj.getAmountWithTaxes(total);
		str += "</p>";
		$("#id_ForCalculation").html(str);
	} else {
		$('#id_ForCalculation').html("");	
	}
}













