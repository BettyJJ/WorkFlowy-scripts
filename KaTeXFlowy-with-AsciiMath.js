// ==UserScript==
// @name         KaTeXFlowy-with-AsciiMath
// @namespace    https://github.com/BettyJJ
// @version      0.2.2+am
// @description  Supports formula rendering in WorkFlowy with KaTeX. Also supports AsciiMath.
// @author       Betty
// @match        https://workflowy.com/*
// @match        https://*.workflowy.com/*
// @run-at       document-idle
// @grant        GM.addStyle
// @grant        GM_getResourceText
// @resource     KATEX_CSS https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css
// @require      https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/contrib/auto-render.min.js
// @require      https://unpkg.com/asciimath2tex@1.2.1/dist/asciimath2tex.umd.js
// ==/UserScript==

(function () {
	'use strict';


	init();


	/**
	 * initialize
	 */
	function init() {
		watch_page();

		load_css();

		hide_raw();

	}


	/**
	 * watch the page
	 */
	function watch_page() {

		// wathe the page, so that the rendering is updated when new contents come in as the user edits or navigates
		const observer = new MutationObserver(function (mutationlist) {
			for (const { addedNodes } of mutationlist) {
				for (const node of addedNodes) {
					if (!node.tagName) continue; // not an element

					if (node.classList.contains('innerContentContainer')) {
						handle_node(node);
					}

				}
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });

	}


	/**
	 * insert a container after the node with formula to contain the rendered result
	 * @param {Node} node Dom Node
	 */
	function handle_node(node) {
		// sometimes there is a dummy node without parent. don't know why, but we need to check and exclude it first
		const parent = node.parentElement;
		if (!parent) {
			return;
		}

		// if a container already exists, remove it first to avoid duplication
		if (parent.nextSibling && parent.nextSibling.classList.contains('rendered-latex')) {
			parent.nextSibling.remove();

			// also remove the class name we added previously
			parent.classList.remove('has-latex');
		}

		// check if the node contains anything that should be rendered
		if (!has_latex(node) && !has_asciimath(node)) {
			return;
		}

		// give the parent a class name so we can handle it later
		parent.classList.add('has-latex');

		// add an element to contain the rendered latex
		const container = document.createElement('div');
		// if it's AsciiMath, it needs to be converted to LaTeX first
		container.innerHTML = convert_to_latex(node.innerHTML);
		container.className = 'rendered-latex';
		parent.insertAdjacentElement('afterend', container);

		// replicate this class name of the parent so that the rendered block can preserve WF's original style
		container.classList.add(parent.classList[1]);

		// render it
		const options = {
			delimiters: [
				{ left: '$$', right: '$$', display: true },
				{ left: '$', right: '$', display: false }
			]
		};
		renderMathInElement(container, options);

		// when the element is clicked, make the focus in the corresponding node so that the user can begin typing
		container.addEventListener('click', () => {
			parent.focus();
		});

	}


	/**
	 * check if the node contains LaTeX that should be rendered
	 * @param {Node} node Dom Node
	 * @returns {boolean}
	 */
	function has_latex(node) {
		// use $ or $$ as delimiters
		const text = node.textContent;
		const regex = /\$(\$)?(.+?)\$(\$)?/s;
		const match = text.match(regex);
		if (match !== null) {
			return true;
		}

		return false;
	}


	/**
	 * check if the node contains AsciiMath that should be rendered
	 * @param {Node} node Dom Node
	 * @returns {boolean}
	 */
	function has_asciimath(node) {
		// use ` as delimiters
		const text = node.textContent;
		const regex = /`(.+?)`/s;
		const match = text.match(regex);
		if (match !== null) {
			return true;
		}

		return false;
	}


	/**
	 * convert a string, changing the AsciiMath parts into LaTeX, keeping the rest unchanged
	 * @param {string} str a string containing AsciiMath
	 * @returns {string} a string containing converted LaTeX
	 */
	function convert_to_latex(str) {
		// AsciiMath uses ` as delimiters
		const regex = /`(.+?)`/g;
		const parser = new AsciiMathParser();
		const result = str.replaceAll(regex, function (match, p1) {
			// convert to LaTeX with $ as delimiters
			return '$' + parser.parse(p1) + '$';
		});
		return result;
	}


	/**
	 * hide the raw content with LaTeX. only shows it when it has focus
	 */
	function hide_raw() {
		GM.addStyle('.name .has-latex .innerContentContainer { display:none } ');
		GM.addStyle('.name .has-latex.content { height: 0; min-height: 0 } ');

		GM.addStyle('.name--focused .has-latex .innerContentContainer { display:inline} ');
		GM.addStyle('.name--focused .has-latex.content { height: auto} ');

		// add a background to make the raw part look clearer
		GM.addStyle('.name--focused .has-latex { background: #eee } ');

	}


	/**
	 * load KaTex css
	 */
	function load_css() {
		let css = GM_getResourceText("KATEX_CSS");

		// the font path in the css file is relative, we need to change it to absolute
		css = css.replace(
			/fonts\//g,
			'https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/fonts/'
		);

		GM.addStyle(css);
	}


})();
