//alert('tinybo load');

function deviceReady() {

(function() {

  alert("device ready");

  var Status = Backbone.Model.extend({

    defaults: {
      created_at: new Date(),
      id: 0,
      text: "",
      source: "新浪微博",
      reposts_count: 0,
      comments_count: 0
    },

    initialize: function() {
    }
  });

  var Statuses = Backbone.Collection.extend({

    model: Status,

    url: 'https://api.weibo.com/2/statuses/home_timeline.json',

    sync: function(method, model, options) {
      sina.weibo.get("https://api.weibo.com/2/statuses/home_timeline.json", {
        access_token : localStorage.getItem('access_t'),
      }, function(response) {
        options.success(JSON.parse(response));
        console.log("sync success");
        //var data = stringToJSON(response);
        //alert('statuses[0].text: ' + data.statuses[0].text);
      }, function(response) {
        console.log('error: ' + response);
      });
      /*
      var that = this;
      var params = _.extend({
        type: 'GET',
        dataType: 'jsonp',
        url: that.url,
        processData: false
      }, options);

      return $.ajax(params);
      */
    },

    parse: function(response) {
      console.log(JSON.stringify(response));
      return response;
    }
    //localStorage: new Store("statuses-backbone")
  });

  var statuses = new Statuses;

  var StatusView = Backbone.View.extend({

    tagName: "li",

    template: _.template($('#status-item-template').html()),

    events: {
    },

    initialize: function() {
      _.bindAll(this, 'render');
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    }
  });

  var StatusesView = Backbone.View.extend({

    el: $('#statuses'),

    initialize: function() {
      _.bindAll(this, 'render', 'addOne', 'addAll');

      statuses.bind('add', this.addOne);
      statuses.bind('reset', this.addAll);
      statuses.bind('all', this.render);

      statuses.fetch();
    },

    render: function() {
    },

    addOne: function(status) {
      var view = new StatusView({model: status});
      this.$('#status-list').append(view.render().el);
    },

    addAll: function() {
      statuses.each(this.addOne);
    }
  });

  var statusesView = new StatusesView;

})();

}