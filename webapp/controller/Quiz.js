sap.ui.define([
    "sap/ui/base/EventProvider",
    "sap/ui/model/json/JSONModel",
 ], function (EventProvider, JSONModel) {
    "use strict";

    var mSettings = {
        globalQuestionCount: 5,
        stateQuestionCount: 2,
        winCount: 5
    };

    const EVENT_QUESTION_CHANGE = "questionChange";

    return EventProvider.extend("de.martindreier.ebq.controller.Quiz", {
        
        /**
         * Create a new Quiz instance.
         * @param {sap.ui.base.ManagedObject} oManagedObject Managed object which will hold the quiz model.
         */
        constructor: function(oManagedObject) {
            EventProvider.apply(this);
            
            this._oModel = new JSONModel({
                questions: {
                    count: 0,                       //Count of questions in this quiz
                    number: 0,                      //Current question number in this quiz
                    current: {                      //Index of the current question in the map of questions
                        set: "global",
                        index: 0
                    },
                    selected: []
                }
            });

            if (oManagedObject && oManagedObject.setModel) {
                oManagedObject.setModel(this._oModel, "quiz");
            }
        },

        /**
         * Get the quiz model.
         * @returns {sap.ui.model.json.JSONModel} Quiz model instance.
         */
        getModel: function() {
            return this._oModel;
        },

        init: function(iGlobalQuestionsCount, iStateQuestionsCount, sState) {
            
            let aGlobalQuestions = this._pickQuestions("global", iGlobalQuestionsCount, mSettings.globalQuestionCount);
            let aStateQuestions = [];

            if (typeof sState === "string" && sState.length === 2) {
                aStateQuestions = this._pickQuestions(sState, iStateQuestionsCount, mSettings.stateQuestionCount);
            }

            let aQuestions = [...aGlobalQuestions, ...aStateQuestions];
            this._shuffle(aQuestions);
            this._oModel.setProperty("/questions/selected", aQuestions);
            this._oModel.setProperty("/questions/count", aQuestions.length);
            this.nextQuestion();
        },

        /**
         * Determine the next question. Question will be updated in the model.
         * @param {boolean} bLastCorrect 
         */
        nextQuestion: function(bLastCorrect) {
            //TODO: Count correct answers
            let iNextQuestion = this._oModel.getProperty("/questions/number");
            let aQuestions = this._oModel.getProperty("/questions/selected");
            let oNextQuestion = aQuestions[iNextQuestion]
            this._oModel.setProperty("/questions/current", oNextQuestion);
            this._oModel.setProperty("/questions/number", ++iNextQuestion);
            this.fireEvent(EVENT_QUESTION_CHANGE, {
                nextQuestion: oNextQuestion
            }, true, true);
        },

        attachQuestionChange: function(oData, fnHandler, oListener) {
            this.attachEvent(EVENT_QUESTION_CHANGE, oData, fnHandler, oListener);
        },

        detachQuestionChange: function(fnHandler, oListener) {
            this.detachEvent(EVENT_QUESTION_CHANGE, fnHandler, oListener);
        },

        /**
         * Produce a list of questions.
         * @param {string} sSetName Name of the set of questions.
         * @param {number} iQuestionCount Count of questions in the set.
         * @param {number} iPicks Number of questions to pick.
         */
        _pickQuestions: function(sSetName, iQuestionCount, iPicks) {
            let aIndices = [], index = 0;
            //Build shuffled array of indices
            while (index < iQuestionCount) {
                aIndices.push(index++);
            }
            this._shuffle(aIndices);
            let aQuestions = [];
            //Select first indices up to number of picks and generate questions
            for (let iIndex of aIndices.slice(0, iPicks)) {
                aQuestions.push({set: sSetName, index: iIndex});
            }
            return aQuestions;
        },

        /**
         * Shuffle using Fisher-Yates algorithm.
         * See https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle.
         * @param {array} aValues Array will be shuffled in place.
         */
        _shuffle: function(aValues) {
            for (let i = aValues.length -1; i > 0; i--)
            {
                let j = Math.floor(Math.random() * (i+1));
                [aValues[i], aValues[j]] = [aValues[j], aValues[i]];
            }
        }

    });
 });