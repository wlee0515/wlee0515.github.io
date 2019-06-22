/* exported QuebecTaxesClass */
/* globals MathClass */

function QuebecTaxesClass() {
	//-------------------------
	"use strict";
	//-------------------------
	MathClass.call(this);
	//-------------------------
	this.getTaxes = function(initialAmount) {
		var gst = this.multiply(initialAmount, 0.05);
		var qst = this.multiply(initialAmount, 0.09975);
		return this.add(gst, qst).toFixed(2);
	};
	//-------------------------
	this.getAmountWithTaxes = function(initialAmount) {
		return this.add(parseFloat(this.getTaxes(initialAmount)), initialAmount).toFixed(2);
	};
	//-------------------------
}

// Version 2

// var obj = new QuebecTaxesClass();

// obj.getTaxes(initialAmount);
// obj.getAmountWithTaxes(initialAmount);