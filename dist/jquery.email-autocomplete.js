/*
 *  email-autocomplete - 0.2.4 (forked from original code by by Low Yong Zhen  v0.1.3)
 *  jQuery plugin that displays in-place autocomplete suggestions for email input fields.
 *
 *
 *  Made by Low Yong Zhen <yz@stargate.io>
 *  Modified by Aleksey Kuznietsov <utilmind@gmail> 29.11.2019 -- 24.01.2020.
 *
 *
 *  AK NOTES:
 *    1. It works in all modern browsers, including Internet Explorer 11. (Didn't tested it with older IE's.)
 *    2. I have dropped support of legacy functionality. ECMAScript 5 (released in 2009) required to run this code.
 *       See Array.indexOf(), Array.isArray(), Array.forEach() etc. I could rewrite it with legacy code, but don't want to do this.
 *
 */

(function($, window, document, undefined) {
  "use strict";

  var pluginName = "emailautocomplete",
      defaults = {
        suggClass: "tt-hint", // "eac-sugg", // AK original classname, but I prefer to use just simple color. Some time ago here was "suggColor", but inline styles are unsafe for CSP, so let's use only class.
        topShift: 0, // px. Extra-shift is wrong, but may help to tweak vertical shifting in some special cases. Unfortunately exact visible position of the text indide <input> and <div> can be different be shifted due to roundings.
        leftShift: 0, // px. AK: personally I prefer 1 extra-pixel between typed text and suggested. But you may set it to 0, so no gaps will be visible. AK 24.01.2020: I like 0.
        browserHacks: 1, // Edge requires 1 extra horizontal pixel for unknown reason.
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

  // we already have fl0at() in utilmind's commons.js, but this script can be loaded before commons. Let's make it little bit more independant.
  function fl0at(v, def) { // same as parseFloat, but returns 0 if parseFloat returns non-numerical value
    if (isNaN(v = parseFloat(v)))
      v = def || 0;
    return v;
  }

  function emailAutocomplete(elem, options) {
    var me = this;

    me.$field = $(elem);
    me.options = $.extend(true, {}, defaults, options); // we want deep extend
    me._domains = me.options.domains.concat(me.options.defDomains); // merge 2 arrays with domains, default and custom lists

    if (me.options.browserHacks) {
      var userAgent = navigator.userAgent.toLowerCase();

      if (userAgent.indexOf("edge") > 0) // Edge need +1 or +2px extra from left. Reason of such behavior not researched.
        me.options.leftShift+= 2;
    }

    me.init();
  }

  emailAutocomplete.prototype = {
    init: function() {
      var me = this,
          $field = me.$field,

          // AK: the craziest CSS's can modify the padding on focused controls. We must watch them.
          applyFocusedStyles = function() {
            var copyFont = function($target) {
                      // AK TODO: we can copy this all as an array. This is quick shitcoding.
                  copyCSS($target, $field, [
                    // "font", // in Chrome this could be enough w/o Family and Weight. In FireFox we should copy each value.
                    "fontSize",
                    "fontFamily",
                    "fontStyle",
                    "fontWeight",
                    "fontVariant",

                    "lineHeight",
                    "wordSpacing",
                    "letterSpacing",
                    "textAlign",
                    "textTransform",
                    "textRendering",
                    // "textIndent", // it acts like left padding. We need it only for calculator but not for overlay. We display the suggested text together with primary text, without extra-intendation.

                    "cursor", // for sure that overlay has exactly the same cursor (if the $field using custom cursor)
                    ]);
                },

                textAlign = $field.css("textAlign");

            if (textAlign != "left" && textAlign != "start") {
              me.restoreAlign = textAlign;
              $field.css("textAlign", "left");
            }

            // copy styles only onFOCUS! We need paddings/margins of FOCUSED control only!
            copyFont(me.$calcText);
            copyFont(me.$suggOverlay);

            me.$suggOverlay.css("visibility", "visible");
          };

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
        margin: 0, // we only calculate the width of the text. We don't need anything more. Set everything to 0 for sure.
        padding: 0,
        border: 0,
      }).insertAfter($field);

      // Create the suggestion overlay.
      me.$suggOverlay = $("<span "+(me.options.suggClass ? 'class="' + me.options.suggClass : "") + '" />').css({ // AK 29.11.2019. Since 29.02.2020 without CSP unsafe suggColor. Use only classes to style it!
        position: "absolute",
        display: "block",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        border: 0,
        zIndex: 9999,

        // ...uncomment code below to debug...
        // backgroundColor: "yellow",
        // opacity: 0.8,
      }).insertAfter($field);

      // if already focued -- apply styles immediately. Regular onFocus will not be triggered.
      if ($field.is(":focus"))
        applyFocusedStyles();

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

                me.$suggOverlay.css("visibility", "hidden");
                me.autocomplete();
              }, me))

            // AK: the craziest CSS's can modify the padding on focused controls. We must watch them.
            //     I'm adding the watching for the focused elements, but keep in mind, that there is a lot more pseudo-classes,
            //     which can completely change the look of the control, eg :hover, :enabled/:disabled, :read-only, :default, :required, :fullscreen, :valid/:invalid and so forth.
            .focus($.proxy(applyFocusedStyles, me));

      // touchstart jquery 1.7+
      me.$suggOverlay.on("mousedown touchstart", $.proxy(me.autocomplete, me));
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
      var me = this,
          $field = me.$field;

      // Both val & suggestion will be reused in autocomplete()
      if (me.suggestion = me.suggest(me.val = $field.val()))
        e.preventDefault();

      //update with new suggestion
      me.$suggOverlay.text(me.suggestion);
      me.$calcText.text(me.val);

      // find width of current input val so we can offset the suggestion text
      var cvalWidth = parseInt(me.$calcText.width()); // calculated width of suggested text. (AFTER SETTING THE TEXT!)

      if ($field.outerWidth() > cvalWidth) {

        // TODO: try to calculate position when text inside of the <input> is horizontally centered! (text-align: center)
        //me.$calcText.width($field.width());

        var fieldPos = $field.position(),
            fieldHeight = $field.outerHeight(),
            calcHeight = me.$calcText.height(), // same as $calcText.outerHeight(), because there is no paddings/borders
            overlayLeft,

            mt = fl0at($field.css("marginTop")),
            // left padding
            sumL = fl0at($field.css("marginLeft")) +
                   fl0at($field.css("paddingLeft")) +
                   fl0at($field.css("borderLeftWidth")) +
                   fl0at($field.css("textIndent"));

        me.$suggOverlay.css("top",
            // AK: unlike "left" positioning no need to ceil() it. Let browser decide how to round() it.
              fieldPos.top + mt +
              ((fieldHeight - calcHeight) / 2) +
              me.options.topShift // extra shift is wrong, but it may help to tweak shifting to look better in some cases
          );

        me.$suggOverlay.css("left",
           overlayLeft = Math.ceil( // in horizontal positioning extra-gap is always better than overlapped text. So always CEIL horizontal position.
              fieldPos.left + sumL +
              cvalWidth +
              me.options.leftShift
            )
          );

        // AK 17.12.2019: don't let it to shift out of the $field's bounds. Don't override other controls (buttons) on the right side of the input.
        me.$suggOverlay.css("width", $field.outerWidth() - fl0at($field.css("borderRightWidth")) - overlayLeft);

        me.$suggOverlay.height(me.$calcText.height()); // same as $calcText.outerHeight(), because there is no paddings/borders
      }
    },

    autocomplete: function() {
      var me = this;
      if (me.suggestion) {
        me.$field.val(me.val + me.suggestion);
        me.$suggOverlay.text("");
        // me.$calcText.text("");

        me.$field.trigger("input"); // AK 21.09.2020. We need it to validate field immediately after auto-completion. It's normal "input". It's okay. No additional events required.
      }
    },
  };

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, pluginName)) { // avoid double initializaton
        $.data(this, pluginName, new emailAutocomplete(this, options));
      }
    });
  };

})(jQuery, window, document);


doInit(function() { // make autocompleable all emails on page
  if (typeof $ == "undefined") return 1;
  $('input[type="email"], input.email-autocomplete').emailautocomplete(); // .email-autocomplete class should be specified in type="text" fields. Eg in sign-in forms, for fields to provide either username or email.
  /* or
  $('input[type="email"], input.email-autocomplete').each(function() { // .email-autocomplete class should be specified in type="text" fields. Eg sign-in forms, field to provide either username or email.
    $(this).emailautocomplete(); // { domains: ["example.com"] });
  });
  */
}, 1);

/*
    Sometimes I have troubles with initialization inside of the legacy Yahoo YUI dialogs.
    (Not everywhere. It works great with contact editor, but does not works on requesting required fields after incomplete registration on FAVOR.com.ua)

    But if you any have troubles, you need force initialization after first render() of the dialog.
    Example:

      YAHOO.example.container.reqflddlg.render()

      $("#reqflddlg").css("display","")
         .find('input[type="email"]').emailautocomplete();
*/