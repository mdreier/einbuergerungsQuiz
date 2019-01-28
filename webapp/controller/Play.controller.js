sap.ui.define([
    "de/martindreier/ebq/controller/BaseController",
    "sap/ui/model/json/JSONModel"
 ], function (BaseController, JSONModel) {
    "use strict";
    return BaseController.extend("de.martindreier.ebq.controller.Play", {
        
        onInit: function() {
            this._quiz = this.getComponent().getQuiz();
            this._quiz.getModel().attachPropertyChange(this._onQuestionUpdate, this);
            this.getRouter().getRoute("play").attachPatternMatched(this._onShowCurrentQuestion, this);
        },

        _onQuestionUpdate: function(oEvent)
        {
            let sPropertyPath = oEvent.getParameter("path");
            if (sPropertyPath === "/questions/current")
            {
                let oValue = Number(oEvent.getParameter("value"));
                if (!oValue) {
                    //TODO: No quiz in progress, redirect to main page
                } else {
                    this._bindQuestion(oValue);
                }
            }
        },

        _onShowCurrentQuestion: function()
        {
            let oQuestion = this._quiz.getModel().getProperty("/questions/current");
            this._bindQuestion(oQuestion);
        },

        _bindQuestion: function(oQuestion)
        {
            let sBindingPath = "/" + oQuestion.set + "/" + oQuestion.index + "/";
            this.getView().bindElement(sBindingPath);
            //TODO: Handle invalid question
        }

    });
 });