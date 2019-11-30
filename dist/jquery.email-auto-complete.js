/*
 *  email-autocomplete - 0.1.3(ak-fork)
 *  jQuery plugin that displays in-place autocomplete suggestions for email input fields.
 *  
 *
 *  Made by Low Yong Zhen <yz@stargate.io> 
 *
 *
 *  Modified by Aleksey Kuznietsov 29.11.2019.
 */
"use strict";

(function ($, window, document, undefined) {

  var pluginName = "emailautocomplete",
      defaults = {
    suggClass: "", // "eac-sugg", // AK original classname, but I prefer to use just simple color
    suggColor: "#ccc", // used if suggClass not specified
    domains: [
      "gmail.com",
      "googlemail.com",
      "yahoo.com",
      "yahoo.co.uk",
      "yahoo.fr",
      "yahoo.de",
      "yahoo.mx",
      "rocketmail.com",
      "hotmail.com",
      "hotmail.co.uk",
      "hotmail.ru",
      "outlook.com",
      "outlook.es",
      "live.com",
      "facebook.com",
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
      "tutanota.com",
      "topmail.com",
      "charter.net",	// spectrum
      "roadrunner.com",	// spectrum
      "optonline.net",	// optimum
      "prodigy.net",	// at&t
      "zoominternet.net",
      "cox.net", // after comcast
      "usa.net",
      "yandex.com",		// shit

/* Ukraine + Europe */
      "yandex.ua",		// UA
      "yandex.by",		// BY
      "yandex.ru",		// UA-RU
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
      "seznam.cz",		// CZ
      "poczta.fm",		// PL
      "alice.it",		// IT
      "superdada.it",		// IT
      "katamail.com",		// IT
      "tiscali.it",		// IT
      "freenet.de",		// DE
      "t-online.de",		// DE
      "web.de",			// DE
      "freemail.hu",		// HU
    ],
  };

  function EmailAutocomplete(elem, options) {
    var me = this;

    me.$field = $(elem);
    me.options = $.extend(true, {}, defaults, options); //we want deep extend
    me._defaults = defaults;
    me._domains = me.options.domains;
    me.init();
  }

  EmailAutocomplete.prototype = {
    init: function () {
      var me = this;

      //shim indexOf
      if (!Array.prototype.indexOf) {
        me.doIndexOf();
      }

      //this will be calculated upon keyup
      me.fieldLeftOffset = null;

      //wrap our field
      me.$field.wrap($('<span class="eac-input-wrap' +

        // AK 29.11.2019 KLUDGE: reproduce form-control behaviour in Bootstrap4
        (me.$field.hasClass("form-control") ? " form-control" : "") +'" />').css({
            display: me.$field.css("display"),
            position: me.$field.css("position") === "static" ? "relative" : me.$field.css("position"),
            fontSize: me.$field.css("fontSize"),
            // required if the <input> has "form-control" class, but will not be interfere in any case.
            padding: 0,
            margin: 0,
          }));

      //create container to test width of current val
      me.$cval = $("<span class='eac-cval' />").css({
        visibility: "hidden",
        position: "absolute",
        display: "inline-block",
        fontFamily: me.$field.css("fontFamily"),
        fontWeight: me.$field.css("fontWeight"),
        letterSpacing: me.$field.css("letterSpacing")
      }).insertAfter(me.$field);

      //create the suggestion overlay
      /* touchstart jquery 1.7+ */
      var heightPad = (me.$field.outerHeight(true) - me.$field.height()) / 2; //padding+border
      me.$suggOverlay = $("<span "+(me.options.suggClass ? 'class="' + me.options.suggClass : 'style="color:'+me.options.suggColor) + '" />').css({ // AK 29.11.2019
        display: "block",
        "box-sizing": "content-box", //standardize
        lineHeight: me.$field.css("lineHeight"),
        paddingTop: heightPad + "px",
        paddingBottom: heightPad + "px",
        fontFamily: me.$field.css("fontFamily"),
        fontWeight: me.$field.css("fontWeight"),
        letterSpacing: me.$field.css("letterSpacing"),
        position: "absolute",
        top: 0,
        left: 0
      }).insertAfter(me.$field);

      //bind events and handlers
      me.$field.on("keyup.eac", $.proxy(me.displaySuggestion, me));

      me.$field.on("blur.eac", $.proxy(me.autocomplete, me));

      me.$field.on("keydown.eac", $.proxy(function(e){
        if(e.which === 39 || e.which === 9){
          me.autocomplete();
        }
      }, me));

      me.$suggOverlay.on("mousedown.eac touchstart.eac", $.proxy(me.autocomplete, me));
    },

    suggest: function (str) {
      var str_arr = str.split("@");
      if (str_arr.length > 1) {
        str = str_arr.pop();
        if (!str.length) {
          return "";
        }
      }else {
        return "";
      }

      var match = this._domains.filter(function (domain) {
        return domain.indexOf(str) === 0;
      }).shift() || "";

      return match.replace(str, "");
    },

    autocomplete: function () {
      if(typeof this.suggestion === "undefined" || this.suggestion.length < 1) {
        return false;
      }
      this.$field.val(this.val + this.suggestion);
      this.$suggOverlay.text("");
      this.$cval.text("");
    },

    /**
     * Displays the suggestion, handler for field keyup event
     */
    displaySuggestion: function (e) {
      var me = this;

      me.val = me.$field.val();
      me.suggestion = me.suggest(me.val);

      if (!me.suggestion.length) {
        me.$suggOverlay.text("");
      }else {
        e.preventDefault();
      }

      //update with new suggestion
      me.$suggOverlay.text(me.suggestion);
      me.$cval.text(me.val);

      // get input padding, border and margin to offset text
      if (me.fieldLeftOffset === null) {
        me.fieldLeftOffset = (me.$field.outerWidth(true) - me.$field.width()) / 2;
      }

      //find width of current input val so we can offset the suggestion text
      var cvalWidth = me.$cval.width();

      if (me.$field.outerWidth() > cvalWidth) {
        //offset our suggestion container
        me.$suggOverlay.css("left", me.fieldLeftOffset + cvalWidth + "px");
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
            fromIndex += length;
            if (fromIndex < 0) {
              fromIndex = 0;
            }
          }

          for (;fromIndex < length; fromIndex++) {
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
        $.data(this, "yz_" + pluginName, new EmailAutocomplete(this, options));
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
