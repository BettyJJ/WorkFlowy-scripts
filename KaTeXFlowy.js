// ==UserScript==
// @name         KaTeXFlowy
// @namespace    https://github.com/BettyJJ
// @version      0.1
// @description  Supports formula rendering in WorkFlowy with KaTeX
// @author       Betty
// @match        https://workflowy.com/*
// @match        https://*.workflowy.com/*
// @run-at       document-idle
// @grant        GM.addStyle
// @require      https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/contrib/auto-render.min.js
// ==/UserScript==

(function () {
	'use strict';


	watch_page();
	hide_raw();


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

		// give the node a class name so we can handle it later
		node.classList.add('has-latex');

		// insert an iframe to contain the rendered result
		const result = document.createElement('iframe');
		let html = '<!DOCTYPE html><html>';
		html += '<head><link type="text/css" rel="Stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css" /></head>';
		html += '<body style="margin:0">' + node.textContent + '</body></html>';
		result.srcdoc = html;

		result.style.display = 'block';
		result.style.width = '100%';
		// result.style.backgroundColor = '#eee';

		node.insertAdjacentElement('afterend', result);

		// do stuff when the iframe is actually loaded
		result.onload = function () {
			iframe_onload(result);
		}
	}


	/**
	 * check if the node contains anything that should be rendered
	 * @param node {Node} Dom Node
	 * @returns {boolean}
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
		const body = iframe.contentDocument.body;

		// render the iframe
		const options = {
			delimiters: [
				{ left: '$$', right: '$$', display: true },
				{ left: '$', right: '$', display: false }
			]
		};
		renderMathInElement(body, options);

		// resize the iframe according to its content
		// setting the parent style avoids collapsing margins (child margin doesn't affect parent height). otherwise there will be a scrollbar
		const display_span_list = body.getElementsByClassName('katex-display');
		for (let item of display_span_list) {
			item.parentNode.style.display = 'block';;
			item.parentNode.style.overflow = 'hidden';;
		}
		iframe.style.height = body.scrollHeight + 'px';

		// when the iframe is clicked, make the corresponding raw content with LaTeX has focus and become displayed
		body.addEventListener('click', () => {
			remove_old_focus();
			iframe.previousSibling.classList.add('latax-focused');
		});

	}


	/**
	 * hide the raw content with LaTeX. only shows it when it has focus
	 */
	function hide_raw() {
		GM.addStyle('.name .has-latex {display:none}');
		GM.addStyle('.name--focused .innerContentContainer, .name .latax-focused {display:inline} ');

		// when clicked, remove the class name previously added so only the newly clicked item has focus
		document.addEventListener('click', () => {
			remove_old_focus();
		});
	}


	/**
	 * remove the class name added on the previous focused item(s)
	 */
	function remove_old_focus() {
		const old_focus = document.getElementsByClassName('latax-focused');
		while (old_focus.length > 0) {
			old_focus[0].classList.remove('latax-focused');
		}
	}


})();
