# jquery.email-autocomplete.js

This is forked & modified code by Aleksey Kuznietsov (aka UtilMind) 29.11.2019 — 3.12.2019.

Fixes are following:
  1. Advanced list of email domains. Fits most common free email providers in USA + all Ukrainian/Russian services + some European.
  2. Added "suggColor" option to specify the color of suggested text without CSS. (Hey, it's too simple to bring 1 more style to all CSS's of my projects! I prefer just 1 inline color option.)
  3. (Fix for Bootstrap4) The wrapper should have "form-control" class if the &lt;input&gt; has "form-control". Otherwise the input control will not have width 100% (and other behaviors of "form-control" style).
  This is kludge, I could think about better and more universal fix, but it works for me as is. So I'm leaving it.
  4. Many other improvements.
  
<b>Live demo on JSFiddle: https://jsfiddle.net/utilmind/ytxLh4z3/</b>
  
Original description was following:

<hr />

> A jQuery plugin that suggests and autocompletes the domain whenever your users type in an email address field.

[![Build Status](https://travis-ci.org/yongzhenlow/email-autocomplete.svg?branch=master)](https://travis-ci.org/yongzhenlow/email-autocomplete)
[![CDNJS version](https://img.shields.io/cdnjs/v/email-autocomplete.svg)](https://cdnjs.com/libraries/email-autocomplete)


## What does it do?

When your user types in "user@gm", the plugin will suggest for e.g. "user@gmail.com", based on the first result from a list of predefined email domains.

![diagram](https://raw.github.com/10w042/email-autocomplete/master/doc_assets/example.png)

Press the tab-key, or simply click on the suggestion to automatically fill in the rest of the domain. (or tap on the suggestion for mobile users.)

You can also use the right arrow key.

See a live demo [here](http://10w042.github.io/email-autocomplete/demo/).

## Installation

**Bower**

```sh
bower install email-autocomplete --save
```

**Download** 

Download or clone this repo and copy `dist/jquery.email-autocomplete.min.js` into your javascripts directory.

## Usage (jQuery)

Add `jquery.email-autocomplete.min.js` into your HTML, before the closing `</body>` tag.

```html
<script src="jquery.min.js"></script>
<script src="jquery.email-autocomplete.min.js"></script>
```

You should also have a email input field.

```html
<input id="email" name="email" type="email" />
```

Now, attach the plugin to the email input field.

```html
<script>
$("#email").emailautocomplete({
  suggClass: "custom-classname",
  domains: ["example.com"]
});
</script>
```

## Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
suggClass|string|'eac-sugg'|Classname for the suggestion text element.
domains|array|See list of domains below|Array of domains used for autocompleting.

## Styling

Use the following CSS to style the suggestion text color. Remember to update the classname if you've changed it to a custom one.

```css
.eac-sugg {
  color: #ccc;
}
```

## Domains

These are the plugin default domains if the `domains` option is not supplied.

* gmail.com
* googlemail.com
* yahoo.com
* yahoo.co.uk
* hotmail.com
* hotmail.co.uk
* live.com
* msn.com
* comcast.net
* sbcglobal.net
* verizon.net
* facebook.com
* outlook.com
* att.net
* gmx.com
* icloud.com
* me.com
* mac.com
* aol.com

## Author

- Low Yong Zhen


## Known Issues

* On Android stock browser, if "Settings > Accessibility > Scale text up and down" value is not at 100%, the text width will be calculated incorrectly.
