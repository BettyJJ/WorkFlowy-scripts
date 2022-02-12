# WorkFlowy-scripts
A collection of scripts I wrote to enhance the features of [WorkFlowy](https://workflowy.com/).

## KaTeXFlowy
Supports formula rendering in WorkFlowy with [KaTeX](https://katex.org/).

### How to use
This is a userscript for Tampermonkey. If you haven't used Tampermonkey before, first [install it](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo). Then create a new script through Tampermonkey and paste the content of `KaTeXFlowy.js` into it. Now open or refresh your WorkFlowy page and you can see the effect.

Use `$...$` for inline mode and `$$...$$` for display mode. For example: `$$a^2 + b^2 = c^2$$`

You can use formula in both the bullet and the note section.

Because WorkFlowy does not support line breaks in bullets, if you need multiline formula, you can do so in the note section.

## KaTeXFlowy-with-AsciiMath
`KaTeXFlowy-with-AsciiMath.js` is similar with the above script but supports both LaTeX and [AsciiMath](http://asciimath.org/) with the help of [asciimath2tex](https://github.com/christianp/asciimath2tex).

AsciiMath uses `` ` `` (backtick) as the delimiter, eg. `` ` ``a^2 + b^2 = c^2 `` ` ``

Don't use the two scripts together.

If you find any of the scripts useful, consider [buying me a coffee ☕](https://www.buymeacoffee.com/bettyjj).
