define([
	"backbone.marionette",
	"backbone.radio",
	"radio.shim",
    "text!templates/typeahead.html",
    "text!templates/optiontemplate.html"
], function (Marionette, Radio, Shim, TypeaHeadTemplate, OptionTemplate) {

	var TypeAhead = new Marionette.Application();
    TypeAhead.Channel = Radio.channel("typeahead");

    TypeAhead.OptionModel = Backbone.Model.extend();

    TypeAhead.OptionCollection = Backbone.Collection.extend({
        model: TypeAhead.OptionModel,
        comparator: "name"
    });

    TypeAhead.OptionItemView = Marionette.ItemView.extend({
        tagName: "li",
        template: _.template(OptionTemplate),
        events: {
            "click": "enterOption"
        },
        enterOption: function(event){
            TypeAhead.Channel.trigger("option:click", {
                option:this.model
            });
            // var searchinput = $(this.regions.searchbox).find("input");
            // var selectedItem = event.target.innerText;
            // searchinput.val(selectedItem);

            // this.cleanInput();
        }
    });

    TypeAhead.OptionCompositeView = Marionette.CompositeView.extend({
        tagName: "div",
        className: "typeahead",
        childView: TypeAhead.OptionItemView,
        childViewContainer: "ul",
        template: _.template(TypeaHeadTemplate),
        events: {
            'focusin .searchbox input': 'toggleMglass',
            'focusout .searchbox input': 'outMglass'
            // 'click .optionbox ul li'   : 'enterOption'
            // 'keyup .searchbox input': 'keynav',
        },
        onShow: function(){
            this.setDimentionOptionBox();
        },
        setDimentionOptionBox: function(){
            var heightContainer = this.options.containerHeight;
            var searchboxHeight = this.$el.find(".searchbox").height();
            var optionboxHeight = heightContainer - searchboxHeight;
            this.$el.find(".optionbox").css({ "top": searchboxHeight + "px" });
            this.$el.find(".optionbox ul").height(optionboxHeight + "px");
        },
        toggleMglass: function(){
            var searchinput = this.$el.find("input");
            var items = this.$el.find(".optionbox li");
            if( searchinput.val() != "" ){
            }else{
                searchinput.removeClass("mglass");
            }
            items.removeClass("selected");

        },
        outMglass: function(event){
            var searchinput = this.$el.find("input");
            var optionbox = this.$el.find(".optionbox");;
            if (searchinput.val() == '') {
                searchinput.addClass("mglass");
            }
        }
    });

    TypeAhead.on("start", function(options){
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
        optionArray.push({id: 11, name: "polilla", content: "negra"});
        optionArray.push({id: 12, name: "mantis", content: "verde"});
        optionArray.push({id: 13, name: "koala", content: "blanco"});
        optionArray.push({id: 14, name: "garza", content: "amarilla"});
        optionArray.push({id: 15, name: "hormiga", content: "cafe"});
        optionArray.push({id: 16, name: "pulga", content: "fuxia"});
        optionArray.push({id: 17, name: "mosca", content: "azul"});

        TypeAhead.optionCollection = new TypeAhead.OptionCollection(optionArray);
        TypeAhead.optionArrayPool = new TypeAhead.OptionCollection();
        TypeAhead.optionArrayPool.reset(TypeAhead.optionCollection.toArray());

        TypeAhead.RootView = new TypeAhead.OptionCompositeView({
            collection: TypeAhead.optionArrayPool,
            containerHeight: options.containerHeight
        });

        TypeAhead.Channel.reply("get:typeahead:root", function(){
            return TypeAhead.RootView;
        });

        TypeAhead.Channel.on("option:click", function(args){
            var option = args.option;
            console.log(option);
        });
    });

    return TypeAhead;
});
