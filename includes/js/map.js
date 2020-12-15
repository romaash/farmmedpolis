ymaps.ready(initMap);
window.yMaps = [];
function initMap() {
  console.log($("*[data-map]"));
  $("*[data-map]").each(function(i){
    var data = JSON.parse($(this).attr("data-map"));
    $(this).attr("data-map-index", i+"");

    var point = [data.point[0], data.point[1]];

    var myMap = new ymaps.Map($(this)[0], {
        center: point,
        zoom: data.zoom,
        controls: []
    });

    var MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
      '<div class="popup-container">' +
          '<div class="arrow"></div>' +
          '<div class="popup-bubble active">' +
            '$[[options.contentLayout observeSize minWidth=235 maxWidth=235 maxHeight=350]]' +
          '</div>' +
      '</div>', {

        build: function () {
          this.constructor.superclass.build.call(this);
          this._$element = $('.popup-bubble', this.getParentElement());
          this.applyElementOffset();
        },
        clear: function () {
          this.constructor.superclass.clear.call(this);
        },
        onSublayoutSizeChange: function () {
          MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);
          if(!this._isElement(this._$element)) { return; }
          this.applyElementOffset();
          this.events.fire('shapechange');
        },
        applyElementOffset: function () {
          this._$element.css({
            left: -(this._$element[0].offsetWidth / 2),
            top: -(this._$element[0].offsetHeight)
          });
        },
        onCloseClick: function (e) {
          e.preventDefault();
          this.events.fire('userclose');
        },
        getShape: function () {
          if(!this._isElement(this._$element)) {
            return MyBalloonLayout.superclass.getShape.call(this);
          }
          var position = this._$element.position();
          return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
            [position.left, position.top], [
              position.left + this._$element[0].offsetWidth,
              position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
            ]
          ]));
        },
        _isElement: function (element) {
          return element && element[0] && element.find('.arrow')[0];
        }

      }
    );

    var MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass('$[properties.content]');

    myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
      content: data.content
    }, {
      iconLayout: 'default#image',
      iconImageHref: 'includes/img/icons/pin.svg',
      iconImageSize: [50, 50],
      iconImageOffset: [-25, -25],
      balloonShadow: false,
      balloonLayout: MyBalloonLayout,
      balloonContentLayout: MyBalloonContentLayout,
      balloonPanelMaxMapArea: 0,
      hideIconOnBalloonOpen: false
    });

    myMap.geoObjects.add(myPlacemark);

    if (data.route != undefined) {
      var line = [];

      var myPolyline = new ymaps.Polyline(data.route, {
            hasBalloon: false
        }, {
            balloonCloseButton: false,
            strokeColor: "#59C13F",
            strokeWidth: 8
        });

      myMap.geoObjects.add(myPolyline);
    }

    if (window.matchMedia("(max-width: 767px)").matches) {
      myMap.behaviors.disable('drag');
    }

    window.yMaps[i+""] = myMap;
  });
}