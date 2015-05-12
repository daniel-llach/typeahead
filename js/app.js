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
        model: TypeAhead.OptionModel
    });

    TypeAhead.OptionItemView = Marionette.ItemView.extend({
        tagName: "li",
        template: _.template(OptionTemplate),
        events: {
            "click": "enterOption"
        },
        initialize: function(){
            this.listenTo(this.model, "change:selected", this.updateSelected);
        },
        enterOption: function(event){
            TypeAhead.Channel.trigger("option:click", {
                option:this.model
            });
            this.triggerMethod("optionClicked", {
                model: this.model
            });
        },
        updateSelected: function(){
            if(this.model.get("selected")){
                this.$el.addClass("selected");
            }
            else{
                this.$el.removeClass("selected");
            }
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
            'focusout .searchbox input': 'outMglass',
            // 'click .optionbox ul li'   : 'enterOption'
            'keyup .searchbox input': 'filterOptions'
        },
        childEvents: {
            "optionClicked": "optionClicked"
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
        optionClicked: function(view, args){
            this.updateSelected(args.model);
        },
        updateSelected: function(model){
            this.collection.each(function(option){
                if(option.cid === model.cid){
                    option.set({"selected": true});
                }
                else{
                    option.set({"selected": false});
                }
            });

            var searchinput = this.$el.find(".searchbox input");
            var selectedItem = model.get("name") + ": " + model.get("content");
            searchinput.val(selectedItem);
            this.outMglass();

            var index = this.collection.indexOf(model);
            this.adjustScroll(index);
        },
        toggleMglass: function(){
            var searchinput = this.$el.find("input");
            var items = this.$el.find(".optionbox li");
            if( searchinput.val() != "" ){
            }else{
                searchinput.removeClass("mglass");
            }
            items.removeClass("selected");
            searchinput.select();

        },
        outMglass: function(event){
            var searchinput = this.$el.find("input");
            var optionbox = this.$el.find(".optionbox");;
            if (searchinput.val() == '') {
                searchinput.addClass("mglass");
            }else{
                searchinput.removeClass("mglass");
            }
        },
        filterOptions: function(){
            var word = this.$el.find(".searchbox input").val();
            var word = word.toLowerCase();
            var optionArray = TypeAhead.optionCollection.filter(function(option){
                var nameContains = option.get("name").indexOf(word) != -1;
                var contentContains = option.get("content").indexOf(word) != -1;
                return nameContains || contentContains;
            });

            TypeAhead.optionArrayPool.reset(optionArray);
        },
        selectNext: function(){
            var currentOption = this.collection.findWhere({
                "selected": true
            });

            var index = this.collection.indexOf(currentOption);
            if(index < this.collection.length - 1){
                var nextOption = this.collection.at(index + 1);
                this.updateSelected(nextOption);
            }
        },
        selectPrev: function(){
            var currentOption = this.collection.findWhere({
                "selected": true
            });

            var index = this.collection.indexOf(currentOption);
            if(index > 0){
                var prevOption = this.collection.at(index - 1);
                this.updateSelected(prevOption);
            }
        },
        adjustScroll: function(index){
            var optionbox = this.$el.find(".optionbox");
            var ulItem = optionbox.find("ul");
            var item = optionbox.find("li.selected");
            var top = item.offset().top;
            var stepDown = ulItem.scrollTop() + item.outerHeight() * 2;
            var stepUp = ulItem.scrollTop() - item.outerHeight() * 2;
            if( top > optionbox.offset().top + optionbox.outerHeight() - item.outerHeight() * 2 ){
                ulItem.animate({scrollTop:stepDown}, '500', 'swing', function(){});
            }else if( top < optionbox.offset().top + item.outerHeight() * 2){
                ulItem.animate({scrollTop:stepUp}, '500', 'swing', function(){});
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
        });

        TypeAhead.Channel.comply("option:next", function(){
            TypeAhead.RootView.selectNext();
        });

        TypeAhead.Channel.comply("option:prev", function(){
            TypeAhead.RootView.selectPrev();
        });
    });

    return TypeAhead;
});
