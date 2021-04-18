sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("logaligroup.Employees.controller.MainView", {
            onInit: function () {

            },

            onValidate: function () {
                var inputEmployee = this.byId("inputEmployee");
                // @ts-ignore
                var valueEmployee = inputEmployee.getValue();
                if (valueEmployee.length === 6) {
                    // @ts-ignore
                    //    inputEmployee.setDescription("OK");
                    this.byId("labelCountry").setVisible(true);
                    this.byId("slCountry").setVisible(true);
                } else {
                    // @ts-ignore
                    //    inputEmployee.setDescription("Not OK");
                    this.byId("labelCountry").setVisible(false);
                    this.byId("slCountry").setVisible(false);
                };
            }
        });
    });
