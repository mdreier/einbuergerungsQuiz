sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "de/martindreier/ebq/controller/Quiz"
], function (UIComponent, JSONModel, Quiz) {
    "use strict";
    return UIComponent.extend("de.martindreier.ebq.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            //Initialize routing
            this.getRouter().initialize();

            //App model
            var oAppModel = new JSONModel({
                appVersion: this.getMetadata().getManifestEntry("sap.app").applicationVersion.version
            });
            this.setModel(oAppModel, "app");
        },

        getQuiz: function()
        {
            if (!this._oQuiz) {
                this._oQuiz = new Quiz(this);
            }
            return this._oQuiz;
        }
    });
});