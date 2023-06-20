// Saves options to chrome.storage
function save_options() {
  var font_size = document.getElementById('font_size').value;
  var font_color = document.getElementById('font_color').value;
  chrome.storage.sync.set({
    StroedFontSize: font_size,
    StoredFontColor: font_color,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}



// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    StroedFontSize: 3,
    StoredFontColor: '#000000'
  }, function(items) {
    document.getElementById('font_size').value = items.StroedFontSize;
    document.getElementById('font_color').value = items.StoredFontColor;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
