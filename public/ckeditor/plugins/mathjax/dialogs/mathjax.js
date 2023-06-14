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
		minHeight: 500,
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

							if ( !( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) ) {
								this.getInputElement().on( 'keyup', function() {
									// Add \( and \) for preview.
									// preview.setValue( '\\(' + that.getInputElement().getValue() + '\\)' );
								} );
							}
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
					// !(CKEDITOR.env.ie && 8 == CKEDITOR.env.version) && {
					// 	id: "preview", type: "html", html: '\x3cdiv style\x3d"width:100%;text-align:center;"\x3e\x3ciframe style\x3d"border:0;width:0;height:0;font-size:20px" scrolling\x3d"no" frameborder\x3d"0" allowTransparency\x3d"true" src\x3d"' +
					// 		CKEDITOR.plugins.mathjax.fixSrc + '"\x3e\x3c/iframe\x3e\x3c/div\x3e', 
					// 		onLoad: function () { 
					// 			var a = CKEDITOR.document.getById(this.domId).getChild(0); 
					// 			preview = new CKEDITOR.plugins.mathjax.frameWrapper(a, editor) ;
					// 		}, 

					// 		setup: function (a) { preview.setValue(a.data.math) }
					// },
					( !( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) ) && {
						id: 'preview1',
						type: 'html',
						html:
							'<div style="width:100%;text-align:center;">' +
								'<iframe  allow="clipboard-read; clipboard-write" frameborder="0"  style="width:600px; height: 600px" src="https://nawfelsekrafi.github.io/mathCommands/" id="softy_math_commands"></iframe>' +
							'</div>',

						 onLoad: function() {
							setTimeout(function(){
								var MathCommandsframe = document.getElementById('softy_math_commands');
								console.log(mathTextArea.getInputElement().getValue())
								MathCommandsframe.contentWindow.postMessage(mathTextArea.getInputElement().getValue(), 'https://nawfelsekrafi.github.io');
							
								window.addEventListener('message', event => {
									// IMPORTANT: check the origin of the data!
									if (event.origin === 'https://nawfelsekrafi.github.io') {
										console.log("message from math commands");
										console.log(event.data);
										mathTextArea.getInputElement().setValue(event.data)
										// preview.setValue( '\\(' + event.data + '\\)' );
										return event.data;
									} else {
										return;
									}
								});
							}, 1000);
								
							
						 },

					 setup: function( widget ) {
						 	// preview.setValue( widget.data.math );
							 setTimeout(function(){
								var MathCommandsframe = document.getElementById('softy_math_commands');
								console.log(mathTextArea.getInputElement().getValue())
								MathCommandsframe.contentWindow.postMessage(mathTextArea.getInputElement().getValue(), 'https://nawfelsekrafi.github.io');
							
								window.addEventListener('message', event => {
									// IMPORTANT: check the origin of the data!
									if (event.origin === 'https://nawfelsekrafi.github.io') {
										console.log("message from math commands");
										console.log(event.data);
										mathTextArea.getInputElement().setValue(event.data)
										// preview.setValue( '\\(' + event.data + '\\)' );
										return event.data;
									} else {
										return;
									}
								});
							}, 1000);
						 }	
						
					}
				]
			}
		]
	};
} );
