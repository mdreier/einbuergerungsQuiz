sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/json/JSONModel",
 ], function (Object, JSONModel) {
    "use strict";

    var mSettings = {
        questionCount: 5,
        winCount: 5
    }

    return Object.extend("de.martindreier.ebq.controller.Quiz", {
        
        constructor: function() {

            this._oModel = new JSONModel({
                questions: {
                    count: mSettings.questionCount, //Count of questions in this quiz
                    number: 1,                      //Current question number in this quiz
                    current: {                      //Index of the current question in the map of questions
                        set: "global",
                        index: 0
                    }
                }
            });

        },

        getModel: function() {
            return this._oModel;
        }

    });
 });