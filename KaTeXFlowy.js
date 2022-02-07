// ==UserScript==
// @name         KaTeXFlowy
// @namespace    https://github.com/BettyJJ
// @version      0.2
// @description  Supports formula rendering in WorkFlowy with KaTeX
// @author       Betty
// @match        https://workflowy.com/*
// @match        https://*.workflowy.com/*
// @run-at       document-idle
// @grant        GM.addStyle
// @grant        GM_getResourceText
// @resource     KATEX_CSS https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css
// @require      https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/contrib/auto-render.min.js
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
	 * @param node {Node} Dom Node
	 */
	function handle_node(node) {
		// if a container already exists, remove it first to avoid duplication
		const parent = node.parentElement;
		let container = parent.nextSibling;
		if (container && container.className === 'rendered-latex') {
			container.remove();
		}
		// also remove the class name we added previously
		parent.classList.remove('has-latex');

		// check if the node contains anything that should be rendered
		if (!should_render(node)) {
			return;
		}

		// give the parent a class name so we can handle it later
		parent.classList.add('has-latex');

		// add an element to contain the rendered latex
		container = document.createElement('div');
		container.textContent = node.textContent;
		container.className = 'rendered-latex';
		parent.insertAdjacentElement('afterend', container);

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
	 * check if the node contains anything that should be rendered
	 * @param node {Node} Dom Node
	 * @returns {boolean}
	 */
	function should_render(node) {
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
	 * hide the raw content with LaTeX. only shows it when it has focus
	 */
	function hide_raw() {
		GM.addStyle('.has-latex .innerContentContainer { display:none } ');
		GM.addStyle('.has-latex.content { height: 0; min-height: 0 } ');

		GM.addStyle('.name--focused .innerContentContainer { display:inline} ');
		GM.addStyle('.name--focused .content { height: auto} ');

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
