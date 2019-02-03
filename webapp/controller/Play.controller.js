sap.ui.define([
    "de/martindreier/ebq/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/MessageType"
 ], function (BaseController, JSONModel, MessageType) {
    "use strict";
    return BaseController.extend("de.martindreier.ebq.controller.Play", {
        
        onInit: function() {
            this._quiz = this.getComponent().getQuiz();
            this._quiz.attachQuestionChange(this._onQuestionUpdate, this);
            this._quiz.attachQuizEnd(this._onQuizEnd, this);
            this.getRouter().getRoute("play").attachPatternMatched(this._onShowCurrentQuestion, this);
            
            let oModel = new JSONModel({
                resultsActive: false
            });
            this.getView().setModel(oModel, "view");
        },

        onAnswer: function(oEvent)
        {
            let oItem = oEvent.getSource();
            this._bLastCorrect = oItem.getBindingContext().getProperty("correct");
            if (this._bLastCorrect)
            {
                oItem.setIcon("sap-icon://accept");
                oItem.setHighlight(MessageType.Success);
            } else {
                oItem.setIcon("sap-icon://decline");
                oItem.setHighlight(MessageType.Error);
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
            for (let oItem of this.getView().byId("questions").getItems())
            {
                oItem.setIcon();
                oItem.setHighlight(MessageType.None);
            }
        },

        _onQuizEnd: function()
        {
            this.getRouter().navTo("results");
        }

    });
 });