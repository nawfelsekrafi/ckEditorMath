

let formulaButton = document.getElementById("formulaButton");
document.getElementById("closeReviewDialog").addEventListener("click", closeReviewDialog);
document.getElementById("toIMG").addEventListener("click", toPNG2);
// document.getElementById("clear").addEventListener("click", clear);
document.getElementById("keyboard").addEventListener("click", MouseDownEvent);
document.getElementById("closeWelcomeDialog").addEventListener("click", closeWelcomeDialog);

// copy latex
document.getElementById("copy_latex").addEventListener("click", toLatex);

// history
// document.getElementById("history").addEventListener("click", openHistoryDialog);
document.getElementById("closeHistoryDialog").addEventListener("click", closeHistoryDialog);
document.getElementById("latexHistoryHTML").addEventListener("click", clickHistoryDialog);

// matrix dialog
document.getElementById("closeMatrixDialog").addEventListener("click", closeMatrixDialog);
document.getElementById("cancelMatrixDialog").addEventListener("click", cancelMatrixDialog);





//Math Quill
var mathFieldSpan = document.getElementById('math-field-0');

//Math Quill main edit field
//var mathField;
var mathFieldArray = new Array();
var mathFieldFocus = 0;
document.getElementById("output_area").addEventListener("click", OutputMouseDown);

//checks if delete should erase a line or not
var deleteFlag = false;


// latex history array
var latexHistory = new Array();
const HISTORY_LENGTH = 30;

// useful Latex help
// https://en.wikibooks.org/wiki/LaTeX/Mathematics

// Constant used for the math keyboard commands
const MQ_CMD = "MQ_CMD";
const MQ_WRITE_0L = "MQ_WRITE_0L";
const MQ_WRITE_1L = "MQ_WRITE_1L";
const MQ_WRITE_2L = "MQ_WRITE_2L";
const MQ_WRITE_3L = "MQ_WRITE_3L";
const MQ_MATRIX = "MQ_MATRIX";

// Constants used for the review dialog
const REVIEW_FIRST_TIME = 5;
const REVIEW_SECOND_TIME = 50;



//Size of the fonts used in the copy of the formula to image
let font_size = 3;

const BLACK_COLOR = '#000000'
let font_color = BLACK_COLOR;
let font_background = 'green';

// unique user ID - it is generated first time the user use the extention and then is save in the chrome storage
let user_id = "";
let session_id=Math.random().toString().slice(2,11);

// Remember what was the last key
//let last_key_code = 0;

//*************************************************************
//
// This section is the math keyboard utility functions
//
//*************************************************************

//We use this fnctions to trun the HEX colors to RGB - MathJax recieve just RGB
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return 'rgb(' + parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + ')';
}

//function that writes matrices
function writeMatrix(rows, columns, shape){
  var matrix_string = "";
  for(let i = 1; i < rows; i++){
    for(let j = 1; j < columns; j++){
      matrix_string += "&";
    }
    matrix_string += "\\\\";
  }
  for(let j = 1; j < columns; j++){
    matrix_string += "&";
  }
  mathFieldArray[mathFieldFocus].write("\\begin{" + shape + "matrix}" + matrix_string + "\\end{" + shape + "matrix}");
}

//*************************************************************
//
// This section is the math keyboard functions
//
//*************************************************************

// this function clear the math field
function clear() {

  output_area_div = document.getElementById("output_area");

  var children = output_area_div.getElementsByTagName("newLineItem");

  var length = children.length;
  for(i= length; i >0; i--){
    children[0].remove();
  }

  length = mathFieldArray.length;
  for(i = 1; i < length; i++){
    mathFieldArray.pop();
  }

  // for(i = mathFieldArray.length; i > 0; i--){
  //   if (output_area_div.hasChildNodes()) {
  //       output_area_div.removeChild(output_area_div.children[i]);
  //   }
  // }
  //
  mathFieldArray[0].latex("");
  mathFieldArray[0].focus();
  mathFieldFocus = 0;

}

