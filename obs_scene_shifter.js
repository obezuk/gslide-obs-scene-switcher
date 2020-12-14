function changeScene(sceneName) {
  chrome.runtime.sendMessage({
    type : "changeScene",
    sceneName : sceneName
  });
}

function checkEditorScene() {
  var speakernotes = document.getElementById("speakernotes");
  if (!speakernotes) {
    return;
  }
  changeScene(findScene(speakernotes.innerHTML));
}

function checkPresenterScene() {
  var presenterNotes = window.document.getElementsByClassName("punch-viewer-speakernotes-text-body");
  changeScene(findScene(presenterNotes.item(0).innerHTML));
}

function findScene(text) {
  var SCENENAME_REGEX = /OBS:([a-zA-Z\d-_]+)/;
  if (SCENENAME_REGEX.test(text)) {
    var matches = text.match(SCENENAME_REGEX);
    var sceneName = matches[1];
    return sceneName
  }
}

function checkEditorScene() {
  var speakernotes = document.getElementById("speakernotes");
  if (!speakernotes) {
    return;
  }
  changeScene(findScene(speakernotes.innerHTML));
}

if (window.opener && window.opener !== window) {
  var createObserver = setInterval(function() { // It takes a while for the Speaker notes section to become available if you launch via Editor.
      if (window.document.getElementsByClassName("punch-viewer-speakernotes-text-body").item(0)) {
        clearInterval(createObserver);
        checkPresenterScene();
        notesObserver = new MutationObserver(checkPresenterScene);
        notesObserver.observe(window.document.getElementsByClassName("punch-viewer-speakernotes-text-header")[0], {
          attributes: true,
          childList: true,
          subtree: true
        }); 
      }
  }, 100);
} else {
  // checkEditorScene();
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message == "EVENT_EDITOR_CURRENT_SCENE") {
    checkEditorScene();
  }
});