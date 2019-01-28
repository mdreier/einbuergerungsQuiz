sap.ui.define([
    "de/martindreier/ebq/controller/BaseController",
    "sap/ui/model/json/JSONModel"
 ], function (BaseController, JSONModel) {
    "use strict";
    return BaseController.extend("de.martindreier.ebq.controller.Start", {
        
        onStartQuiz: function()
        {
            this.getRouter().navTo("play");
        }
    });
 });