// This function read Latex from a global page vairable svg and transform it to an png img
// Then it copy the png to the clipboard - this can be past into a document
async function toPNG2(){

  var latex = ReturnLatex();

  if(latex == "")
    return;

  let queueString = latex;
  queueString = queueString.trim();
  //console.log("in toPNG latex is " + queueString);
  //Get the size of the font for the copy from the options

  let rgb_color = hexToRgb(font_color);

  var newurl = "";

  let encodedURLInput = encodeURIComponent(queueString);
  if(font_color == "#000000"){
    newurl='https://us-central1-mathkeyboards-347222.cloudfunctions.net/latex2IMG?lex=' + encodedURLInput  + '&size=' + font_size;
  }else{
    newurl='https://us-central1-mathkeyboards-347222.cloudfunctions.net/latex2IMG?lex=' + '\\color{' + rgb_color + '}{' + encodedURLInput  + '}&size=' + font_size;
  }
  //newurl='http://localhost:5001/mathkeyboards-347222/us-central1/latex2IMG?lex=' + encodedURLInput + '&size=' + font_size;

  try{
    const response = await fetch(newurl);
    //const data = await response.json();

    const data = await response.blob();
    //console.log('Success POST fetch data: ', data);

    if (data.size == 0){
      console.log("in toPNG - blob size is 0 - no return image from google functions");
      return;
    }

    //copy the image to clipboard
    navigator.clipboard.write([new ClipboardItem({ "image/png": data }),]);

  } catch(error){
      alert("Sorry, COPY failed - please try clicking on COPY again\n\nIf the problem persists, please contact us by clicking on the feedback icon on the bottom left corner of the extension")
      console.log("error in toIMG error: " + error);
      trackEvent(error,'error');
  }

  saveToHistory();
  trackEvent('Copy','copy_image');
}

//*************************************************************
//
//* from here on is the keyboard script */
//
//*************************************************************

function MouseDownEvent(e) {
    x = e.clientX;
    y= e.clientY;

    let keyElement = document.elementFromPoint(x, y);
    // alert(keyElement);

    // Some of the keyboards has <sup> tag for nicer UI - we need to get the parent element to undrstand which key was pressed
    if(keyElement.nodeName == "SUB" || keyElement.nodeName == "SUP")
      keyElement = keyElement.parentNode;

    let c = document.elementFromPoint(x, y).innerHTML;

    let datachar = keyElement.getAttribute("data-char");
    let latexType = keyElement.getAttribute("latex_type");
    if(datachar == null)
      return;

    switch(latexType){
        case MQ_CMD:
           mathFieldArray[mathFieldFocus].cmd(datachar);
           break;
        case MQ_WRITE_0L:
            mathFieldArray[mathFieldFocus].write(datachar);
            break;
        case MQ_WRITE_1L:
            mathFieldArray[mathFieldFocus].write(datachar);
            mathFieldArray[mathFieldFocus].keystroke('Left');
            break;
         case MQ_WRITE_2L:
            mathFieldArray[mathFieldFocus].write(datachar);
            mathFieldArray[mathFieldFocus].keystroke('Left');
            mathFieldArray[mathFieldFocus].keystroke('Left');
            break;
        case MQ_WRITE_3L:
            mathFieldArray[mathFieldFocus].write(datachar);
            mathFieldArray[mathFieldFocus].keystroke('Left');
            mathFieldArray[mathFieldFocus].keystroke('Left');
            mathFieldArray[mathFieldFocus].keystroke('Left');
            break;
        case MQ_MATRIX:
            let matrix_dialog = document.getElementById("matrix_dialog");
            matrix_dialog.showModal();
            break;
        default:
            mathFieldArray[mathFieldFocus].cmd(datachar);
    }
    //saveLatex();
    mathFieldArray[mathFieldFocus].focus();
    trackEvent(datachar,'keyboard_click');
};


