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
            supplier:"/Supplier"
        },

        FILTER:{
            productName: "ProductName"
        },

        ids: {
            idProductList:"idProductList",
            FRAGMENTS:{
                dialogEdit: "idDialogEdit",
                listProducts: "idProductList",
                fragmentList:"idFragmentList"
            }
        },

        routes: {
            main: "RouteMaster",
            detail: "RouteDetail",
            FRAGMENTS: {
               dialogEdit: "ProyectoFinal.ProyectoFinal.fragments.EditDialog",
               filterDialog: "ProyectoFinal.ProyectoFinal.fragments.FilterDialog",
               sortDialog: "ProyectoFinal.ProyectoFinal.fragments.SortDialog"
            }
        },

        MODEL: {
            oModelProducts: "ProductsModel",
            oSelectedProduct: "SelectProductModel",
            oProductSelectId: "ProductSelectIdModel",
            oModelCategory: "CategoryModel",
            oModelSupplier: "SupplierModel",
            oModelLength: "LenghtModel"
        },

        TEXT:{
            message: "Copiado en portapapeles",
            delete: "¿Desea borrar esta información?",
            deleted: "Borrado",
            usd: "USD",
            productName: "Nombre producto",
            productID: "ID Producto",
            unitPrice: "Precio Unitario"
        },

        PROPERTIES:{
            value:"/value"
        }
    };
}, true);