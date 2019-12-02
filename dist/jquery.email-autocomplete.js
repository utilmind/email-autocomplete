/*
 *  email-autocomplete - 0.2 (forked from original code by by Low Yong Zhen  v0.1.3)
 *  jQuery plugin that displays in-place autocomplete suggestions for email input fields.
 *
 *
 *  Made by Low Yong Zhen <yz@stargate.io>
 *  Modified by Aleksey Kuznietsov <utilmind@gmail> 29.11.2019 -- 02.12.2019.
 *
 *
 *  AK NOTES:
 *    1. this code seems doesn't works on IE and Edge. So it's only for Mozilla-type browsers.
 *    2. since it doesn't works on IE anyway, I have dropped support of legacy functionality. ECMAScript 5 (released in 2009) required to run this code.
 *        
 */
(function($, window, document, undefined) {
  "use strict";

  var pluginName = "emailautocomplete",
      defaults = {
        suggClass: "", // "eac-sugg", // AK original classname, but I prefer to use just simple color
        suggColor: "#ccc", // used if suggClass not specified
        topShift: 0.4, // px. Extra-shift is wrong, but may help to tweak vertical shifting in some special cases. Unfortunately, if the height is calculated with calc(...), the position of text in the real <input> and calculator may be different.
        leftShift: 0, // px. AK: personally I prefer 1 extra-pixel between typed text and suggested. But you may set it to 0, so no gaps will be visbibe.
        domains: [], // add custom domains here
        defDomains: [ // you may override default domains setting up the "defDomains".
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
          "i.ua",		// UA
          "email.ua",		// UA
          "email.it",		// IT
          "e-mail.ua",		// UA
          "ua.fm",		// UA
          "football.ua",	// UA
          "3g.ua",		// UA
          "tyt.in.ua",		// UA
          "voliacable.com",	// UA
          "breezein.net",	// UA
          "rambler.ru",		// UA-RU
          "list.ru",		// UA-RU
          "bk.ru",		// UA-RU
          "qip.ru",		// UA-RU
          "pisem.net",		// UA-RU
          "webmail.ru",		// UA-RU
          "newmail.ru",		// UA-RU
          "nm.ru",		// UA-RU
          "pop3.ru",		// UA-RU
          "smtp.ru",		// UA-RU
          "pochta.ru",		// UA-RU
          "bigmir.net",		// UA
          "gala.net",		// UA
          "tut.by",		// BY

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
          "superdada.it",	// IT
          "katamail.com",	// IT
          "libero.it",		// IT
          "tiscali.it",		// IT
          "tin.it",		// IT
          "freenet.de",		// DE
          "t-online.de",	// DE
          "web.de",		// DE
          "arcor.de",		// DE
          "freemail.hu",	// HU

          "terra.com.br",	// BR

          // the rest...
          "bigpond.com",	// after "bigmir"
          "qq.com",
          "ntlworld.com",
          "centurytel.net",
          "usa.net",		// below ukr.net
        ],
      }; // end of defaults

  // AK: it's good enough to be canonized somewhere separately
  function copyCSS(targetEl, sourceElOrVal, styleName) {
    if (Array.isArray(styleName)) {
      styleName.forEach(function(style) {
        copyCSS(targetEl, sourceElOrVal, style); // recursion!
      });

    }else {
      if (typeof sourceElOrVal == "object")
        sourceElOrVal = $(sourceElOrVal).css(styleName);

      if ($(targetEl).css(styleName) != sourceElOrVal) // maybe this is odd? need research
        $(targetEl).css(styleName, sourceElOrVal);
    }
  }

  function emailAutocomplete(elem, options) {
    var me = this;

    me.$field = $(elem);
    me.options = $.extend(true, {}, defaults, options); // we want deep extend
    me._domains = me.options.domains.concat(me.options.defDomains); // merge 2 arrays with domains, default and custom lists
    me.init();
  }

  emailAutocomplete.prototype = {
    init: function() {
      var me = this,
          $field = me.$field;

      // capitalized emails looking TOTALLY weird when capitalized text torns apart, like Name@GmAil.Com etc. First character of suggested part will be capitalized too, and it's wrong.
      // And we will not respect unfocused capitalization too. First words in emails should never be capitaized.
      if ($field.css("textTransform") == "capitalize")
        $field.css("textTransform", "lowercase");

      // create container to test width of current val
      me.$calcText = $("<span />").css({
        position: "absolute",
        visibility: "hidden",
        top: -999, // this will hide an element even if some weird CSS will enable visibility.
        display: "block",
      }).insertAfter($field);

      // Create the suggestion overlay.
      me.$suggOverlay = $("<span "+(me.options.suggClass ? 'class="' + me.options.suggClass : 'style="color:'+me.options.suggColor) + '" />').css({ // AK 29.11.2019
        display: "table-cell",
        verticalAlign: "middle",
        margin: 0,
        padding: 0,
        border: 0,
        // ...uncomment code below to debug...
        // backgroundColor: "yellow",
        // opacity: 0.8,
      });

      // In most cases we don't need the wrapper over me.$suggOverlay. But we should vertically center the text on the box with the same height, to avoid extra-shifting.
      me.$suggWrapper = $("<span />").css({
        position: "absolute",
        display: "table",
        // borderColor: "transparent", // we losing the borderColor upon applying the borders. So make it "transparent" after we setup the borders.
        top: 0,
        left: 0,
        zIndex: 99999,
      }).insertAfter($field)
        .append(me.$suggOverlay);

      // apply styles that need to be applied
      me.watchCSS();

      // bind events and handlers
      $field.keyup($.proxy(me.displaySuggestion, me))

            .keydown($.proxy(function(e) {
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
              }, me))

            .blur($.proxy(function(e) {
                if (me.restoreAlign) {
                  $field.css("textAlign", me.restoreAlign);
                  me.restoreAlign = null;
                }

                me.watchCSS();
                me.autocomplete();
                // change textAlign
              }, me))

            // AK: the craziest CSS's can modify the padding on focused controls. We must watch them.
            //     I'm adding the watching for the focused elements, but keep in mind, that there is a lot more pseudo-classes,
            //     which can completely change the look of the control, eg :hover, :enabled/:disabled, :read-only, :default, :required, :fullscreen, :valid/:invalid and so forth.
            .focus($.proxy(function(e) {
                var textAlign = $field.css("textAlign");

                if (textAlign != "left" && textAlign != "start") {
                  me.restoreAlign = textAlign;
                  $field.css("textAlign", "left");
                }

                me.watchCSS();
              }, me));

      // touchstart jquery 1.7+
      me.$suggOverlay.on("mousedown touchstart", $.proxy(me.autocomplete, me));
    },

    watchCSS: function() { // watch for changes in styling and update if required
      var me = this;

      // calculator
      me.copyFont(me.$calcText); // We require the font
      me.copySizing(me.$calcText); // But not sure about the sizing. Need more tests at spare time.
//      copyCSS(me.$calcText, me.$field, "textIndent"); // textIndent applied separately only for the calculator

      // wrapper of the overlay
      me.copySizing(me.$suggWrapper); // only sizing. No need to setup the Font
      copyCSS(me.$suggWrapper, "transparent", "borderColor"); // we need to reset borderColor each type after copySizing(). Border dimensions have individual settings.

      // overlay
      me.copyFont(me.$suggOverlay); // only FONT. All paddings-margins is 0.
    },

    copySizing: function($target) {
      // AK TODO: we can copy this all as an array. This is quick shitcoding.
      copyCSS($target, this.$field, [
          "box-sizing", //"content-box" originally

//          "padding", // in Chrome this could be enough w/o all dimensions. In FireFox we should copy each value.
          "paddingTop",
          "paddingRight",
          "paddingBottom",
          "paddingLeft",

//          "margin",
          "marginTop",
          "marginRight",
          "marginBottom",
          "marginLeft",

//          "border",
          "borderTop",
          "borderRight",
          "borderBottom",
          "borderLeft",
        ]);
    },

    copyFont: function($target) {
      // AK TODO: we can copy this all as an array. This is quick shitcoding.
      copyCSS($target, this.$field, [
           // "font", // in Chrome this could be enough w/o Family and Weight. In FireFox we should copy each value.
           "fontSize",
           "fontFamily",
           "fontWeight",

           "lineHeight",
           "letterSpacing",
           "textAlign",
           "textTransform",
           "wordSpacing", // odd?
           "textSizeAdjust", // odd?
           // "textIndent", // it acts like left padding. Applies separately for the "calculator" only.
         ]);
    },

    suggest: function(str) {
      var strArr = str.split("@");
      if (strArr.length > 1) {
        str = strArr.pop();
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
      me.$calcText.text(me.val);

      // find width of current input val so we can offset the suggestion text
      var cvalWidth = me.$calcText.width(); // calculated width of suggested text. (AFTER SETTING THE TEXT!)
      if (me.$field.outerWidth() > cvalWidth) {
        // TODO: try to calculate position when text in e <input> is horizontall centered!
        //me.$calcText.width(me.$field.width());

        me.$suggWrapper.css("top", me.$field.position().top + me.options.topShift); // extra shift is wrong, but it may help to tweak shifting to look better in some cases
        me.$suggWrapper.css("left", me.$field.position().left + cvalWidth + me.options.leftShift); // 1px horizontal shift looks even better than no shift, so you may add it.
        me.$suggWrapper.height(me.$field.height());
      }
    },

    autocomplete: function() {
      var me = this;
      if (me.suggestion) {
        me.$field.val(me.val + me.suggestion);
        me.$suggOverlay.text("");
        me.$calcText.text("");
      }
    },
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
doInit(function() { // make autocompleable all emails on page
  if (typeof $ == "undefined") return 1;
  $('input[type="email"], input.email-autocomplete').each(function() { // .email-autocomplete class should be specified in type="text" fields. Eg sign-in forms, field to provide either username or email.
    $(this).emailautocomplete(); // { domains: ["example.com"] });
  });
}, 1);
*/