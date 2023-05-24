// background.js


let save_latex = "";
let save_history = "";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ save_latex });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ save_history });
});
