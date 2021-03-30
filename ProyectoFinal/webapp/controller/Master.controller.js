sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "ProyectoFinal/ProyectoFinal/util/Services",
        "sap/ui/model/json/JSONModel",
        "ProyectoFinal/ProyectoFinal/util/Constants",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "ProyectoFinal/ProyectoFinal/util/Formatter"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Services, JSONModel, Constants, Filter, FilterOperator, Formatter) {
		"use strict";

		return Controller.extend("ProyectoFinal.ProyectoFinal.controller.Master", {
            Formatter:Formatter,
			onInit: function () {
                this.loadProductsModel();

                this.getOwnerComponent().getRouter().getRoute(Constants.routes.main).attachPatternMatched(this.onRouteMatched, this);
            },
            
            loadProductsModel: async function(){
                var oComponent = this.getOwnerComponent();
                let oResponse = await Services.getProducts();
                let oData = oResponse[0];
                var oModelProducts = new JSONModel();
                oModelProducts.setData(oData);
                oComponent.setModel(oModelProducts, Constants.MODEL.oModelProducts);
            },

            loadCategoryModel: async function(oIdSelect){
                var oComponent = this.getOwnerComponent();
                let oResponse = await Services.getCategory(oIdSelect);
                let oData = oResponse[0];
                var oModelCategory = new JSONModel();
                oModelCategory.setData(oData);

                oComponent.setModel(oModelCategory, Constants.MODEL.oModelCategory);
                console.log(oModelCategory);
            },

            loadSupplierModel: async function(oIdSelect){
                var oComponent = this.getOwnerComponent();
                let oResponse = await Services.getSupplier(oIdSelect);
                let oData = oResponse[0];
                var oModelSupplier = new JSONModel();
                oModelSupplier.setData(oData);

                oComponent.setModel(oModelSupplier, Constants.MODEL.oModelSupplier);
            },

            onRouteMatched: function(oEvent){
                this.getOwnerComponent().getRouter().navTo(Constants.routes.detail);
            },

            onListItemPress: async function(oEvent){
                let oItem = oEvent.getSource().getSelectedItem().getBindingContext(Constants.MODEL.oModelProducts);
                let oModel = this.getOwnerComponent().getModel(Constants.MODEL.oModelProducts);
                let oItemSeleccionado = oModel.getProperty(oItem.getPath());
                let oIdSelect = oItemSeleccionado.ProductID;

                let oResponse = await Services.getProductID(oIdSelect);                
                let oSelectedProduct = oResponse[0];
                let oModelSelectedProduct = new JSONModel();
                oModelSelectedProduct.setData(oSelectedProduct);
                
                let oComponent = this.getOwnerComponent();
                oComponent.setModel(oModelSelectedProduct, Constants.MODEL.oProductSelectId);

                this.loadCategoryModel(oIdSelect);
                this.loadSupplierModel(oIdSelect);

                this.getOwnerComponent().getRouter().navTo(Constants.routes.detail);
            },

            onSearch: function(oEvent){
                let aFilter = [];
                let sSearchProduct = oEvent.getSource().getValue();

                if (sSearchProduct && sSearchProduct.length > 0) {
                    let oFilter = new Filter(Constants.FILTER.productName, FilterOperator.Contains, sSearchProduct);
                    aFilter.push(oFilter);

                    var oFiltros = new Filter(aFilter);
                }

                let oList = this.getView().byId(Constants.ids.idProductList);
                let oBinding = oList.getBinding("items");
                oBinding.filter(oFiltros, "Application");
            },
		});
	});