/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ZGBC_DELIVERY_TRUCK_APPROVE/ZGBC_DELIVERY_TRUCK_APPROVE/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});