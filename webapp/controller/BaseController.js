sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/base/strings/formatMessage",
    "sap/ui/core/Component",
    "sap/ui/core/UIComponent"
 ], function (Controller, formatMessage, Component, UIComponent) {
    "use strict";
    return Controller.extend("de.martindreier.ebq.controller.BaseController", {
        
        formatMessage: formatMessage,

        getComponent: function() {
            return Component.getOwnerComponentFor(this.getView());
        },

        getRouter: function() {
            return UIComponent.getRouterFor(this);
        }

    });
 });