sap.ui.define([
    "de/martindreier/ebq/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/MessageType"
 ], function (BaseController, JSONModel, MessageType) {
    "use strict";
    return BaseController.extend("de.martindreier.ebq.controller.Results", {
        
        onInit: function() {
            this._quiz = this.getComponent().getQuiz();
            this._quiz.attachQuestionChange(this._onQuestionUpdate, this);
            this._quiz.attachQuizEnd(this._onQuizEnd, this);
            this.getRouter().getRoute("results").attachPatternMatched(this._onShowResults, this);
            
            let oModel = new JSONModel({
                resultsActive: false
            });
            this.getView().setModel(oModel, "view");
        }

    });
 });