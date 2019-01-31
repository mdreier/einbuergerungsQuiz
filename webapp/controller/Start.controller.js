sap.ui.define([
    "de/martindreier/ebq/controller/BaseController",
    "sap/ui/model/json/JSONModel"
 ], function (BaseController, JSONModel) {
    "use strict";
    return BaseController.extend("de.martindreier.ebq.controller.Start", {
        
        onStartQuiz: function()
        {
            this._initQuiz();
            this.getRouter().navTo("play");
        },

        _initQuiz: function()
        {
            let iGlobalCount = this.getView().getModel().getProperty("/global").length;
            this.getComponent().getQuiz().init(iGlobalCount, 0);
        }
    });
 });