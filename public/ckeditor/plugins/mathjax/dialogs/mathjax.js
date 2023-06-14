/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

CKEDITOR.dialog.add( 'mathjax', function( editor ) {
	
	var preview,
		lang = editor.lang.mathjax;

	var mathTextArea;

	return {
		title: lang.title,
		minWidth: 700,
		minHeight: 400,
		contents: [
			{
				id: 'info',
				elements: [
					{
						id: 'equation',
						type: 'textarea',
						label: lang.dialogInput,

						onLoad: function() {
							var that = this;
							mathTextArea = this;
						},

						setup: function( widget ) {
							// Remove \( and \).
							this.setValue( CKEDITOR.plugins.mathjax.trim( widget.data.math ) );
						},

						commit: function( widget ) {
							// Add \( and \) to make TeX be parsed by MathJax by default.
							widget.setData( 'math', '\\(' + this.getValue() + '\\)' );
						}
					},
					( !( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) ) && {
						id: 'preview1',
						type: 'html',
						html:
							'<div style="width:100%;text-align:center;">' +
								'<iframe  allow="clipboard-read; clipboard-write" frameborder="0"  style="width:600px; height: 600px" src="math_commands/index.html" id="softy_math_commands"></iframe>' +
							'</div>',

						 onLoad: function() {
							setTimeout(function(){
								var MathCommandsframe = document.getElementById('softy_math_commands');
								MathCommandsframe.contentWindow.postMessage(mathTextArea.getInputElement().getValue(), "*");
							
								window.addEventListener('message', event => {
									// IMPORTANT: check the origin of the data!
									if (event.origin === location.origin) {
										if(typeof event.data === "string"){
										mathTextArea.getInputElement().setValue(event.data)
										return event.data;
										}
										return;
									} else {
										return;
									}
								});
							}, 1000);
								
							
						 },
						
					}
				]
			}
		]
	};
} );
