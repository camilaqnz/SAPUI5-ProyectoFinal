sap.ui.define([
    "sap/ui/core/routing/History",
    "ProyectoFinal/ProyectoFinal/util/Constants"

], function (History, Constants) {
    "use strict";
    return{

        onNavBack: function (oParam) {
            var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(oParam);
				oRouter.navTo(Constants.ROUTE.main, true);
			}
        },
        
        onNavigate: function (oScope, sRoute) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(oScope);
            oRouter.navTo(sRoute)
        }
    };
}, true);