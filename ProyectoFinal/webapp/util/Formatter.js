jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/NumberFormat"
], function(Constants){    
    return {
        formatPrice: function (valor) {
            valor = parseInt(valor);
            return valor/160;
            },
            
        formatStock: function(nUnit) {
            if(nUnit===0) {
                return "Out of Stock";
            } else {
                if(nUnit <= 20) {
                    return "Little Stock"
            } else if (nUnit > 20) {
                return "In Stock"
            } else {
                return "Error"
            }
            }
        },
    }
});