/* exported MathClass */
function MathClass() {
	"use strict";
	// --------------------------------------
	this.add = function(num1, num2) {
	  return (num1 + num2);
  	};
  	// --------------------------------------
    this.multiply = function(num1, num2) {
	  return (num1 * num2);
  	};
	// --------------------------------------
	this.substract = function(num1, num2) {
	  return (num1 - num2);
  	};
	// --------------------------------------
	this.divide = function(num1, num2) {
	  return (num1 / num2);
  	};
	// --------------------------------------
	this.cosAndSin = function(angleInDegrees) {
		var cos = Math.cos(angleInDegrees * Math.PI / 180.0);
		var sin = Math.sin(angleInDegrees * Math.PI / 180.0) * -1;
		return [cos, sin];
	};
	// --------------------------------------
}

// Version 1

// var obj = new MathClass();

// obj.add(num1, num2);				-> Returns a Number
// obj.multiply(num1, num2);		-> Returns a Number
// obj.substract(num1, num2);		-> Returns a Number
// obj.divide(num1, num2);			-> Returns a Number
// obj.cosAndSin(angleInDegrees);	-> Returns an Array With 2 Numbers






