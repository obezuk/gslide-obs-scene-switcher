chrome.extension.sendMessage({
  "type" : "status"
});

function lock() {
  $("#connect").hide();
  $("#connecting").hide();
  $("#disconnect").show();
  $("#error").hide();
  $("#errmsg").text("");
}

function connect() {
  localStorage.setItem('ws_hostname', document.getElementById('hostname').value)
  localStorage.setItem('ws_port', document.getElementById('port').value)
  $("#hostname").prop("disabled", true);
  $("#port").prop("disabled", true);
  $("#connect").hide();
  $("#connecting").show();
  chrome.extension.sendMessage({
    "type" : "connect"
  });
}

function unlock() {
  $("#hostname").prop("disabled", false);
  $("#port").prop("disabled", false);
  $("#connect").show();
  $("#disconnect").hide();
  $("#connecting").hide();
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.type == "error") {
    $("#error").show();
    $("#errmsg").text("An error occurred while trying to connect to OBS.");
    return unlock();
  }

  if (request.type == "status") {
    if (request.status == "connected") {
      return lock();
    }
    if (request.status == "disconnected") {
      return unlock();
    }
    return;
  }
});

window.onload = function() {
  document.getElementById('hostname').value = localStorage.getItem('ws_hostname');
  document.getElementById('port').value = localStorage.getItem('ws_port');
  unlock();
  $("#error").hide();
}

$("#connect").click(function(event) {
  event.preventDefault();
  connect()
  return false;
});

$("#disconnect").click(function(event) {
  event.preventDefault();
  chrome.extension.sendMessage({
    "type" : "disconnect"
  });
  return false;
});