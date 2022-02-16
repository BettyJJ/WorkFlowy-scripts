// ==UserScript==
// @name         Ordered-Lists-for-WorkFlowy
// @namespace    https://github.com/BettyJJ
// @version      0.2
// @description  Enable ordered lists for WorkFlowy
// @author       Betty
// @match        https://workflowy.com/*
// @match        https://*.workflowy.com/*
// @run-at       document-idle
// @grant        GM.addStyle
// ==/UserScript==

(function () {
	'use strict';


	init();


	/**
	 * initialize
	 */
	function init() {
		watch_page();
		add_style();

		// we hide the bullets in ordered lists by default. If you want to show them by default, uncomment the next line
		// show_bullet_in_ol();
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
						add_class(node);
					}

				}
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });

	}


	/**
	 * if a node contains the #ol or #nb tag, add a class
	 * * @param {Node} node Dom Node
	 */
	function add_class(node) {
		// sometimes there is a dummy node without parent. don't know why, but we need to check and exclude it first
		if (!node.parentElement) {
			return;
		}

		add_class_ol(node);
		add_class_nb(node);
	}


	/**
	 * if a node contains the #ol tag, add a class
	 * * @param {Node} node Dom Node
	 */
	function add_class_ol(node) {
		// first remove the class we added previously
		const ancestor = node.closest('.project');
		ancestor.classList.remove('list-ol');

		// if a node contains the #ol tag, add a class
		if (node.querySelectorAll('[data-val="#ol"]').length > 0) {
			ancestor.classList.add('list-ol');
		}
	}


	/**
	 * if a node contains the #nb tag, add a class
	 * * @param {Node} node Dom Node
	 */
	function add_class_nb(node) {
		// first remove the class we added previously
		const ancestor = node.closest('.project');
		ancestor.classList.remove('list-nb');

		// if a node contains the #nb tag, add a class
		if (node.querySelectorAll('[data-val="#nb"]').length > 0) {
			ancestor.classList.add('list-nb');
		}
	}

	/**
	 * add style
	 */
	function add_style() {
		add_style_ol();
		add_style_nb();
	}


	/**
	 * add style for #ol
	 */
	function add_style_ol() {
		// hide the bullets
		let css = `
		.list-ol > .children > .project > .name > .bullet {
			opacity: 0.5 !important;
		}
		.list-ol > .children > .project > .name > .bullet > svg {
			fill: transparent;
		}
		`

		// show the numbers
		css += `
		.list-ol > .children {
			counter-reset: counter;
		}
		.list-ol > .children > .project > .name:before {
			counter-increment: counter;
			content: counter(counter) '. ';
			float: left;
			margin-left: -18px;
			margin-top: 8px;
		}
		`

		GM.addStyle(css);
	}


	/**
	 * add style for #nb
	 */
	function add_style_nb() {
		// hide the bullets
		const css = `
			.list-nb > .children > .project > .name > a.bullet {
				opacity: 0.5 !important;
			}
			.list-nb > .children > .project > .name > a.bullet > svg {
				fill: transparent;
			}
			`

		GM.addStyle(css);
	}


	/**
	 * unhide the bullets in ordered lists
	 */
	function show_bullet_in_ol() {
		// unhide the bullets
		let css = `
		.list-ol > .children > .project > .name > .bullet {
			opacity: revert;
		}
		.list-ol > .children > .project > .name > .bullet > svg {
			fill: revert;
		}
		`

		// locate the numbers
		css += `
		.list-ol > .children > .project > .name:before {
			margin-left: -3px;
			margin-right: 5px;
		}
		`

		GM.addStyle(css);
	}


})();
