'use strict';

(function () {
  var menu = document.querySelector('.main-nav');
  menu.classList.remove('main-nav--nojs');

  var toggleButton = menu.querySelector('.main-nav__toggle');

  var openCloseMenu = function () {
    if (menu.classList.contains('main-nav--closed')) {
      menu.classList.remove('main-nav--closed');
      menu.classList.add('main-nav--opened');
    } else {
      menu.classList.remove('main-nav--opened');
      menu.classList.add('main-nav--closed');
    }
  };

  toggleButton.addEventListener('click', openCloseMenu);
})();
