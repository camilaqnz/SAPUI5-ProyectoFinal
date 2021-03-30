jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "ProyectoFinal/ProyectoFinal/util/Constants"

], function(Controller, Constants){    
    return {
        formatPrice: function (iValor) {
            return iValor = parseInt(iValor);
            },
            
        formatStock: function(nUnit) {
            nUnit = parseFloat(nUnit)
            if(nUnit===0) {
                return "Out of Stock";
            } else if(nUnit <= 20) {
                    return "Little Stock";
                } else {
                return "In Stock";
                }
            },

        formatStockColor: function(nUnit) {
            nUnit = parseFloat(nUnit)
            if(nUnit===0) {
                return "Error";
                } else if(nUnit <= 20) {
                    return "Warning";
                } else {
                    return "Success";
            }  
        },
    }
},true);