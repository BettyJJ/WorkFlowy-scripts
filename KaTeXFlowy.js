// ==UserScript==
// @name         KaTeXFlowy
// @namespace    https://github.com/BettyJJ
// @version      0.1
// @description  Supports formula rendering in WorkFlowy with KaTeX
// @author       Betty
// @match        https://workflowy.com/*
// @match        https://*.workflowy.com/*
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.js
// ==/UserScript==

(function () {
	'use strict';


	watch_page();


	/**
	 * watch the page
	 */
	function watch_page() {

		// wathe the page, so that the rendering is updated when new contents come in as the user edits or navigates
		const observer = new MutationObserver(function (mutationlist) {
			for (const { addedNodes } of mutationlist) {
				for (const node of addedNodes) {
					if (!node.tagName) continue; // not an element

					render_formula(node);

				}
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });

	}


	/**
	 * render the node with formula
	 * @param node {Node} Dom Node
	 */
	function render_formula(node) {
		// get the formula expression
		const expr = get_expr(node);
		// if no expression is found, do nothing
		if (expr === '') {
			return;
		}

		// render the formula
		const result = document.createElement('iframe');
		const head = '<head><link type="text/css" rel="Stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css" /></head>';
		const formula = katex.renderToString(expr);
		result.srcdoc = head + '<body>' + formula + '</body>';

		result.style.display = 'block';
		result.style.width = '100%';
		result.style.backgroundColor = '#eee';

		node.insertAdjacentElement('afterend', result);

		// resize the iframe according to its content when loaded
		result.onload = function () {
			iframe_onload(result);
		}
	}


	/**
	 * get the formula expression that should be rendered
	 * only one expression is allowed in one node
	 * @param node {Node} Dom Node
	 * @returns string. If the returned string is empty, then nothing needs to be rendered.
	 */
	function get_expr(node) {
		if (!node.classList.contains('innerContentContainer')) {
			return '';
		}

		// use $$ as delimiters
		const text = node.innerText;
		const regex = /\$\$(.+?)\$\$/s;
		const match = text.match(regex);
		if (match !== null) {
			const expr = match[1];
			return expr;
		}

		return '';
	}


	/**
	 * resize the iframe according to its content when loaded
	 * @param iframe {Element} <iframe> HTML element
	 */
	function iframe_onload(iframe) {
		// need this extra height, otherwise there will be a scrollbar
		const extra = 20;

		iframe.style.height = iframe.contentDocument.body.scrollHeight + extra + 'px';
	}


})();
