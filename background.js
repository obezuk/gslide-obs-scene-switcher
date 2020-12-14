var OBSConnection = null;

if (!localStorage.getItem('ws_hostname')) localStorage.setItem('ws_hostname', 'localhost');
if (!localStorage.getItem('ws_port')) localStorage.setItem('ws_port', '4444');

function generateMessageId() {
  return Date.now();
}

function OBSClient(endpoint) {
  
  var conn = {};
  conn._websocket = new WebSocket(endpoint); 

  conn._websocket.onopen = function(event) {
    console.log('Websocket connected')
    chrome.extension.sendMessage({
      "type" : "status",
      "status" : "connected"
    });
  }

  conn._websocket.onclose = function() {
    console.log('Websocket disconnected')
    chrome.extension.sendMessage({
      "type" : "status",
      "status" : "disconnected"
    });
  }

  conn._websocket.onmessage = function(msg) {
    var data = JSON.parse(msg.data);
    if (data.status == "error") {
      if (data.error == "requested scene does not exist") {
        console.warn(data.error)
      }
    } else {
      // console.log(data);
    }
  }

  conn._websocket.onerror = function(err) {
    console.warn(err);
    chrome.extension.sendMessage({
      "type" : "error",
      "err" : err
    });
  }

  conn.close = function() {
    console.log('User disconnected')
    conn._websocket.close();
  }

  conn.changeScene = function(sceneName) {
    console.log('SetCurrentScene: ', sceneName);
    var messageId = generateMessageId();
    var params = { "request-type" : "SetCurrentScene", "message-id" : messageId, "scene-name" : sceneName };
    conn._websocket.send(JSON.stringify(params));
  }

  return conn;
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.type == "changeScene") {
    if (OBSConnection) {
      OBSConnection.changeScene(request.sceneName)
    } else {
      console.log('Not updating scene to ' + request.sceneName + " because OBS is not connected.");
    }
    return;
  }

  if (request.type == "connect") {
    if (OBSConnection) {
      OBSConnection.close();
      OBSConnection = null;
    }
    var hostname = localStorage.getItem('ws_hostname')
    var port = localStorage.getItem('ws_port')
    var ws_endpoint = "ws://" + hostname + ":" + port;
    OBSConnection = new OBSClient(ws_endpoint);    
    return;

  }

  if (request.type == "disconnect") {
    if (OBSConnection) {
      OBSConnection.close();
      OBSConnection = null;
    }
    return;
  }

  if (request.type == "status") {
    if (OBSConnection) {
      chrome.extension.sendMessage({
        "type" : "status",
        "status" : "connected"
      });
    } else {
      chrome.extension.sendMessage({
        "type" : "status",
        "status" : "disconnected"
      });
    }
  }

});

// Monitor Editing View
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url) {
    var url = new URL(changeInfo.url);

    if ((url.host !== "docs.google.com") && !(url.pathname.startsWith('/presentation/'))) {
      return;
    }
    chrome.tabs.sendMessage( tabId, {
      message: 'EVENT_EDITOR_CURRENT_SCENE',
      url: changeInfo.url
    })
  }
});

chrome.runtime.onInstalled.addListener(function() {

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {

    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          hostEquals: 'docs.google.com',
          pathPrefix: '/presentation'
        },
      })
      ],
          actions: [
            new chrome.declarativeContent.ShowPageAction()
          ]
    }]);
  });

});