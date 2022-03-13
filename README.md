# WorkFlowy-scripts
A collection of scripts I wrote to enhance the features of [WorkFlowy](https://workflowy.com/).

If you find any of the scripts useful, consider [buying me a coffee ☕](https://www.buymeacoffee.com/bettyjj).

## Markdown-WorkFlowy

Supports Markdown rendering in WorkFlowy.

[Install Markdown-WorkFlowy.js here](https://greasyfork.org/en/scripts/441459-markdown-workflowy)

After installing the script and refreshing your WorkFlowy page, a "Preview MD" button will show up. Click the button to toggle on/off the preview.

Don't use this script together with `KaTeXFlowy.js`, `KaTeXFlowy-with-AsciiMath.js`, or `Ordered-Lists-for-WorkFlowy.js`. Ordered lists are covered in this script. LaTeX is not supported (yet).

## KaTeXFlowy
Supports formula rendering in WorkFlowy with [KaTeX](https://katex.org/).

### How to use
This is a userscript for Tampermonkey. If you haven't used Tampermonkey before, first [install it](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo). Then [install the KaTeXFlowy.js script](https://greasyfork.org/en/scripts/439947-katexflowy). Refresh your WorkFlowy page to see the effect.

Use `$...$` for inline mode and `$$...$$` for display mode. For example: `$$a^2 + b^2 = c^2$$`

You can use formula in both the bullet and the note section.

Because WorkFlowy does not support line breaks in bullets, if you need multiline formula, you can do so in the note section.

## KaTeXFlowy-with-AsciiMath
This is similar to [KaTeXFlowy.js script](https://greasyfork.org/en/scripts/439947-katexflowy) but supports both LaTeX and [AsciiMath](http://asciimath.org/) with the help of [asciimath2tex](https://github.com/christianp/asciimath2tex).

Don't use the two scripts together.

AsciiMath uses `` ` `` (backtick) as the delimiter, eg. `` `a^2 + b^2 = c^2` ``

[Install KaTeXFlowy-with-AsciiMath.js](https://greasyfork.org/en/scripts/439948-katexflowy-with-asciimath)

## Ordered-Lists-for-WorkFlowy
Enable ordered lists for WorkFlowy. Can also hide child bullets.

Add the tag `#ol` to a bullet to get an ordered list. Each tag only affects its direct children.

By default, the bullets in ordered lists are hidden. If you want to show them by default, uncomment this line in the script (about line 28):
```
// show_bullet_in_ol();
```
and change it into:
```
show_bullet_in_ol();
```

You can also add the tag `#nb` to hide child bullets.

The two tags can be used together or independently.

Install [Ordered-Lists-for-WorkFlowy.js](https://greasyfork.org/en/scripts/440015-ordered-lists-for-workflowy)
