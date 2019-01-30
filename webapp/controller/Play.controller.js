sap.ui.define([
    "de/martindreier/ebq/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/ButtonType"
 ], function (BaseController, JSONModel, ButtonType) {
    "use strict";
    return BaseController.extend("de.martindreier.ebq.controller.Play", {
        
        onInit: function() {
            this._quiz = this.getComponent().getQuiz();
            this._quiz.getModel().attachPropertyChange(this._onQuestionUpdate, this);
            this.getRouter().getRoute("play").attachPatternMatched(this._onShowCurrentQuestion, this);
            
            let oModel = new JSONModel({
                resultsActive: false
            });
            this.getView().setModel(oModel, "view");
        },

        onAnswer: function(oEvent)
        {
            let oButton = oEvent.getSource();
            let bCorrect = oButton.getBindingContext().getProperty("correct");
            if (bCorrect)
            {
                oButton.setType(ButtonType.Accept);
            } else {
                oButton.setType(ButtonType.Reject);
            }
            this.getView().getModel("view").setProperty("/resultsActive", true);
        },

        onNextQuestion: function()
        {
            this.getView().getModel("view").setProperty("/resultsActive", false);
            this._resetButtons();
            //TODO: Load next question
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
        },

        _resetButtons: function()
        {
            for (let oButton of this.getView().byId("questionsSection").getItems())
            {
                oButton.setType(ButtonType.Default);
            }
        }

    });
 });