document.body.addEventListener('keyup', function (e) {
  if(e.key === "Enter"){
    addNewLine();
  }
  if(mathFieldArray[mathFieldFocus].latex() == "" && mathFieldFocus != 0 && e.key === "Backspace"){
    if(deleteFlag){
      output_area_div = document.getElementById("output_area");
      var children = output_area_div.getElementsByTagName("newLineItem");
      children[mathFieldFocus-1].remove();

      mathFieldArray.splice(mathFieldFocus, 1);
      mathFieldFocus = mathFieldFocus-1;
      mathFieldArray[mathFieldFocus].focus();
      deleteFlag = false;
    }else {
      deleteFlag = true;
    }
  }

  //saveLatex();
});

// Save the latex of the mathFields when the window is closed
window.onblur = function(){
  //saveLatex();
}

// Store the latex from the field math into chorme vaiables, so when user close and open the extention, they will see the same forumula,
// untill the click on new
function saveLatex(){
  //chrome.storage.sync.set({ "save_latex" : mathFieldArray[mathFieldFocus].latex()});
  //var stringified = JSON.stringify(mathFieldArray);
  var latexArray = new Array();
  var length = mathFieldArray.length;
  for(i = 0; i < length; i++){
    latexArray.push(mathFieldArray[i].latex());
  }
  var stringified = JSON.stringify(latexArray);
  // alert(stringified);
  //alert(stringified);
  chrome.storage.sync.set({ "save_latex" : stringified});
}

// Fill the output area withe the saved stringify latex
// The latexString is a stringfy array of latex forumulas
// Add new line for every arrage item
function loadLatexToOutputArea(latexString) {
  try{
    var latexArray = JSON.parse(latexString);
    mathFieldArray[0].write(latexArray[0]);
    mathFieldFocus = 0;
    for(i = 1; i < latexArray.length; i++){
      addNewLine();
      mathFieldArray[i].write(latexArray[i]);
      mathFieldFocus = i;
    }
  } catch{
      mathFieldArray[0].write("");
  }
  mathFieldArray[mathFieldFocus].focus();

}

function latexEscape(str) {
  // Replace a \ with $\backslash$
  // This is made more complicated because the dollars will be escaped
  // by the subsequent replacement. Easiest to add \backslash
  // now and then add the dollars
  // Must be done after escape of \ since this command adds latex escapes
  // Replace characters that can be escaped
  // Replace ^ characters with \^{} so that $^F works okay
  // Replace tilde (~) with \texttt{\~{}} # Replace tilde (~) with \texttt{\~{}}
  var list = ["\\", "^", "~", "&", "%", "$", "#", "_", "{", "}"];
  var change_to = ["\\\\", "\\^{}", "\\texttt{\\~{}}", "\\&", "\\%", "\\$", "\\#", "\\_", "\\{", "\\}"];

  for (var i = 0; i < list.length; i++) {
    if (str.includes(list[i])) {
      str = str.replace(new RegExp(list[i], 'g'), change_to[i]);
      break;
    }
  }
  
  return str;
}


// **************************************************************************
//
// This fucntion happen every time a user open the extention
//
// **************************************************************************
var softyEditor = null;
window.onload = (event) => {
  //chrome.storage.sync.set({dont_show_welcome: false});
  initialMQ();
  trackEvent('Main Window', 'open_extention');

  
  window.addEventListener('message', event => {
    // IMPORTANT: check the origin of the data!
        softyEditor = event;
        mathFieldArray[mathFieldFocus].latex(String.raw`${softyEditor.data}`);  // Assign specific value
        mathFieldArray[mathFieldFocus].focus();

});


  i18n();

}; //end of onload function\

//close review dialgo function
//if user presses on the check box, the dialog will no longer open
function closeReviewDialog(){

  let review_dialog = document.getElementById("review_dialog");
  let dont_show_again = document.getElementById("dont_show_review");
  if(!dont_show_again.checked){

    // If the dont show again is checked - we put the count down by one - so it will open again next time
    chrome.storage.sync.get({UseCount:1}, function(result) {
        count = result.UseCount - 1;
        chrome.storage.sync.set({UseCount: count});
    });
  }
  review_dialog.close();
}


