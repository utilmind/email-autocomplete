// jq.email-autocomplete.js
// jquery.email-autocomplete.min.js
/*
 *  email-autocomplete - 0.1.3(ak-fork, 1-12-2019)
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
      "aim.com", // aol service
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
      "usa.net",		// below ukr.net
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

//        "padding", // in Chrome this could be enough w/o all dimensions. In FireFox we should copy each value.
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",

//        "margin",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",

//        "border",
        "borderTop",
        "borderRight",
        "borderBottom",
        "borderLeft",

//        "font", // in Chrome this could be enough w/o Family and Weight. In FireFox we should copy each value.
        "fontSize",
        "fontFamily",
        "fontWeight",

        "lineHeight",
        "letterSpacing",
        "textAlign",
        "wordSpacing", // odd?
        "textIndent", // odd?
        "textSizeAdjust", // odd?
      ];

    for (var i=props.length-1; i>=0; --i)
      $target.css(props[i], $source.css(props[i]));
  };

  emailAutocomplete.prototype = {
    init: function() {
      var me = this,
          textAlign = me.$field.css("textAlign");

      if (textAlign == "center" || textAlign == "right") {
        return; // this doesn't works with centered texts for now. Left-aligned only. TODO: make proper positioning.
      }

      //shim indexOf
      if (!Array.prototype.indexOf) {
        me.doIndexOf();
      }

      // create container to test width of current val
      me.$cval = $("<span />").css({
        position: "absolute",
        visibility: "hidden",
        top: -999, // this will hide an element even if some weird CSS will enable visibility.
        display: "block",
      }).insertAfter(me.$field);
      copyEacCss(me.$cval, me.$field);

      // Create the suggestion overlay.
      // In most cases we don't need the wrapper over me.$suggOverlay. But we should vertically center the text on the box with the same height, to avoid extra-shifting.
      me.$suggWrapper = $("<span />").insertAfter(me.$field);
      copyEacCss(me.$suggWrapper, me.$field);
      me.$suggWrapper.css({ // after copying the field CSS
        position: "absolute",
        display: "table",
        "border-color": "transparent",
        top: 0,
        left: 0,
        "z-index": 99999,
      });

      me.$suggOverlay = $("<span "+(me.options.suggClass ? 'class="' + me.options.suggClass : 'style="color:'+me.options.suggColor) + '" />').css({ // AK 29.11.2019
        display: "table-cell",
        verticalAlign: "middle",
        margin: 0,
        padding: 0,
        border: 0,
      });
      me.$suggWrapper.append(me.$suggOverlay);


      //bind events and handlers
      me.$field.on("keyup", $.proxy(me.displaySuggestion, me));

      me.$field.on("blur", $.proxy(me.autocomplete, me));

      me.$field.on("keydown", $.proxy(function(e) {
        if (me.suggestion) {
          var key = e.keyCode || e.which;
          if (((key > 37) && (key < 41)) || (key == 9) || (key == 13)) { // top-right-bottom & tab
            if (key == 13) {
              e.stopPropagation();
              e.preventDefault();
            }
            me.autocomplete();
          }
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

      str = str.toLowerCase();
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
        // TODO: try to calculate position when text in e <input> is horizontall centered!
        //me.$cval.width(me.$field.width());

        me.$suggWrapper.css("top", me.$field.position().top + 1); // 1px is wrong, but it looks good in most cases
        me.$suggWrapper.css("left", me.$field.position().left + cvalWidth + 1); // 1px horizontal shift looks even better than no shift
        me.$suggWrapper.height(me.$field.height());
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


doInit(function() { // make autocompleable all emails on page
  if (typeof $ == "undefined") return 1;
  $('input[type="email"], input.email-autocomplete').each(function() { // .email-autocomplete class should be specified in type="text" fields. Eg sign-in forms, field to provide either username or email.
    $(this).emailautocomplete(); // { domains: ["example.com"] });
  });
}, 1);
