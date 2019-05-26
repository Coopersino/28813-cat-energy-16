'use strict';

(function () {
  var PinValue = {
    Min: 0,
    Max: 100,
    MobileMin: 27,
    MobileMax: 74
  };

  var PictureWidth = {
    Min: 0,
    Max: 100
  };

  var TabletWidth = 768;

  var slider = document.querySelector('.slider'),
    sliderPicture = slider.querySelector('.slider__item--before'),
    sliderLine = slider.querySelector('.slider__controls-bar'),
    sliderPin = slider.querySelector('.slider__controls-toggle'),
    sliderButtonBefore = slider.querySelector('.slider__control--before'),
    sliderButtonAfter = slider.querySelector('.slider__control--after');

  var setPicWidth = function (value) {
    sliderPicture.style.width = PictureWidth.Max - value + '%';
  };

  var setPinPosition = function (value) {
    sliderPin.style.left = value + '%';
  };

  var changePicture = function (direction) {
    if (window.innerWidth < TabletWidth) {
      if (direction < 0) {
        setPicWidth(PictureWidth.Min);
        sliderPin.style.left = PinValue.MobileMin + '%';
      } else {
        setPicWidth(PictureWidth.Max);
        sliderPin.style.left = PinValue.MobileMax + '%';
      }
    } else {
      if (direction < 0) {
        setPicWidth(PictureWidth.Min);
        sliderPin.style.left = PinValue.Min + '%';
      } else {
        setPicWidth(PictureWidth.Max);
        sliderPin.style.left = PinValue.Max + '%';
      }
    }
  };

  var onMouseDown = function (evt) {
    var startCoord = evt.clientX,
      sliderLineRect = sliderLine.getBoundingClientRect(),
      clickedPosition = (startCoord - sliderLineRect.left) / sliderLineRect.width * 100;

    setPinPosition(clickedPosition);
    setPicWidth(clickedPosition);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoord - moveEvt.clientX;
      startCoord = moveEvt.clientX;

      var movePosition = (sliderPin.offsetLeft - shift) / sliderLineRect.width * 100;

      if (movePosition <= PinValue.Min) {
        movePosition = PinValue.Min;
      } else if (movePosition >= PinValue.Max) {
        movePosition = PinValue.Max;
      }

      setPinPosition(movePosition);
      setPicWidth(movePosition);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  sliderButtonBefore.addEventListener('click', function () {
    changePicture(-1);
  });

  sliderButtonAfter.addEventListener('click', function () {
    changePicture(1);
  });

  sliderLine.addEventListener('mousedown', onMouseDown);
})();
