// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {

    //Vincular la entidad a la vista, por medio de la llave
    function _onObjectMatched(oEvent){
        this.getView().bindElement({
            path: "/Orders(" + oEvent.getParameter("arguments").OrderID + ")",
            model: "odataNorthwind"
        }); 
    }

    return Controller.extend("logaligroup.Employees.controller.OrderDetails", {

        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);
        },

        onBack: function(){
            var oHistory = History.getInstance();
            var spreviousHash = oHistory.getPreviousHash();

            // Navegar hacia una pantalla atrás
            if(spreviousHash !== undefined){
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain", true);
            }
        }
    });
});