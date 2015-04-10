/*global define*/
define([
    "marionette",
    "text!templates/optiontemplate.html",
    "text!templates/typeahead.html"
], function (Marionette, OptionTemplate, TypeaHead) {
    "use strict";
    /* crea nueva instancia de la app */
    var tpApp = new Backbone.Marionette.Application();

    /* agrega region inicial donde se muestra la app */
    tpApp.addRegions({
        /* referencia el contenedor en el html */
        container: "#somediv"
    });

    /* se define un modulo */
    tpApp.module("TpApp", function(TpModule, TpApp, Backbone, Marionette, $, _){

        /* definicion del modelo de opciones */
        TpModule.OptionModel = Backbone.Model.extend({
            defaults: {
                id: "",
                name: "",
                content: ""
            }
        });

        /* definicion de la coleccion de opciones */
        TpModule.OptionCollection = Backbone.Collection.extend({
            /* indica modelo de la collecion */
            model: TpModule.OptionModel,

            /* campo por el que se ordena */
            comparator: "content"
        });

        /* definicion de vista de item individuales */
        TpModule.OptionItemView = Marionette.ItemView.extend({
            tagName: "li",

            /* indica el template a utilizar */
            template: _.template(OptionTemplate),

            /* indica el orden de llamadas de métodos */
            initialize: function() { console.log("OptionItemView: initialize >> " + this.model.get("name")) },
            onRender: function() { console.log("OptionItemView: onRender >> " + this.model.get("name")) },
            onShow: function() { console.log("OptionItemView: onShow >> " + this.model.get("name")) }
        });

        /* definicion de colleccion de vistas */
        TpModule.OptionCollectionView = Marionette.CollectionView.extend({
            tagName: "ul",

            /* indica itemview aplicado a cada modelo de la coleccion */
            childView: TpModule.OptionItemView,

            initialize: function() { console.log("OptionItemView: initialize") },
            onRender: function() { console.log("OptionItemView: onRender") },
            onShow: function() { console.log("OptionItemView: onShow") }
        });

        /* define un layoutview */
        TpModule.TpAppLayoutView = Marionette.LayoutView.extend({

            /* tipo de elemento del DOM */
            tagName: "div",

            /* clase del contenedor */
            className: "typeahead",

            /* indica template del layout */
            template: _.template(TypeaHead),

            /* indica regiones del layout */
            regions: {
                searchbox: ".searchbox",
                optionbox: ".optionbox"
            },

            /* lo que se ejecuta antes que se muestre la vista */
            initialize: function() {
                console.log('TpAppLayoutView: initialize');
            },

            /* lo que se ejecuta despues que la vista se renderiza (vistas anidadas aqui!) */
            onRender: function() {
                console.log('TpAppLayoutView: onRender');

                /* crea la lista de opciones a mostrar en el typeahead */
                var optionArray = [];
                optionArray.push({id: 1, name: "opcion1", content: "contenido1"});
                optionArray.push({id: 2, name: "opcion2", content: "contenido2"});
                optionArray.push({id: 3, name: "opcion3", content: "contenido3"});
                optionArray.push({id: 4, name: "opcion4", content: "contenido4"});
                optionArray.push({id: 5, name: "opcion5", content: "contenido5"});

                /* crea la coleccion usando la lista de opciones en la coleccion de opciones a mostrar */
                var optionCollection = new TpModule.OptionCollection(optionArray);

                /* crea nueva instancia de vistas para la coleccion creada */
                var optionCollectionView = new TpModule.OptionCollectionView({collection: optionCollection});

                /* muestra la coleccion en la region que corresponde (optionbox) */
                this.optionbox.show(optionCollectionView);
            },

            /* se ejecuta despues que se muestra la vista */
            onShow: function(){
                console.log('TpAppLayoutView: onShow');
            }

        });

        /* indicar al modulo que hacer despues que se carga */
        TpModule.addInitializer(function(){
            /* crea nueva instancia del layout desde el modulo */
            var tpAppLayout = new TpModule.TpAppLayoutView();

            /* muestra el layout en la region definida */
            TpApp.container.show(tpAppLayout);
        });

    });



    return tpApp;
});
