/*global QUnit*/

sap.ui.define([
	"ZGBC_DELIVERY_TRUCK_APPROVE/ZGBC_DELIVERY_TRUCK_APPROVE/controller/View1.controller"
], function (Controller) {
	"use strict";

	QUnit.module("View1 Controller");

	QUnit.test("I should test the View1 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});