'use strict';

(function () {
  if (document.querySelector('.intro__text')) {
    var container = document.querySelector('.intro__text');

    container.addEventListener('click', function (evt) {
      evt.preventDefault();

      if (evt.target.getAttribute('href')) {
        var href = evt.target.getAttribute('href');
        var offsetTop = document.querySelector(href).offsetTop;

        scroll({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  }
})();

(function () {
  if (document.querySelectorAll('.callback-form form')) {
    var callbackForms = document.querySelectorAll('.callback-form form');

    if ((document.querySelector('input[name="name"]')) &&
      (document.querySelector('input[type="tel"]')) &&
      (document.querySelector('textarea'))) {
      callbackForms.forEach(function (form) {
        var userName = form.querySelector('input[name="name"]');
        var userPhone = form.querySelector('input[type="tel"]');
        var userQuestion = form.querySelector('textarea');

        form.addEventListener('submit', function () {
          localStorage.clear();

          localStorage.setItem('name', userName.value);
          localStorage.setItem('phone', userPhone.value);
          localStorage.setItem('questions', userQuestion.value);
        });
      });
    }
  }
})();

(function () {
  if ((document.querySelector('.header__button'))) {
    var openModalButton = document.querySelector('.header__button');
    if (document.querySelector('.page')) {
      var disablePage = function () {
        document.querySelector('.page').classList.add('page--disabled');
      };
    }

    if (document.querySelector('.page')) {
      var enablePage = function () {
        document.querySelector('.page').classList.remove('page--disabled');
      };
    }


    var closeModal = function (modal, buttonClose) {
      modal.classList.remove('modal--open');
      buttonClose.removeEventListener('click', closeModalClickHandler);
      document.removeEventListener('keydown', closeModalKeyPressHandler);
      document.removeEventListener('click', closeModalOutsideClickHandler);
    };

    var closeModalKeyPressHandler = function (evt) {
      var isEscKey = evt.key === 'Escape' || evt.key === 'Esc';
      if (isEscKey && document.querySelector('.modal--open')) {
        document.querySelector('.modal--open').classList.remove('modal--open');
        enablePage();
      }
    };


    var closeModalOutsideClickHandler = function (evt) {
      if (evt.target.classList.contains('modal')) {
        document.querySelector('.modal--open').classList.remove('modal--open');
        enablePage();
      }
    };

    var closeModalClickHandler = function (evt) {
      evt.preventDefault();
      var modal = evt.target.closest('.modal--open');
      var buttonClose = evt.target;
      closeModal(modal, buttonClose);
      enablePage();
    };

    var trapFocus = function (element) {
      if (document.querySelectorAll('a[href]:not([disabled]),' +
      'button:not([disabled]),' +
      'textarea:not([disabled]),' +
      'input[type="text"]:not([disabled]),' +
      'input[type="radio"]:not([disabled]),' +
      'input[type="checkbox"]:not([disabled]),' +
      'select:not([disabled])')) {
        var focusableEls = element.querySelectorAll('a[href]:not([disabled]),' +
        'button:not([disabled]),' +
        'textarea:not([disabled]),' +
        'input[type="text"]:not([disabled]),' +
        'input[type="radio"]:not([disabled]),' +
        'input[type="checkbox"]:not([disabled]),' +
        'select:not([disabled])');
        var firstFocusableEl = focusableEls[0];
        var lastFocusableEl = focusableEls[focusableEls.length - 1];
        var KEYCODE_TAB = 9;
        element.addEventListener('keydown', function (evt) {
          var isTabPressed = (evt.key === 'Tab' || evt.keyCode === KEYCODE_TAB);
          if (!isTabPressed) {
            return;
          }
          if (evt.shiftKey) {
            if (document.activeElement === firstFocusableEl) {
              lastFocusableEl.focus();
              evt.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableEl) {
              firstFocusableEl.focus();
              evt.preventDefault();
            }
          }
        });
      }
    };

    var openModalClickHandler = function (evt) {
      if (document.querySelector('.modal')) {
        evt.preventDefault();
        var modal = document.querySelector('.modal');
        modal.classList.add('modal--open');
        disablePage();
        if (modal.querySelector('input[name="name"]') && (modal.querySelector('.modal__close-modal-button'))) {
          var userNameField = modal.querySelector('input[name="name"]');
          var modalCloseButton = modal.querySelector('.modal__close-modal-button');
          userNameField.focus();
          modalCloseButton.addEventListener('click', closeModalClickHandler);
          document.addEventListener('keydown', closeModalKeyPressHandler);
          document.addEventListener('click', closeModalOutsideClickHandler);
          trapFocus(modal);
        }
      }
    };

    openModalButton.addEventListener('click', openModalClickHandler);
  }
})();

(function () {
  if (document.querySelector('.accordion')) {
    var mediaQuery = window.matchMedia('(max-width: 767px)');

    if (mediaQuery.matches) {
      var accordionContent = document.querySelector('.accordion');
      var accordionItems = Array.from(accordionContent.querySelectorAll('.accordion__item'));
      var accordionTriggers = Array.from(accordionContent.querySelectorAll('.accordion__trigger'));

      var closeAllAccordion = function (element) {
        var currentElement = element || null;

        accordionItems.forEach(function (it) {
          if (it.classList.contains('accordion__item--open') && currentElement !== it) {
            it.classList.remove('accordion__item--open');
          }
        });
      };

      var closeAccordionKeyPressHandler = function (evt) {
        var isEscKey = evt.key === 'Escape' || evt.key === 'Esc';

        if (isEscKey) {
          evt.target.closest('.accordion__item').classList.toggle('accordion__item--open');
          evt.target.removeEventListener('keydown', closeAccordionKeyPressHandler);
        }
      };

      var toggleAccordionClickHandler = function (evt) {
        evt.preventDefault();

        closeAllAccordion(evt.target.closest('.accordion__item'));
        evt.target.closest('.accordion__item').classList.toggle('accordion__item--open');
        evt.target.addEventListener('keydown', closeAccordionKeyPressHandler);
      };

      accordionTriggers.forEach(function (it) {
        it.classList.remove('accordion__trigger--no-js');
        it.tabIndex = '0';
        it.addEventListener('click', toggleAccordionClickHandler);
      });

      closeAllAccordion();

    }
  }
})();

(function () {
  if (document.querySelector('.callback-form')) {
    var formsList = document.querySelectorAll('.callback-form');

    formsList.forEach(function (form) {
      var inputsList = form.querySelectorAll('input');
      var submitButton = form.querySelector('.callback-form__button');

      var validity = function (evt) {
        inputsList.forEach(function (input) {
          if (!input.validity.valid) {
            evt.preventDefault();

            input.classList.add('callback-form__input-error');
            findRelatedLable(form, input);
          } else {
            input.classList.remove('callback-form__input-error');
            findRelatedLable(form, input);
          }
        });
      };

      submitButton.addEventListener('click', validity);
    });

    var findRelatedLable = function (form, input) {
      var labelsList = form.querySelectorAll('label');

      labelsList.forEach(function (label) {
        if (label.htmlFor === input.id && !input.validity.valid) {
          label.classList.add('callback-form__input-error--label');
        } else {
          label.classList.remove('callback-form__input-error--label');
        }
      });
    };
  }
})();

(function () {
  if (document.querySelector('input[type="tel"]')) {
    var phoneFields = document.querySelectorAll('input[type="tel"]');
    var phoneFieldMask = {
      mask: '+7(000)000-00-00'
    };

    phoneFields.forEach(function (field) {
      var mask = new window.IMask(field, phoneFieldMask);
      mask.value = field.value;

      field.addEventListener('focus', function () {
        field.value = '+7(';
        mask.updateValue();
      });
    });
  }
})();
