sap.ui.define([
    "sap/ui/base/EventProvider",
    "sap/ui/model/json/JSONModel",
    "sap/base/util/deepClone"
 ], function (EventProvider, JSONModel, deepClone) {
    "use strict";

    var mSettings = {
        globalQuestionCount: 30,
        stateQuestionCount: 3,
        winCount: 17
    };

    var mInitialState = {
        questions: {
            count: 0,                       //Count of questions in this quiz
            number: 0,                      //Current question number in this quiz
            current: {                      //Index of the current question in the map of questions
                set: "global",
                index: 0
            },
            selected: []
        },
        results: {
            correct: 0,
            incorrect: 0,
            passed: false
        },
        ended: false
    };

    /**
     * Event: Question was changed.
     */
    const EVENT_QUESTION_CHANGE = "questionChange";
    /**
     * Event: Quiz has ended.
     */
    const EVENT_QUIZ_END = "quizEnd";
    
    return EventProvider.extend("de.martindreier.ebq.controller.Quiz", {
        
        /**
         * Create a new Quiz instance.
         * @param {sap.ui.base.ManagedObject} oManagedObject Managed object which will hold the quiz model.
         */
        constructor: function(oManagedObject) {
            EventProvider.apply(this);
            
            this._oModel = new JSONModel();

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

        /**
         * Initialize the quiz.
         * @param {number} iGlobalQuestionsCount Number of global questions available in catalog
         * @param {number} iStateQuestionsCount Number of state questions available catalog
         * @param {string} sState Selected state, "de" for no state selection
         */
        init: function(iGlobalQuestionsCount, iStateQuestionsCount, sState) {
            //Set or reset model into initial state
            this._oModel.setData(deepClone(mInitialState));

            //Pick global questions
            let aGlobalQuestions = this._pickQuestions("global", iGlobalQuestionsCount, mSettings.globalQuestionCount);
            let aStateQuestions = [];

            //Pick state questions
            if (typeof sState === "string" && sState.length === 2 && sState !== "de") {
                aStateQuestions = this._pickQuestions(sState, iStateQuestionsCount, mSettings.stateQuestionCount);
            }

            //Shuffle selected questions so that global and state questions
            // are mixed
            let aQuestions = [...aGlobalQuestions, ...aStateQuestions];
            this._shuffle(aQuestions);
            this._oModel.setProperty("/questions/selected", aQuestions);
            this._oModel.setProperty("/questions/count", aQuestions.length);

            //Set first question to get started
            this.nextQuestion();
        },

        /**
         * Determine the next question. Question will be updated in the model.
         * @param {boolean} bLastCorrect 
         */
        nextQuestion: function(bLastCorrect) {
            if (bLastCorrect !== undefined) {
                this._recordAnswer(bLastCorrect);
            }
            let iNextQuestion = this._oModel.getProperty("/questions/number");
            let iNumQuestions = this._oModel.getProperty("/questions/count");
            if (iNextQuestion === iNumQuestions)
            {
                //End of quiz reached
                this._quizEnd();
            } else {
                this._nextQuestion();
            }
        },

        attachQuestionChange: function(oData, fnHandler, oListener) {
            this.attachEvent(EVENT_QUESTION_CHANGE, oData, fnHandler, oListener);
        },

        detachQuestionChange: function(fnHandler, oListener) {
            this.detachEvent(EVENT_QUESTION_CHANGE, fnHandler, oListener);
        },

        attachQuizEnd: function(oData, fnHandler, oListener) {
            this.attachEvent(EVENT_QUIZ_END, oData, fnHandler, oListener);
        },

        detachQuizEnd: function(fnHandler, oListener) {
            this.detachEvent(EVENT_QUIZ_END, fnHandler, oListener);
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
        },

        /**
         * Process end of quiz.
         */
        _quizEnd: function() {
            this._oModel.setProperty("/ended", true);
            this.fireEvent(EVENT_QUIZ_END, undefined, true, true);
        },

        /**
         * Switch to the next question.
         */
        _nextQuestion: function() {
            let iNextQuestion = this._oModel.getProperty("/questions/number");
            let aQuestions = this._oModel.getProperty("/questions/selected");
            let oNextQuestion = aQuestions[iNextQuestion]
            this._oModel.setProperty("/questions/current", oNextQuestion);
            this._oModel.setProperty("/questions/number", ++iNextQuestion);
            this.fireEvent(EVENT_QUESTION_CHANGE, {
                nextQuestion: oNextQuestion
            }, true, true);
        },

        /**
         * Record the answer and calculate overall result.
         * @param {boolean} bCorrectAnswer Answer to be recorded.
         */
        _recordAnswer: function(bCorrectAnswer) {
            //Determine property path to counter
            let sPropertyPath = bCorrectAnswer ? "/results/correct" : "/results/incorrect";
            //Update counter
            let iCount = this._oModel.getProperty(sPropertyPath);
            this._oModel.setProperty(sPropertyPath, ++iCount);
            //Check if test is passed, only required if last answer was correct as initial result is
            // not passed and an incorrect answer cannot change this to a passed result.
            if (bCorrectAnswer && iCount >= mSettings.winCount)
            {
                this._oModel.setProperty("/results/passed", true);
            }
        }

    });
 });