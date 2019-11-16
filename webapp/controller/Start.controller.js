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
            this.byId("resumeQuizButton").setVisible(true);
        },

        onResumeQuiz: function()
        {
            if (this.getModel("quiz") !== undefined)
            {
                if (this.getModel("quiz").getProperty("/ended"))
                {
                    this.getRouter().navTo("results");
                } else {
                    this.getRouter().navTo("play");
                }
            }
        },

        _initQuiz: function()
        {
            let iGlobalCount = this.getView().getModel().getProperty("/global").length;
            let sStateKey = this.getView().byId("stateSelection").getSelectedItem().getKey();
            if (sStateKey && sStateKey != "de")
            {
                let iStateCount = this.getView().getModel().getProperty("/" + sStateKey).length;
                this.getComponent().getQuiz().init(iGlobalCount, iStateCount, sStateKey);
            } else {
                this.getComponent().getQuiz().init(iGlobalCount, 0);
            }
        }
    });
 });