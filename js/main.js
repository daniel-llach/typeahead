"use strict";

require.config({
    paths : {
        backbone : "../bower_components/backbone/backbone",
        underscore : "../bower_components/underscore/underscore",
        jquery : "../bower_components/jquery/dist/jquery",
        "backbone.marionette" : "../bower_components/backbone.marionette/lib/core/backbone.marionette",
        "backbone.radio" : "../bower_components/backbone.radio/build/backbone.radio",
        "backbone.babysitter" : "../bower_components/backbone.babysitter/lib/backbone.babysitter",
        text: "../bower_components/requirejs-text/text"
    },
    enforceDefine: true,
    map: {
        '*': {
            'backbone.wreqr': 'backbone.radio'
        }
    }
});

define([
    "backbone.marionette",
    "backbone.radio",
    "radio.shim",
    "app"
], function (Marionette, Radio, Shim, App) {
    window.Radio = Radio;

    var SomeRegion = Marionette.Region.extend();

    var somediv = new SomeRegion({
        el: "#somediv"
    });

    var app1 = new App("ty1");

    app1.start({
        containerHeight: somediv.$el.outerHeight()
    });

    var app1Channel = Radio.channel("ty1");
    var app1View = app1Channel.request("get:typeahead:root");

    somediv.show(app1View);

    var someotherdiv = new SomeRegion({
        el: "#someotherdiv"
    });

    var app2 = new App("ty2");

    app2.start({
        containerHeight: someotherdiv.$el.outerHeight()
    });

    var app2Channel = Radio.channel("ty2");
    var app2View = app2Channel.request("get:typeahead:root");

    someotherdiv.show(app2View);


});
