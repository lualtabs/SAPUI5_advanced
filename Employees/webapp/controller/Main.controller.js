sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    return Controller.extend("logaliproup.Employees.controller.Main", {
        onInit: function () {
            var oView = this.getView();

            // Pasar al modelo los datos y además vincular la vista
            //oJSONModel.setData(oJSON);
            // @ts-ignore
            var oJSONModelEmpl = new sap.ui.model.json.JSONModel();
            oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
            oView.setModel(oJSONModelEmpl, "jsonEmployees");

            var oJSONModelCountries = new sap.ui.model.json.JSONModel();
            oJSONModelCountries.loadData("./localService/mockdata/Employees.json", false);
            oView.setModel(oJSONModelCountries, "jsoncountries");

            var oJSONModelLayout = new sap.ui.model.json.JSONModel();
            oJSONModelLayout.loadData("./localService/mockdata/Layout.json", false);
            oView.setModel(oJSONModelLayout, "jsonLayout");

            // nuevo modelo para ocultar o mostrar nuevos botones.
            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });
            oView.setModel(oJSONModelConfig, "jsonModelConfig");

            this._bus = sap.ui.getCore().getEventBus();
            this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetail, this);

        },

        showEmployeeDetail:  function(category, nameEvent, path){
            var detailView = this.getView().byId("detailEmployeeView");
            detailView.bindElement("jsonEmployees>"+ path);

            //modifica la segunda vista para mostrar al lado derecho repartiendo la pantalla
            this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

        }

    });

});