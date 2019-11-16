sap.ui.define([
    "de/martindreier/ebq/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/MessageType"
 ], function (BaseController, JSONModel, MessageType) {
    "use strict";
    return BaseController.extend("de.martindreier.ebq.controller.Results", {
        
        onEndQuiz: function()
        {
            this.getRouter().navTo("start");
        }

    });
 });