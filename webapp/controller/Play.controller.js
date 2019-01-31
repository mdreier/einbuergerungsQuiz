sap.ui.define([
    "de/martindreier/ebq/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/ButtonType"
 ], function (BaseController, JSONModel, ButtonType) {
    "use strict";
    return BaseController.extend("de.martindreier.ebq.controller.Play", {
        
        onInit: function() {
            this._quiz = this.getComponent().getQuiz();
            this._quiz.attachQuestionChange(this._onQuestionUpdate, this);
            this.getRouter().getRoute("play").attachPatternMatched(this._onShowCurrentQuestion, this);
            
            let oModel = new JSONModel({
                resultsActive: false
            });
            this.getView().setModel(oModel, "view");
        },

        onAnswer: function(oEvent)
        {
            let oButton = oEvent.getSource();
            this._bLastCorrect = oButton.getBindingContext().getProperty("correct");
            if (this._bLastCorrect)
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
            this._quiz.nextQuestion(this._bLastCorrect);
            this._resetButtons();
            //TODO: Load next question
        },

        _onQuestionUpdate: function(oEvent)
        {
            let oNextQuestion = oEvent.getParameter("nextQuestion");
            if (oNextQuestion)
            {
                this._bindQuestion(oNextQuestion);
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