// jquery.email-autocomplete.min.js
/*
 *  email-autocomplete - 0.1.3(ak-fork, 30-11-2019)
 *  jQuery plugin that displays in-place autocomplete suggestions for email input fields.
 *  
 *
 *  Made by Low Yong Zhen <yz@stargate.io> 
 *
 *
 *  Modified by Aleksey Kuznietsov 29-30.11.2019.
 *  NOTE: this code seems doesn't works on IE and Edge. So it's only for Mozilla-type browsers.
 */
(function ($, window, document, undefined) {
  "use strict";

  var pluginName = "emailautocomplete",
      defaults = {
    suggClass: "", // "eac-sugg", // AK original classname, but I prefer to use just simple color
    suggColor: "#ccc", // used if suggClass not specified
    domains: [
      "gmail.com",
      "googlemail.com",
      "yahoo.com",
      // "yahoo.ca", // odd :)
      "yahoo.co.uk",
      "yahoo.co.in",
      "yahoo.co.th",
      "yahoo.co.jp",
      "yahoo.ie",
      // "yahoo.it", // odd :)
      "yahoo.fr",
      "yahoo.de",
      // "yahoo.dk", // odd :)
      "yahoo.es",
      "yahoo.pl",
      // "yahoo.com.au",
      // "yahoo.com.ar",
      // "yahoo.com.br",
      // "yahoo.com.mx",
      // "yahoo.com.ph",
      "hotmail.com",
      "hotmail.co.uk",
      "hotmail.de",
      "hotmail.fr",
      "hotmail.it",
      "hotmail.ru",
      "outlook.com",
      "outlook.es",
      "live.com",
      "live.co.uk",
      "live.fr",
      "facebook.com",
      "rocketmail.com",
      "icloud.com",
      "aol.com",
      "mail.com",
      "mail.ru",		// UA-RU
      "mail.ua",		// UA
      "mail.be",		// BE
      "mail.fr",		// FR
      "mail.de",		// DE
      "msn.com",
      "mac.com",
      "me.com",
      "comcast.net",
      "sbcglobal.net",
      "verizon.net",
      "att.net",
      "bellsouth.net",
      "peoplepc.com",   // earthlink
      "mindspring.com", // earthlink
      "earthlink.net",  // earthlink
      "gmx.com",
      "inbox.com",
      "inbox.ru",
      "pobox.com",
      "juno.com",
      "lycos.com",
      "zohomail.com",
      "protonmail.com",
      "hushmail.com",
      "rediffmail.com",
      "tutanota.com",
      "topmail.com",
      "charter.net",	// spectrum
      "roadrunner.com",	// spectrum
      "optonline.net",	// optimum
      "prodigy.net",	// at&t
      "zoominternet.net",
      "cox.net", // after comcast
      "usa.net",
      "ymail.com",
      "sky.com",
      "laposte.net",

/* Ukraine + Europe */
      "wanadoo.fr",		// FR
      "orange.fr",		// FR
      "free.fr",		// FR
      "neuf.fr",		// FR
      "voila.fr",		// FR

      "yandex.ru",		// UA-RU
      "yandex.ua",		// UA
      "yandex.by",		// BY
      "yandex.com",		// shit
      "ukr.net",		// UA
      "meta.ua",		// UA
      "online.ua",		// UA
      "i.ua",			// UA
      "email.ua",		// UA
      "email.it",		// IT
      "e-mail.ua",		// UA
      "ua.fm",			// UA
      "football.ua",		// UA
      "3g.ua",			// UA
      "tyt.in.ua",		// UA
      "voliacable.com",		// UA
      "breezein.net",		// UA
      "rambler.ru",		// UA-RU
      "list.ru",		// UA-RU
      "bk.ru",			// UA-RU
      "qip.ru",			// UA-RU
      "pisem.net",		// UA-RU
      "webmail.ru",		// UA-RU
      "newmail.ru",		// UA-RU
      "nm.ru",			// UA-RU
      "pop3.ru",		// UA-RU
      "smtp.ru",		// UA-RU
      "pochta.ru",		// UA-RU
      "bigmir.net",		// UA
      "gala.net",		// UA
      "tut.by",			// BY

      "skynet.be",		// BE
      "telenet.be",		// BE
      "planet.nl",		// NL
      "zonnet.nl",		// NL
      "home.nl",		// NL
      "chello.nl",		// NL

      "shaw.ca",		// CA
      "seznam.cz",		// CZ
      "poczta.fm",		// PL
      "alice.it",		// IT
      "superdada.it",		// IT
      "katamail.com",		// IT
      "libero.it",		// IT
      "tiscali.it",		// IT
      "tin.it",			// IT
      "freenet.de",		// DE
      "t-online.de",		// DE
      "web.de",			// DE
      "arcor.de",		// DE
      "freemail.hu",		// HU

      "terra.com.br",		// BR

      "bigpond.com",		// after "bigmir"
      "qq.com",
      "ntlworld.com",
      "centurytel.net",
    ],
  };

  function emailAutocomplete(elem, options) {
    var me = this;

    me.$field = $(elem);
    me.options = $.extend(true, {}, defaults, options); //we want deep extend
    me._defaults = defaults;
    me._domains = me.options.domains;
    me.init();
  }

  function copyEacCss($target, $source) {
    // AK TODO: we can copy this all as an array. This is quick shitcoding.
    var props = [
        "box-sizing", //"content-box" originally
        "-webkit-box-sizing", // AK: I have no idea if it's required, but it works.
        "-moz-box-sizing", // same here

        "padding", // in Chrome this could be enough w/o all dimensions. In FireFox we should copy each value.
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",

        "margin",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",

        "border",
        "borderTop",
        "borderRight",
        "borderBottom",
        "borderLeft",

        "font", // in Chrome this could be enough w/o Family and Weight. In FireFox we should copy each value.
        "fontSize",
        "fontFamily",
        "fontWeight",

        "lineHeight",
        "letterSpacing",

        "display",
      ];

    for (var i=props.length-1; i>=0; --i)
      $target.css(props[i], $source.css(props[i]));

    $target.css({
        "border-color": "transparent",
        position: "absolute",
      });
  };

  emailAutocomplete.prototype = {
    init: function() {
      var me = this;

      //shim indexOf
      if (!Array.prototype.indexOf) {
        me.doIndexOf();
      }

      // create container to test width of current val
      me.$cval = $("<span />").css({
        display: "inline-block",
        visibility: "hidden",
      }).insertAfter(me.$field);
      copyEacCss(me.$cval, me.$field);

      // create the suggestion overlay
      me.$suggOverlay = $("<span "+(me.options.suggClass ? 'class="' + me.options.suggClass : 'style="color:'+me.options.suggColor) + '" />').css({ // AK 29.11.2019
        display: me.$field.css("display"), // "block" originally,
        top: 0,
        left: 0,
        "z-index": 99999, // AK 30.11.2019: much better solution is to find out the zIndex of $field and set up $field.zIndex+1, but what if we use it in some popup window?
      }).insertAfter(me.$field);
      copyEacCss(me.$suggOverlay, me.$field);

      //bind events and handlers
      me.$field.on("keyup", $.proxy(me.displaySuggestion, me));

      me.$field.on("blur", $.proxy(me.autocomplete, me));

      me.$field.on("keydown", $.proxy(function(e) {
        if(e.which === 39 || e.which === 9) {
          me.autocomplete();
        }
      }, me));

      /* touchstart jquery 1.7+ */
      me.$suggOverlay.on("mousedown touchstart", $.proxy(me.autocomplete, me));
    },

    suggest: function(str) {
      var str_arr = str.split("@");
      if (str_arr.length > 1) {
        str = str_arr.pop();
        if (!str.length) {
          return "";
        }
      }else {
        return "";
      }

      var match = this._domains.filter(function(domain) {
        return domain.indexOf(str) === 0;
      }).shift() || "";

      return match.replace(str, "");
    },

    /**
     * Displays the suggestion, handler for field keyup event
     */
    displaySuggestion: function(e) {
      var me = this;

      // Both val & suggestion will be reused in autocomplete()
      me.val = me.$field.val();
      me.suggestion = me.suggest(me.val);

      if (me.suggestion)
        e.preventDefault();

      //update with new suggestion
      me.$suggOverlay.text(me.suggestion);
      me.$cval.text(me.val);

      // find width of current input val so we can offset the suggestion text
      var cvalWidth = me.$cval.width(); // calculated width of suggested text. (AFTER SETTING THE TEXT!)
      if (me.$field.outerWidth() > cvalWidth) {
        /* AK 30.11.2019:
           Вот эти хаки по десятым долям пиксела — это конечно маразм. Но я не знаю как это решить правильно.
           Думаю, что это финальный сдвиг зависит от высоты, которая по-разному вычисляется в разных браузерах, если height — вычисляемое значене типа calc(1.5em + .5rem + 2px);
           Но это не точно. По логике высота не должна влиять на top/left-позициию Но точное копирование не даёт резултата. Точную причину я не знаю и выяснить пока не могу, вообще нет времени.
           Единственное что могу сделать быстро — установить более менее приемлемые сдвиги, которое нормально выглядят и в Chrome/Opera и в FF.
           И да, в Edge/IE эта штука не работает совсем. Причина тоже не выяснена. Выяснишь — дополни.

           UPD. ещё можно попробовать округлять top/left, может поможет?
                Нет, не помогает. В Firefox отрисовка действительно происходит по долям пикселов. ceil() это много, floor() — мало. Пока оставим так.
         */
        me.$suggOverlay.css("top", (me.$field.position().top + (me.$field.height() % 2 == 0 /*height of $field, even or odd?*/ ? 1 : 0.3/* firefox up to 1, chrome&opera 0 */)) + "px");
        me.$suggOverlay.css("left", (me.$field.position().left + 0.6/*firefox*/) + cvalWidth + "px");
      }
    },

    autocomplete: function() {
      if (this.suggestion) {
        this.$field.val(this.val + this.suggestion);
        this.$suggOverlay.text("");
        this.$cval.text("");
      }
    },

    /**
     * indexof polyfill
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
    */
    doIndexOf: function() {

        Array.prototype.indexOf = function (searchElement, fromIndex) {
          if ( this === undefined || this === null ) {
            throw new TypeError( '"this" is null or not defined' );
          }

          var length = this.length >>> 0; // Hack to convert object.length to a UInt32

          fromIndex = +fromIndex || 0;

          if (Math.abs(fromIndex) === Infinity) {
            fromIndex = 0;
          }

          if (fromIndex < 0) {
            fromIndex+= length;
            if (fromIndex < 0) {
              fromIndex = 0;
            }
          }

          for (;fromIndex < length; ++fromIndex) {
            if (this[fromIndex] === searchElement) {
              return fromIndex;
            }
          }

          return -1;
        };
      }
  };

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, "yz_" + pluginName)) {
        $.data(this, "yz_" + pluginName, new emailAutocomplete(this, options));
      }
    });
  };

})(jQuery, window, document);

/*
function autoCompleteEmails() { // make all email fields auto-completeable + lowercase
  $('input[name="email"]').each(function() {
    $(this).emailautocomplete({ domains: ["example.com"] });
//
//    if (makeLowercase) // better do this with CSS, but if modifiation of CSS is impossible for any reason -- use makeLowercase.
//      $(this).css("text-transform", "lowercase");
//
  });
}
*/