//close welcome dialoge function
//if user presses on the check box, the dialog will no longer open
function closeWelcomeDialog(){

  let welcome_dialog = document.getElementById("welcome_dialog");
  let dont_show_again = document.getElementById("dont_show_again");
  if(dont_show_again.checked){
    chrome.storage.sync.set({dont_show_welcome: true});
  }
  welcome_dialog.close();
}

// document.querySelector('#go-to-options').addEventListener('click', function() {
//   if (chrome.runtime.openOptionsPage) {
//     chrome.runtime.openOptionsPage();
//   } else {
//     window.open(chrome.runtime.getURL('options.html'));
//   }
// });


// Initatlize the MathQuill editable field
function initialMQ() {
    var MQ = MathQuill.getInterface(2); // for backcompat
  
    // MQ.StaticMath(problemSpan);

    mathFieldArray[mathFieldFocus] = MQ.MathField(mathFieldSpan, {
      spaceBehavesLikeTab: false, // configurable
      handlers: {
        edit: function() { // useful event handlers
        }
      }
    });

    mathFieldArray[mathFieldFocus].focus();
}


// **************************************************************************
//
// Google Analytics tracking
//
// **************************************************************************

function ga4(name, eventName) {
// disabled google analytics :D
        // fetch(`https://www.google-analytics.com/mp/collect?measurement_id=G-BXWWE6WN4H&api_secret=w-ns_TQPQCGsuuclyyZPog`, {
        //   method: "POST",
        //   body: JSON.stringify({
        //     client_id: user_id,
        //     events: [{
        //       name: eventName,
        //       params: {
        //         "engagement_time_msec": "100",
        //         "session_id": session_id,
        //         "language": "en-",
        //         "user_id": user_id,
        //         "link_id": name,
        //      },
        //     }]
        //   })
        // });
      }

function trackEvent(name, eventName) {
  ga4(name, eventName);
};

/*********************** END Google Analytics *********************************/

//internationalizes language
function i18n(){
  var elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element)=>{
      var searchString = element.getAttribute("data-i18n");
      // var message = chrome.i18n.getMessage(searchString);
      // element.innerHTML = message;
  });

} // end of i18n

// copy latex into clipboard
function toLatex(){
  var latex = ReturnLatex();
  navigator.clipboard.writeText(latex);
  trackEvent('Copy Latex', 'copy_latex');
  if(softyEditor){
    softyEditor.source.postMessage(
      latex,
      softyEditor.origin
    );
  }else {
    console.log("softyEditor is null");
  }
 
} // end of toLatex


// history code

function saveToHistory(){
  //if (mathFieldArray[mathFieldFocus] != mathFieldArray[MathFieldFocus -1]){}
  // The history is an array of the history that holds array of the multiline math fields
  // first we strinfigy the multiline array to sring and then add to the history array

  // create array of latex values similar to what is in the mathField
  var latexArray = new Array();
  var length = mathFieldArray.length;
  for(i = 0; i < length; i++){
    latexArray.push(mathFieldArray[i].latex());
  }
  var stringified = JSON.stringify(latexArray);

  // check if value is the same as the previous one saved to history
  if(latexHistory.length > 0){
    if(stringified == latexHistory[0]){
      return;
    }
  }

  //add new values to the history array
  latexHistory.unshift(stringified);
  if(latexHistory.length >= HISTORY_LENGTH){
    latexHistory.pop();
  }

  //save the entire history to chrome storage
  let savedString = JSON.stringify(latexHistory);
  // chrome.storage.sync.set({ "save_history" : savedString});
}

