/*global define*/
define([
    "marionette",
    "text!templates/typeahead.html",
    "text!templates/optiontemplate.html"
], function (Marionette, TypeaHeadTemplate, OptionTemplate) {
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
            comparator: "name"
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

            initialize: function() {
                console.log("OptionItemView: initialize");
                this.listenTo(this.collection, "reset", this.render);
             },
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
            template: _.template(TypeaHeadTemplate),

            /* indica regiones del layout */
            regions: {
                searchbox: ".searchbox",
                optionbox: ".optionbox"
            },

            events: {
                // 'focusin .searchbox input': 'toggleMglass',
                'keyup .searchbox input': 'keynav',
                'click .optionbox ul li'   : 'enterOption'
                // 'focusout .searchbox input': 'cleanInput'
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
                optionArray.push({id: 1, name: "gato", content: "gris"});
                optionArray.push({id: 2, name: "perro", content: "blanco"});
                optionArray.push({id: 3, name: "ardilla", content: "rojo"});
                optionArray.push({id: 4, name: "mono", content: "cafe"});
                optionArray.push({id: 5, name: "paloma", content: "amarillo"});
                optionArray.push({id: 6, name: "conejo", content: "gris"});
                optionArray.push({id: 7, name: "avestruz", content: "blanco"});
                optionArray.push({id: 8, name: "gusano", content: "rojo"});
                optionArray.push({id: 9, name: "pollo", content: "cafe"});
                optionArray.push({id: 10, name: "rinoceronte", content: "amarillo"});

                /* crea la coleccion usando la lista de opciones en la coleccion de opciones a mostrar */
                TpModule.optionCollection = new TpModule.OptionCollection(optionArray);

                /* crea array de trabajo */
                TpModule.optionArrayPool = new TpModule.OptionCollection();
                TpModule.optionArrayPool.reset(TpModule.optionCollection.toArray());

                /* crea nueva instancia de vistas para la coleccion creada */
                var optionCollectionView = new TpModule.OptionCollectionView({collection: TpModule.optionArrayPool});

                /* muestra la coleccion en la region que corresponde (optionbox) */
                this.optionbox.show(optionCollectionView);
            },

            /* se ejecuta despues que se muestra la vista */
            onShow: function(){
                console.log('TpAppLayoutView: onShow');
                this.setDimentionSearchBox();
            },

            setDimentionSearchBox: function(){

                var heightContainer = TpApp.container.$el.height();
                $(this.regions.searchbox).find("input").css({
                    "height": heightContainer,
                });
                $(this.regions.optionbox).css({
                    "top": heightContainer,
                });
            },

            // toggleMglass: function(){
            //     var searchinput = $(this.regions.searchbox).find("input");
            //     var items = $(this.regions.optionbox).find("li");
            //     if( searchinput.val() != "" ){
            //         // searchinput.addClass("mglass");
            //     }else{
            //         searchinput.removeClass("mglass");
            //     }
            //     $(this.regions.optionbox).toggleClass("show");
            //     items.removeClass("selected");
            // },

            keynav: function(event){
                var searchinput = $(this.regions.searchbox).find("input");
                var optionbox = $(this.regions.optionbox);
                var itemUl = $(this.regions.optionbox).find("ul");
                var items = $(this.regions.optionbox).find("li");
                var totalItems = $(this.regions.optionbox).find("li").size();
                var index = itemUl.find('.selected').index();
                var selectItem = $(this.regions.optionbox).find(".selected").text();
                var word = searchinput.val();

                event.preventDefault();

                // // muestra optiones disponibles
                // TpModule.optionArrayPool.reset(arreglo);
                // optionbox.show();

                if (event.keyCode == 40){
                    // down
                    var arreglo = TpModule.optionCollection.filter(function(option){
                        return option.get("name").indexOf(word) != -1;
                    });

                    console.log(index);
                    items.removeClass("selected");
                    if(index < 0){
                        optionbox.show();
                        TpModule.optionArrayPool.reset(arreglo);
                        itemUl.find("li:first-child").addClass("selected");
                    }else if(index == totalItems-1){
                        itemUl.find("li").eq(totalItems-1).addClass("selected");
                    }else {
                        itemUl.find("li").eq(index + 1).addClass("selected");
                    }
                    this.evaluateOptions(itemUl, items, totalItems, index);

                    console.log(index);

                    // scroll cada 5 item + alto ul
                    if ( index == 0){

                    }else{
                        if( index % 5 === 0){
                            // alert('ok');
                            var alto = itemUl.height();
                            itemUl.scrollTop(+alto);
                        }

                    }

                }else if (event.keyCode == 38){
                    // up
                    items.removeClass("selected");
                    if(index > totalItems){
                        itemUl.find("li:last-child").addClass("selected");
                    }else if(index == 0){
                        itemUl.find("li:first-child").addClass("selected");
                    }else{
                        itemUl.find("li").eq(index - 1).addClass("selected");
                    }

                    // scroll cada 5 item - alto ul
                    if ( index == 0){

                    }else{
                        if( index % 5 === 0){
                            // alert('ok');
                            var alto = itemUl.height();
                            itemUl.scrollTop(-alto);
                        }
                    }
                }else if (event.keyCode == 13){
                    searchinput.val(selectItem);
                }else if (event.keyCode == 27){
                    this.cleanInput();
                    searchinput.blur();
                }else{
                    this.filter(searchinput, optionbox, items, word);
                }
            },

            enterOption: function(event){
                event.stopPropagation();

                var searchinput = $(this.regions.searchbox).find("input");
                var selectedItem = event.target.innerText;
                searchinput.val(selectedItem);


                this.cleanInput();


            },

            cleanInput: function(){
                var searchinput = $(this.regions.searchbox).find("input");
                if( searchinput.val() != "" ){
                    searchinput.removeClass("mglass");
                }else{
                    searchinput.addClass("mglass");
                }
                $(this.regions.optionbox).toggleClass("show");

            },

            evaluateOptions: function(itemUl, items, totalItems, index){

                if(index == -1){
                    items.show();
                }
            },

            filter: function(searchinput, optionbox, items, word){
                var arreglo = TpModule.optionCollection.filter(function(option){
                    return option.get("name").indexOf(word) != -1;
                });

                TpModule.optionArrayPool.reset(arreglo);

                // this.caseSensitive();

                optionbox.show();
            },

            caseSensitive: function(){
                // case sensitive
                $.extend($.expr[":"], {
                    "containsIN": function(elem, i, match, array) {
                    return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
                    }
                });
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
