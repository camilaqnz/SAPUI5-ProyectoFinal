sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "ProyectoFinal/ProyectoFinal/util/Services",
        "sap/ui/model/json/JSONModel",
        "ProyectoFinal/ProyectoFinal/util/Constants",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "ProyectoFinal/ProyectoFinal/util/Formatter",
        "sap/ui/Device",
        "sap/ui/model/Sorter",
        "sap/m/library",
        "sap/m/ViewSettingsItem"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Services, JSONModel, Constants, Filter, FilterOperator, Formatter, Device, Sorter, mLibrary, ViewSettingsItem) {
		"use strict";

		return Controller.extend("ProyectoFinal.ProyectoFinal.controller.Master", {
            Formatter:Formatter,
			onInit: function () {
                this.mViewSettingsDialogs = {};

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

                //Contador de productos
                var oProductsValue = oModelProducts.getProperty("/value");
                var oProductCounter = oProductsValue.length;
                let oModelLength = new JSONModel(oProductCounter);

                oComponent.setModel(oModelLength, Constants.MODEL.oModelLength)
            },

            loadCategoryModel: async function(oIdSelect){
                var oComponent = this.getOwnerComponent();
                let oResponse = await Services.getCategory(oIdSelect);
                let oData = oResponse[0];
                var oModelCategory = new JSONModel();
                oModelCategory.setData(oData);

                oComponent.setModel(oModelCategory, Constants.MODEL.oModelCategory);
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

                var fragmentList = this.getView().createId(Constants.ids.FRAGMENTS.fragmentList);
                var oList = sap.ui.core.Fragment.byId(fragmentList, Constants.ids.FRAGMENTS.listProducts);
                let oBinding = oList.getBinding("items");
                oBinding.filter(oFiltros, "Application");

                //Contador en vivo
                let oProductsCounter = oBinding.getLength();
                let oModelLength = new JSONModel()
                oModelLength.setData(oProductsCounter);
                var oComponent = this.getOwnerComponent().setModel(oModelLength, Constants.MODEL.oModelLength);
            },

            createViewSettingsDialog: function(sDialogFragment){
                var oDialog = this.mViewSettingsDialogs[sDialogFragment];
                if(!oDialog){
                    oDialog = sap.ui.xmlfragment(sDialogFragment, this);
                    this.mViewSettingsDialogs[sDialogFragment] = oDialog;
                    this.getView().addDependent(oDialog);
                    if (!Device.system.desktop) {oDialog.addStyleClass("sapUiSizeCompact");}
                    oDialog.setFilterSearchOperator(mLibrary.StringFilterOperator.Contains);
                    if (sDialogFragment === Constants.routes.FRAGMENTS.filterDialog) {
                    var oModelFilterProducts = this.getOwnerComponent().getModel(Constants.MODEL.oModelProducts);
                    var oOriginalModelProducts = oModelFilterProducts.getProperty(Constants.PROPERTIES.value);

                    var jsonProductName = JSON.parse(JSON.stringify(oOriginalModelProducts, ["ProductName"]));
                    var jsonProductID = JSON.parse(JSON.stringify(oOriginalModelProducts, ["ProductID"]));
                    var jsonUnitPrice = JSON.parse(JSON.stringify(oOriginalModelProducts, ["UnitPrice"]));

                    oDialog.setModel(oOriginalModelProducts);

                    //Verificacion de items duplicados
                    jsonProductName = jsonProductName.filter(function (currentObject) {
                        if(currentObject.ProductName in jsonProductName){
                            return false;
                        } else {
                            jsonProductName[currentObject.ProductName] = true;
                            return true;
                        }
                    });

                    jsonProductID = jsonProductID.filter(function (currentObject) {
                        if(currentObject.ProductIDPerUnit in jsonProductID){
                            return false;
                        } else {
                            jsonProductID[currentObject.ProductID] = true;
                            return true;
                        }
                    });

                    jsonUnitPrice = jsonUnitPrice.filter(function (currentObject) {
                        if(currentObject.UnitPrice in jsonUnitPrice){
                            return false;
                        } else {
                            jsonUnitPrice[currentObject.UnitPrice] = true;
                            return true;
                        }
                    });

                    //Creo arrays para iterar los items
                    var aProductNameFilter = [];
                    for (var i=0; i<jsonProductName.length; i++){
                        aProductNameFilter.push(
                            new sap.m.ViewSettingsItem({
                                text: jsonProductName[i].ProductName,
                                key: "ProductName"
                            })
                        );
                    }

                    var aProductIDFilter = [];
                    for (var i=0; i<jsonProductID.length; i++){
                        aProductIDFilter.push(
                            new sap.m.ViewSettingsItem({
                                text: jsonProductID[i].ProductID,
                                key: "ProductID"
                            })
                        );
                    }

                    var aUnitPriceFilter = [];
                    for (var i=0; i<jsonUnitPrice.length; i++){
                        aUnitPriceFilter.push(
                            new sap.m.ViewSettingsItem({
                                text: jsonUnitPrice[i].UnitPrice,
                                key: "UnitPrice"
                            })
                        );
                    }

                    //Seteo los filter items
                    oDialog.destroyFilterItems();
                    oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                        key: "ProductName",
                        text: Constants.TEXT.productName,
                        items: aProductNameFilter
                    }));

                    oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                        key: "ProductID",
                        text: Constants.TEXT.productID,
                        items: aProductIDFilter
                    }));

                    oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                        key: "UnitPrice",
                        text: Constants.TEXT.unitPrice,
                        items: aUnitPriceFilter
                    }));
                
                    }
                }
                return oDialog;
            },

            onFilter: function(){
               this.createViewSettingsDialog(Constants.routes.FRAGMENTS.filterDialog).open();
            },

            onSort: function(){
                this.createViewSettingsDialog(Constants.routes.FRAGMENTS.sortDialog).open();
            },

            onFilterDialogConfirm: function(oEvent){
                var fragmentList = this.getView().createId(Constants.ids.FRAGMENTS.fragmentList);
                var oList = sap.ui.core.Fragment.byId(fragmentList, Constants.ids.FRAGMENTS.listProducts);
                let mParams = oEvent.getParameters();
                let oBinding = oList.getBinding("items");
                var aFilters = [];
                mParams.filterItems.forEach(function (oItem) {
                    var sPath = oItem.getKey(),
                        sOperator = FilterOperator.EQ,
                        sValue1 = oItem.getText();
                    var oFilter = new Filter(sPath, sOperator, sValue1);
                    aFilters.push(oFilter);
                });
                oBinding.filter(aFilters);
            },
            
            onSortDialogConfirm: function(oEvent){
                var fragmentList = this.getView().createId(Constants.ids.FRAGMENTS.fragmentList);
                var oList = sap.ui.core.Fragment.byId(fragmentList, Constants.ids.FRAGMENTS.listProducts);
                let mParams = oEvent.getParameters();
                let oBinding = oList.getBinding("items");
                let sPath;
                let bDescending;
                let aSorters = [];
                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));
                oBinding.sort(aSorters);
            }
        });
    }
)
