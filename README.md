# things-you-can-do-in-a-web-worker

(List just started, Will grow soon)

A list of available functionality and use cases for web workers. Have something to add? Submit a PR.

There is also a good list available [here](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Functions_and_classes_available_to_workers)

## APIS

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

### Promises
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

"The Promise object is used for asynchronous computations. A Promise represents an operation that hasn't completed yet, but is expected in the future."

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

worker.postMessage(hugeData);
```

### Data Store

Keep your source data safe and away from your UI thread and avoid unintended side effects.

```JS
var storeWorker = createWorker(function (e) {
  switch(e.data.type) {
    'save':
      self.state = e.data.value;
      self.postMessage(state);
      break;
    
    default:
      self.postMessage(state);
  }
});

// listen for updates to your state
worker.addEventListener('message', function (e) {
  console.log(e.data);
});

// save new data
worker.postMessage({
  type: 'save',
  value:{ ...new stuff }
});
```
