sap.ui.define([], function(){
    "use strict";
    return {
        model:{
            I18N: "i18n",
        },

        REQUEST: {
            endPoint: {
                northwind: "Northwind"
            },
            method: {
                GET: "GET"
            },
            entity: {
                products: "/v3/northwind/northwind.svc/Products",
            },
            category:"/Category",
            suppliers:"/Supplier"
        },

        FILTER:{
            productName: "ProductName"
        },

        ids: {
            idProductList:"idProductList",
            FRAGMENTS:{
                dialogEdit: "idDialogEdit"
            }
        },

        routes: {
            main: "RouteMaster",
            detail: "RouteDetail",
            FRAGMENTS: {
               dialogEdit: "ProyectoFinal.ProyectoFinal.fragments.DialogEdit"
            }
        },

        MODEL: {
            oModelProducts: "ProductsModel",
            oSelectedProduct: "SelectProductModel",
            oProductSelectId: "ProductSelectIdModel",
            oModelCategory: "CategoryModel",
            oModelSupplier: "SupplierModel"
        },

        formatter: {

        }
    };
}, true);