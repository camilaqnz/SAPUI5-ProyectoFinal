sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "ProyectoFinal/ProyectoFinal/util/Services",
        "sap/ui/model/json/JSONModel",
        "ProyectoFinal/ProyectoFinal/util/Constants",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "ProyectoFinal/ProyectoFinal/util/Commons",
        "ProyectoFinal/ProyectoFinal/util/Formatter"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Services, JSONModel, Constants, Filter, FilterOperator, Commons, Formatter) {
		"use strict";

		return Controller.extend("ProyectoFinal.ProyectoFinal.controller.Master", {
			onInit: function () {
                Formatter:Formatter;
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

                //CARGA DE CATEGORY & SUPPLIERS

                let oProductsModelFirst = this.getOwnerComponent().getModel(Constants.MODEL.oModelProducts);
                let oSelectedProduct = oProductsModelFirst.getProperty("/value/0");

                var oModelSelected = new JSONModel();
                oModelSelected.setData(oSelectedProduct);

                var categoryID = oSelectedProduct.CategoryID;
                var supplierID = oSelectedProduct.SupplierID;

                oComponent.setModel(oModelSelected, Constants.MODEL.oSelectedProduct);

                this.loadCategoryModel(categoryID);
                this.loadSupplierModel(supplierID);
            },

            loadCategoryModel: async function(categoryID){
                var oComponent = this.getOwnerComponent();
                let oResponse = await Services.getCategory(categoryID);
                let oData = oResponse[0];
                var oModelCategory = new JSONModel();
                oModelCategory.setData(oData);
                oComponent.setModel(oModelCategory, Constants.MODEL.oModelCategory);
            },

            loadSupplierModel: async function(supplierID){
                var oComponent = this.getOwnerComponent();
                let oResponse = await Services.getSupplier(supplierID);
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
                let oIdSeleccionado = oItemSeleccionado.ProductID;

                let oResponse = await Services.getProductID(oIdSeleccionado);                
                let oSelectedProduct = oResponse[0];
                let oModelSelectedProduct = new JSONModel();
                oModelSelectedProduct.setData(oSelectedProduct);
                
                let oComponent = this.getOwnerComponent();
                oComponent.setModel(oModelSelectedProduct, Constants.MODEL.oProductSelectId);

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
