# WorkFlowy-scripts
A collection of scripts I wrote to enhance the features of [WorkFlowy](https://workflowy.com/).

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
Enable ordered lists for WorkFlowy.

Add the tag `#ol` to a bullet to get an ordered list. Each tag only affects its direct children.

Install [Ordered-Lists-for-WorkFlowy.js](https://greasyfork.org/en/scripts/440015-ordered-lists-for-workflowy)

If you find any of the scripts useful, consider [buying me a coffee ☕](https://www.buymeacoffee.com/bettyjj).
