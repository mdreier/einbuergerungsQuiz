sap.ui.define([
    "sap/m/Shell",
    "sap/ui/core/ComponentContainer"
], function(Shell, ComponentContainer) {
    new Shell({
        title: "EinbürgerungsQuiz",
        app: new ComponentContainer({
            name : "de.martindreier.ebq",
            settings : {
                id : "einbuergerungsquiz"
            }
        })
    }).placeAt("content");
});