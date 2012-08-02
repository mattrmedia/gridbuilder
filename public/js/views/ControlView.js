YUI.add('controlView', function(Y, name) {
  var ControlView = Y.Base.create("controlView", Y.View, [], {

      events: {
        '#grid-width': {keyup: 'widthChanged'},
        '#grid-columns': {keyup: 'columnsChanged'},
        '#grid-layout-fixed': {click: 'layoutChanged'},
        '#grid-gutter': {keyup: 'gutterChanged'},
        '#grid-layout-fluid': {click: 'layoutChanged'},
        '#grid-responsive-yes': {click: 'responsiveChanged'},
        '#grid-responsive-no': {click: 'responsiveChanged'},
        '#default-media-queries': {click: 'defaultMediaQueriesClicked'},
        '#add-media-queries': {click: 'addMediaQueryClicked'}
      },

      initializer: function (config) {
          var model = this.get("model");
          model.after("mediaQueriesChange", this.updateMediaQueries, this);
      },

      render: function () {
          var container = this.get('container');
          
           // Append the container element to the DOM if it's not on the page already.
          if (!container.inDoc()) {
              Y.one('body').append(container);
          }
      },

      widthChanged: function(e) {
          var width = parseInt(e.currentTarget._node.value, 10);
          this.get("model").set('width', width);
      },

      columnsChanged: function(e) {
          var numCol = parseInt(e.currentTarget._node.value, 10);
          this.get("model").set('columns', numCol);
      },

      layoutChanged: function(e) {
          var id = e.target._node.id,
              model = this.get("model");

          if (id === 'grid-layout-fixed') {
              model.set("usePixels", true);
          }
          else if (id === 'grid-layout-fluid') {
              model.set("usePixels", false);
          }
      },

      gutterChanged: function (e) {
        var gutter = parseInt(e.currentTarget._node.value, 10);
        this.get("model").set("gutter", gutter);
        Y.all('.demo-unit').setStyles({
          marginLeft: gutter/2 + 'px',
          marginRight: gutter/2 + 'px'
        });
      },

      responsiveChanged: function(e) {
          var id = e.target._node.id,
              model = this.get("model");

          if (id === 'grid-responsive-yes') {
              model.set("isResponsive", true);
              Y.all("#media-queries input[type='button']").set("disabled", false);

          }
          else if (id === 'grid-responsive-no') {
              model.set("isResponsive", false);

              //Disable Media Queries Buttons
              Y.all("#media-queries input[type='button']").set("disabled", true);
          }
      },

      defaultMediaQueriesClicked: function(e) {
          this.get("model").set("mediaQueries", this.get("defaultMediaQueries"));
      },

      addMediaQueryClicked: function(e) {
          alert("Add Media Queries Clicked");
      },

      updateMediaQueries: function (e) {
          Y.log(e);
          var html = "",
              i = 0,
              candyTemplate = this.get("candyTemplate");

          Y.log(candyTemplate);
          for (; i < e.newVal.length; i++) {
              html += Y.Lang.sub(candyTemplate, {mqId: e.newVal[i].id, content: e.newVal[i].id});
          }
          this.get("candyContainer").setHTML(html);

          this._mqSubscription = this.get("container").on("click", this.mediaQueryClicked, this);

      },

      mediaQueryClicked: function(e) {
        var mq, 
          defaultMq, 
          editMediaQueryView = this.get("editMediaQueryView");
        if (Y.one(e.target).hasClass("candy")) {
          mq = Y.one(e.target);
          
          //Get the appropriate media query object.
          defaultMq = Y.Array.find(this.get("defaultMediaQueries"), function(item) {
            return (item.id === mq.getAttribute("data-mqId")) ? true : false;
          }, this);

          if (editMediaQueryView === undefined) {
            editMediaQueryView = new Y.GB.EditMediaQueryView({model: new Y.Model(defaultMq)})
          }
          else {
            editMediaQueryView.set('model', new Y.Model(defaultMq));
          }

          this.set("editMediaQueryView", editMediaQueryView);
          editMediaQueryView.render();

        }
      },



      //Subscription object for the click handler on the media query candies
      _mqSubscription: undefined

  }, {
      ATTRS: {
          container: {
              valueFn: function () {
                  return Y.one("#controlPanel");
              }
          },
          model: {
              value: undefined
          },

          candyTemplate: {
              value: '<span class="candy yui3-u" data-mqId="{mqId}">{content}</span>'
          },

          candyContainer: {
              valueFn: function() {
                  return Y.one("#current-media-queries");
              }
          },

          defaultMediaQueries: {
              value: [
                  {
                      max: 767,
                      id: '< 768px',
                      collapse: 'all'
                  }
              ]
          },

          editMediaQueryView: {
            value: undefined
          }
      }
  });

  
	Y.namespace("GB").ControlView = ControlView;
	
}, '0.0.1', {
	requires: ['node', 'view', 'editMediaQueryView']
});

