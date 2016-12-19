# things-you-can-do-in-a-web-worker

tldr; A list of available functionality and use cases for web workers. Have something to add? Submit a PR.

(List just started, Will grow soon)
Web Workers give web developers the apility to run code in multiple threads. This is great, now, what can we do with these threads? This document is meant to help provide context and real world use cases for these little wonders.


There is also a good list available [here](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Functions_and_classes_available_to_workers)

## APIS

### FileReader
https://developer.mozilla.org/en-US/docs/Web/API/FileReader

The file reader api allows you to read uploaded files.
You can now upload a file (say csv). send that to a web worker, read the file and parse it to json.

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

#### All use cases will use inline workers using the following function

for more info https://medium.com/@dee_bloo/make-multithreading-easier-with-inline-web-workers-a58723428a42#.4m4uweub3
```JS
function createWorker(fn) {
  var blob = new Blob(['self.onmessage = ', fn], { type: 'text/javascript' });
  var url = URL.createObjectUrl(blob);
  
  return new Worker(url);
}

```

### Filtering

Filter large data sets without blocking the UI thread and without making a full round trip to the server.

```JS
var filterWorker = createWorker(function (e) {
  self.postMessage(e.data.filter(function () {
    return e.flagged;
  }));
});

var hugeData = [ ... ];

filterWorker.postMessage(hugeData);
```

### Polling
Yes yes yes polling is gross, but sometimes it can be necessary, offload the grossness to a new thread.

```JS
var pollingWorker = createWorker(function (e) {
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

pollingWorker.onmessage = function () {
  // render data
}

pollingWorker.postMessage('init');
```
