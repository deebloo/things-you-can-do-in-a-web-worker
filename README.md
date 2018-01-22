# things-you-can-do-in-a-web-worker

tldr; A list of available functionality and use cases for web workers. Have something to add? Submit a PR.

(List just started, Will grow soon)
Web Workers give web developers the apility to run code in multiple threads. This is great, now, what can we do with these threads? This document is meant to help provide context and real world use cases for these little wonders.

## Sweet Links
- https://github.com/mchaov/WebWorkers
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Functions_and_classes_available_to_workers

## APIS

### FileReader
https://developer.mozilla.org/en-US/docs/Web/API/FileReader

The file reader api allows you to read uploaded files.
You can now upload a file (say csv). send that to a web worker, read the file and parse it to json without blocking the main UI thread.

### IndexedDB
https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

"IndexedDB is a way for you to persistently store data inside a user's browser. Because it lets you create web applications with rich query abilities regardless of network availability, your applications can work both online and offline."

### Web Notifications
https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API

Web Notifications allow you to send pop up style notifications to users even when they do not have your site open.

### XMLHttpRequest
https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest

Lets you make a network request.

### Fetch
https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

The Fetch API is a modern replacement for XMLHttpRequest and is closer to a lot of the libraries we are used to.

### Web Sockets
https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API

"WebSockets is an advanced technology that makes it possible to open an interactive communication session between the user's browser and a server. With this API, you can send messages to a server and receive event-driven responses without having to poll the server for a reply."

## USE CASES

### Filtering

Filter large data sets without blocking the UI thread and without making a full round trip to the server.

```JS
// filter-worker.js
self.onmessage = function () {
  self.postMessage(e.data.filter(function () {
    return e.flagged;
  }));
}

// app.js
var filterWorker = new Worker('filter-worker.js');

filterWorker.onmessage = function (e) {
  // Log filtered list
  console.log(e.data);
}

var hugeData = [ ... ];

filterWorker.postMessage(hugeData);
```

### Polling
Yes yes yes polling is gross, but sometimes it can be necessary, offload the grossness to a new thread.
NOTE: web workers will hold their state but NOT permenantly, so don't keep anything in them that you can't get some other way.

```JS
// polling-worker.js
self.onmessage = function (e) {
  var cache;
  
  function compare(newData, oldData) { ... };
  
  var myRequest = new Request('/my-api-endpoint');
  
  setInterval(function () {
    fetch(myRequest).then(function (res) {
      var data = res.json();
      
      if(!compare(data, cache)) {
        cache = data;
        
        self.postMessage(data);
      }
    })
  }, 1000)
});

// app.js
var pollingWorker = new Worker('polling-worker.js');

pollingWorker.onmessage = function () {
  // render data
}

pollingWorker.postMessage('init');
```
