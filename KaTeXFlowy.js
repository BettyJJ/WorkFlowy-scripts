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
// @require      https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/contrib/auto-render.min.js
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

					insert_iframe(node);

				}
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });

	}


	/**
	 * insert an iframe after the node with formula to contain the rendered result
	 * @param node {Node} Dom Node
	 */
	function insert_iframe(node) {
		if (!should_render(node)) {
			return;
		}

		// insert an iframe to contain the rendered result
		const result = document.createElement('iframe');
		const head = '<head><link type="text/css" rel="Stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css" /></head>';
		result.srcdoc = head + '<body>' + node.textContent + '</body>';

		result.style.display = 'block';
		result.style.width = '100%';
		result.style.backgroundColor = '#eee';

		node.insertAdjacentElement('afterend', result);

		// do stuff when the iframe is actually loaded
		result.onload = function () {
			iframe_onload(result);
		}
	}


	/**
	 * check if the node contains anything that should be rendered
	 * @param node {Node} Dom Node
	 * @returns boolean
	 */
	function should_render(node) {
		if (!node.classList.contains('innerContentContainer')) {
			return false;
		}

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
	 * do stuff when the iframe is actually loaded
	 * @param iframe {Element} <iframe> HTML element
	 */
	function iframe_onload(iframe) {
		// render the iframe
		const options = {
			delimiters: [
				{ left: '$$', right: '$$', display: true },
				{ left: '$', right: '$', display: false }
			]
		};
		renderMathInElement(iframe.contentDocument.body, options);

		// resize the iframe according to its content
		// need this extra height, otherwise there will be a scrollbar
		const extra = 33;

		iframe.style.height = iframe.contentDocument.body.scrollHeight + extra + 'px';
	}


})();
