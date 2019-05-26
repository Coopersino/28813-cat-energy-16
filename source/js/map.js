'use strict';

(function () {
  var Coord = {
    mobile: {
      X: 59.93905175,
      Y: 30.32380109
    },
    desktop: {
      X: 59.93918535,
      Y: 30.31931648
    }
  };
  var DesktopWidth = 1300;

  ymaps.ready(mapInit);

  function mapInit() {
    var map = document.querySelector('.map');
    var placemark, pin ,centerX, centerY;

    if (window.innerWidth < DesktopWidth) {
      centerX = Coord.mobile.X;
      centerY = Coord.mobile.Y;
    } else {
      centerX = Coord.desktop.X;
      centerY = Coord.desktop.Y;
    }

    map = new ymaps.Map(map, {
      center: [centerX, centerY],
      zoom: 17
    });

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      map.behaviors.disable('drag');
    }

    map.controls
      .remove('geolocationControl')
      .remove('searchControl')
      .remove('trafficControl')
      .remove('typeSelector')
      .remove('rulerControl');

    pin = new ymaps.GeoObjectCollection({}, {
      iconLayout: 'default#image',
      iconImageHref: 'img/map-pin.png',
      iconImageSize: [124, 106],
      iconImageOffset: [-60, -90]
    });

    placemark = new ymaps.Placemark([59.93881674, 30.32314423], {

    });

    pin.add(placemark);
    map.geoObjects.add(pin);

  }
})();
