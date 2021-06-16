// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    return Controller.extend("logaliproup.Employees.controller.Main", {

        onBeforeRendering: function () {
            this._detailEmployeeView = this.getView().byId("detailEmployeeView");
        },

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
            this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveOdataIncidence, this);

        },

        showEmployeeDetail: function (category, nameEvent, path) {
            var detailView = this.getView().byId("detailEmployeeView");
            detailView.bindElement("odataNorthwind>" + path);

            //modifica la segunda vista para mostrar al lado derecho repartiendo la pantalla
            this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

            var incidenceModel = new sap.ui.model.json.JSONModel([]);
            detailView.setModel(incidenceModel, "incidenceModel");
            detailView.byId("tableIncidence").removeAllContent();

            this.onReadDataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);
        },

        onSaveOdataIncidence: function (chanelId, eventId, data) {
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
            var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

            if (typeof incidenceModel[data.incidenceRow].IncidenceId == 'undefined') {
                var body = {
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: employeeId.toString(),
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    Type: incidenceModel[data.incidenceRow].type,
                    Reason: incidenceModel[data.incidenceRow].Reason
                };

                this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                    //Respuesta del servidor
                    success: function () {
                        this.onReadDataIncidence.bind(this)(employeeId);
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                    }.bind(this)
                })
            } else {
                sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
            };
        },

        onReadDataIncidence: function (employeeID) {
            this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                filters: [
                    new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                    new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                ],

                success: function (data) {
                    var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                    incidenceModel.setData(data.results);
                    var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                    tableIncidence.removeAllContent();

                    for (var incidence in data.results) {
                        var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence", this._detailEmployeeView.getController());
                        this._detailEmployeeView.addDependent(newIncidence);
                        newIncidence.bindElement("incidenceModel>/" + incidence);
                        tableIncidence.addContent(newIncidence);
                    }
                }.bind(this),

                error: function (e) {
                }
            });
        }       
    });
});