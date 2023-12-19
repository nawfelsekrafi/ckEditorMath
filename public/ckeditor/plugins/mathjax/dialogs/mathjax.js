/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

"use strict";



CKEDITOR.dialog?.add("mathjax", function (editor) {
  var preview,
    lang = editor.lang.mathjax;

  var mathTextArea;
  var isLoaded = false;
  return {
    title: lang.title,
    minWidth: 400,
    minHeight: 400,
    contents: [
      {
        id: "info",
        elements: [
          {
            id: "equation",
            type: "textarea",
            label: "Equation Editor √",

            onLoad: function () {
              mathTextArea = this;
              this.getInputElement().on('input', function () {
                mathTextArea.onChange();
              });
            },

            setup: function (widget) {
              mathTextArea = this;
              // Remove \( and \).
              this.setValue(CKEDITOR.plugins.mathjax.trim(widget.data.math));
              var MathCommandsframe = document.getElementById(
                "softy_math_commands"
              );
              MathCommandsframe.contentWindow.postMessage(
                this.getInputElement().getValue(),
                "*"
              );
            },

            commit: function (widget) {
              // Add \( and \) to make TeX be parsed by MathJax by default.
              widget.setData("math", "\\(" + this.getValue() + "\\)");
            },
            onChange: function () {
              var MathCommandsframe = document.getElementById(
                "softy_math_commands"
              );
              MathCommandsframe.contentWindow.postMessage(
                this.getInputElement().getValue(),
                "*"
              );
              mathTextArea.focus();
            },
          },
          !(CKEDITOR.env.ie && CKEDITOR.env.version == 8) && {
            id: "preview1",
            type: "html",
            html:
              '<div style="width:100%;text-align:center;">' +
              '<iframe  allow="clipboard-read; clipboard-write" frameborder="0"  style="width:540px; height: 380px" src="../../ckeditor/math_commands/index.html" id="softy_math_commands"></iframe>' +
              "</div>",

            onLoad: function () {
              makeMathCommandResponsive(this);
              // if (!isLoaded) {
              isLoaded = true;



              window.addEventListener("message", (event) => {
                // IMPORTANT: check the origin of the data!

                // on first render wait the math command iframe to fully render then send a message.
                if (
                  event.origin === location.origin &&
                  event.data.source === "softy_math_commands" &&
                  event.data.ready
                ) {
                  var MathCommandsframe = document.getElementById(
                    "softy_math_commands"
                  );
                  // Once the "ready" message is received, send the postMessage
                  MathCommandsframe.contentWindow.postMessage(
                    mathTextArea.getInputElement().getValue(),
                    "*"
                  );
                }

                if (
                  event.origin === location.origin &&
                  event.data.source === "softy_math_commands" &&
                  !event.data?.ready
                ) {
                  if (event.data.type === "saveEvent") {
                    mathTextArea.getInputElement().setValue(event.data.data);
                    const okButton = document.getElementsByClassName(
                      "cke_dialog_ui_button_ok"
                    )[0];
                    if (okButton) {
                      okButton.click();
                    }
                  } else if (event.data.type === "cancelEvent") {
                    const cancelButton = document.getElementsByClassName(
                      "cke_dialog_close_button"
                    )[0];
                    if (cancelButton) {
                      cancelButton.click();
                    }
                  }
                  else if (event.data.type === "updateEvent") {
                    mathTextArea.getInputElement().setValue(event.data.data);
                  }
                }
              });
              // }
            },
          },
        ],
      },
    ],
    onLoad: function () {
      // Hide the OK and Cancel buttons using CSS
      var dialogElement = this.getElement().getParent();
      var okButton = dialogElement.findOne(".cke_dialog_ui_button_ok");
      var defaultEquationTextArea = dialogElement.findOne(
        ".cke_dialog_ui_input_textarea "
      );
      var cancelButton = dialogElement.findOne(".cke_dialog_ui_button_cancel");

      if (okButton) {
        okButton.setStyle("display", "none");
      }

      if (cancelButton) {
        cancelButton.setStyle("display", "none");
      }

      var dialogContainer = dialogElement.findOne(".cke_dialog");
      var InnerContainer = dialogElement.findOne(".cke_dialog_contents_body");

      function updateDialogHeight() {
        var windowHeight = window.innerHeight;
        var dialogHeight = 400;

        if (window.innerWidth <= 550) {
          dialogHeight = windowHeight;
        }

        dialogContainer.setStyle("height", dialogHeight + "px");
        InnerContainer.setStyle("height", dialogHeight - 88 + "px");
      }

      updateDialogHeight();
      window.addEventListener("resize", updateDialogHeight);
    },
  };
});

function makeMathCommandResponsive(that) {
  var iframes = Array.from(that.getElement().find("#softy_math_commands"));

  function applyResponsiveStyle() {
    iframes.forEach(function (iframe) {
      if (window.innerWidth <= 550) {
        iframe.setStyle("width", "94vw");
      } else {
        iframe.setStyle("width", "540px");
      }
    });
  }

  applyResponsiveStyle();
  window.addEventListener("resize", applyResponsiveStyle);
}
