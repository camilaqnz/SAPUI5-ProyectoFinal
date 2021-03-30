sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "ProyectoFinal/ProyectoFinal/util/Services",
        "sap/ui/model/json/JSONModel",
        "ProyectoFinal/ProyectoFinal/util/Constants",
        "ProyectoFinal/ProyectoFinal/util/Formatter",
        "sap/ui/core/Fragment",
        'sap/m/MessageToast',
        "sap/m/MessageBox",
        ],
        
	function (Controller, Services, JSONModel, Constants, Formatter, Fragment, MessageToast, MessageBox) {
        "use strict";
        
		return Controller.extend("ProyectoFinal.ProyectoFinal.controller.Detail", {
            Formatter: Formatter,
            onInit: function () {
                let oModelProducts = this.getOwnerComponent().getModel(Constants.MODEL.oProductSelectId);
           },
            
            onRouteMatched: function (oEvent) {
                this._productId = oEvent.getParameter("arguments").productId;
                this.getView().bindElement(Constants.routes.detail + this._productId)
            },

            onEditDialog: function(){
               const oView = this.getView();
                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        id: oView.getId(),
                        name: Constants.routes.FRAGMENTS.dialogEdit,
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    })
                }
                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                })
            },

            onCloseDialog: function(){
                this.byId(Constants.ids.FRAGMENTS.dialogEdit).close();
            },

            onCopyInfo: function(){
                let sMessage = (Constants.TEXT.message);
                MessageToast.show(sMessage);
            },

            onDeleteInfo: function(evt){
                //Se que era con Bundle para que interprete que idioma es, pero no recuerdo la funcion
                MessageBox.warning(Constants.TEXT.delete, {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
                    MessageToast.show(Constants.TEXT.deleted + sAction);
                    }
                })
            }
		});
	});