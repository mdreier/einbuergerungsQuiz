sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/base/strings/formatMessage"
 ], function (Controller, JSONModel, formatMessage) {
    "use strict";
    return Controller.extend("de.martindreier.ebq.controller.Start", {
        formatMessage: formatMessage
    });
 });