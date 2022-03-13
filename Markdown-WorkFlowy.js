// ==UserScript==
// @name         Markdown-WorkFlowy
// @namespace    https://github.com/BettyJJ
// @version      0.1
// @description  Supports Markdown in WorkFlowy
// @author       Betty
// @match        https://workflowy.com/*
// @match        https://*.workflowy.com/*
// @run-at       document-idle
// @require      https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js
// @require      https://uicdn.toast.com/editor-plugin-code-syntax-highlight/latest/toastui-editor-plugin-code-syntax-highlight-all.min.js
// @grant        GM.addStyle
// @grant        GM_getResourceText
// @resource     TUI_CSS https://uicdn.toast.com/editor/latest/toastui-editor.min.css
// @resource     PRISM_CSS https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/themes/prism.min.css
// ==/UserScript==

(function () {
	'use strict';


	init();


	/**
	 * initialize
	 */
	function init() {

		wait_for_page_load();

		watch_page();

		load_css();

		// hide_note_raw();
	}


	/**
	 * wait till the page is loaded
	 */
	function wait_for_page_load() {

		const observer = new MutationObserver(function (mutation_list) {
			for (const { addedNodes } of mutation_list) {
				for (const node of addedNodes) {
					if (!node.tagName) continue; // not an element

					// this element appears when the page is loaded
					if (node.classList.contains('pageContainer')) {
						show_preview_button();
					}

				}
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });

	}


	/**
	 * show preview button
	 */
	function show_preview_button() {
		// show preview button
		const btn = document.createElement('a');
		btn.className = 'bmd-preview-button';
		btn.textContent = 'Preview MD';
		const active_page = document.querySelector('.page.active');
		active_page.insertAdjacentElement('afterend', btn);

		// insert preview box
		const preview = document.createElement('div');
		preview.className = 'bmd-preview-box';
		active_page.insertAdjacentElement('afterend', preview);

		// bind click event
		btn.addEventListener('click', function () {
			// toggle class for page container
			const page_container = document.querySelector('.pageContainer');
			page_container.classList.toggle('bmd-has-preview');

			// show the preview content if the box is not hidden
			if (page_container.classList.contains('bmd-has-preview')) {
				show_preview_content();
			}
		});
	}


	/**
	 * show the preview content
	 */
	function show_preview_content() {
		const raw = get_raw_content();

		const preview = document.querySelector('.bmd-preview-box');
		const editor = toastui.Editor;
		const viewer = editor.factory({
			el: preview,
			initialValue: raw,
			plugins: [[editor.plugin.codeSyntaxHighlight, { highlighter: Prism }]],
			viewer: true,
		});

		// assign the viewer instance to the DOM element, so we can access it later
		preview.viewer = viewer;

	}


	/**
	 * get raw content
	 * @returns {string}
	 */
	function get_raw_content() {
		const node_list = document.getElementsByClassName('innerContentContainer');

		let raw = '';
		for (let i = 0; i < node_list.length; i++) {
			const node = node_list[i];

			// sometimes there is repetition. don't know why, but we need to check and exclude it first
			const parent = node.parentElement;
			if (parent.getAttribute('style') === null || parent.getAttribute('style').indexOf('visibility') !== -1) {
				raw += node.textContent + '\n';
			}

		}

		return raw;
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
						update_preview();
					}

				}
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });

	}


	/**
	 * update preview if the preview box is shown
	 */
	function update_preview() {
		// only update the preview content if the box is not hidden
		const page_container = document.querySelector('.pageContainer');
		if (!page_container.classList.contains('bmd-has-preview')) {
			return;
		}

		const preview = document.querySelector('.bmd-preview-box');
		if (!preview) {
			return;
		}

		// update the preview
		const viewer = preview.viewer;
		const raw = get_raw_content();
		viewer.setMarkdown(raw, false);
	}


	/**
	 * load TUI Editor css
	 */
	function load_css() {
		const tui_css = GM_getResourceText('TUI_CSS');
		GM.addStyle(tui_css);

		const prism_css = GM_getResourceText('PRISM_CSS');
		GM.addStyle(prism_css);

		// override WF's interfering styles
		GM.addStyle(`
		.toastui-editor-contents th, .toastui-editor-contents tr, .toastui-editor-contents td {
			vertical-align: middle;
		}
		.toastui-editor-contents {
			font-size: 15px;
		}
		`);

		// style for the preview box
		GM.addStyle(`
		.bmd-preview-button {
			background: white;
			border: solid 1px;
			padding: 6px;
			position: absolute;
			right: 24px;
			top: 50px;
		}
		.bmd-preview-button:hover {
			background: lightgray;
			text-decoration: none;
		}

		.bmd-preview-box {
			display: none;
		}
		.bmd-has-preview .bmd-preview-box {
			display: block;
		}

		.bmd-has-preview {
			display: flex;
		}
		.bmd-has-preview .page.active {
			flex-basis: 50%;
			flex-grow: 1;
			padding-left: 24px;
			padding-right: 24px;
			word-break: break-word;
		}
		.bmd-preview-box {
			border: solid 1px lightgray;
			flex-basis: 50%;
			flex-grow: 1;
			margin-top: 72px;
			padding: 24px;
		}
		`);

	}


})();