// open history dialog
function openHistoryDialog(){
  let history_dialog = document.getElementById("history_dialog");
  history_dialog.showModal();


  var MQ = MathQuill.getInterface(2); // for backcompat


  // create a line for each latex in the array
  latexHistoryHTMLDiv = document.getElementById("latexHistoryHTML");

    while (latexHistoryHTMLDiv.firstChild) {
        latexHistoryHTMLDiv.removeChild(latexHistoryHTMLDiv.firstChild);
    }

  for(let i = 0; i < latexHistory.length; i++){
    var latexItem = document.createElement("latexItem");

    // turn the stringifly string in the history to an arrang
    // show in the history dialgo only the first line
    var latexArray = JSON.parse(latexHistory[i]);
    moreLines = "";
    if(latexArray.length > 1)
      moreLines = "\\ ...";

    var copy_text = chrome.i18n.getMessage("edit_button");
    latexItem.innerHTML = '<p><button style="float: left;" class="button" id="editHistory" latex="'+ i + '">' + copy_text + '</button><span align="right" class="historyText" id="problem'+ i + '">' + latexArray[0] + moreLines + '</span><hr class="hr"></p>';
    latexHistoryHTMLDiv.appendChild(latexItem);

    var problemSpan = document.getElementById('problem' + i);
    MQ.StaticMath(problemSpan);

  }

}

//closes history dialog
function closeHistoryDialog(){
  let history_dialog = document.getElementById("history_dialog");
  history_dialog.close();
}

// allows to edit history
function clickHistoryDialog(e){
  x = e.clientX;
  y= e.clientY;

  let keyElement = document.elementFromPoint(x, y);

  if(keyElement.tagName == 'BUTTON'){
    clear();
    let latexArrayID = keyElement.getAttribute("latex");
    loadLatexToOutputArea(latexHistory[latexArrayID]);
    //saveLatex();
    trackEvent('Edit History', 'use_history');
    closeHistoryDialog();
    mathFieldArray[mathFieldFocus].focus();
  }
}

// end of history

//matrix dialog

//closes matrix dialog
function closeMatrixDialog(){
  let matrix_shape = "p";
  let matrix_row = document.getElementById("_rows").value;
  let matrix_column = document.getElementById("_columns").value;
  if(document.getElementById("bracket_matrix").checked){
    matrix_shape = "b";
  }else{
    matrix_shape = "p";
  }
  let matrix_dialog = document.getElementById("matrix_dialog");
  matrix_dialog.close();
  trackEvent('r:' + matrix_row +' c:' + matrix_column , 'use_matrix');
  writeMatrix(matrix_row, matrix_column, matrix_shape);
}
//cancel Matrix dialgo
function cancelMatrixDialog(){
  let matrix_dialog = document.getElementById("matrix_dialog");
  matrix_dialog.close();
}

//end of matrix dialog

// multi-line areas

function addNewLine(){
  var newLineItem = document.createElement("newLineItem");

  output_area_div = document.getElementById("output_area");

  arrayLength = mathFieldArray.length;

  newLineItem.innerHTML = '<p><center><span class="math-field" id="math-field-' + arrayLength + '"></span></center></p>';
  output_area_div.appendChild(newLineItem);

  var MQ = MathQuill.getInterface(2);
  var mathFieldSpan = document.getElementById('math-field-'+ arrayLength);
  newLineItem = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: false, // configurable
    handlers: {
      edit: function() { // useful event handlers
      }
    }
  });
  mathFieldArray.push(newLineItem);
  mathFieldFocus = arrayLength;
  mathFieldArray[arrayLength].focus();
}

//This function is finding with MathField element is in focus and set the global
//variable of mathFieldFocus to it
function OutputMouseDown(e) {
    x = e.clientX;
    y= e.clientY;

    let keyElement = document.elementFromPoint(x, y);
    while(keyElement.className != "output_area"){
      if(keyElement.className.includes("math-field")){
        // alert(keyElement.outerHTML);
        // alert(keyElement.className);
        var position = keyElement.id[11];
        // alert(position);
        mathFieldFocus = position;
      }
      keyElement = keyElement.parentElement;
    }

};

function ReturnLatex(){
  if(mathFieldArray.length == 1){
    latex = mathFieldArray[mathFieldFocus].latex();
  }else{
    latex = "\\begin{align}&" + mathFieldArray[0].latex();;

    for(i=1; i<mathFieldArray.length; i++){
      latex += "\\\\&" + mathFieldArray[i].latex();
    }

    latex += "\\end{align}";
  }
  return latex;
}
