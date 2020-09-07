# Things You Can Do In A Web Worker

tldr; A list of available functionality and use cases for web workers. Have something to add? Submit a PR.

Web Workers give web developers the apility to run code in multiple threads. This is great, now, what can we do with these threads? This document is meant to help provide context and real world use cases for these little wonders.

## Tooling

A lot of your favorite tools have excellent support for web workers, making them even easier to use!

- [Rollup](examples/rollup)
- [Webpack](examples/webpack)

## Available APIS

### [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)

The file reader api allows you to read uploaded files.
You can now upload a file (say csv). send that to a web worker, read the file and parse it to json without blocking the main UI thread.

### [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)

"IndexedDB is a way for you to persistently store data inside a user's browser. Because it lets you create web applications with rich query abilities regardless of network availability, your applications can work both online and offline."

### [Web Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API)

Web Notifications allow you to send pop up style notifications to users even when they do not have your site open.

### [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)

Lets you make a network request.

### [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

The Fetch API is a modern replacement for XMLHttpRequest and is closer to a lot of the libraries we are used to.

### [Web Sockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

"WebSockets is an advanced technology that makes it possible to open an interactive communication session between the user's browser and a server. With this API, you can send messages to a server and receive event-driven responses without having to poll the server for a reply."

## USE CASES

### Filtering

[example](examples/filtering)

Filter large data sets without blocking the UI thread and without making a full round trip to the server.

```JS
// filter.worker.js
self.onmessage = (e) => {
  const res = e.data.filter((item) => item.flagged);

  self.postMessage(res);
};


// app.js
var filterWorker = new Worker('filter-worker.js');

filterWorker.onmessage = function (e) {
  // Log filtered list
  console.log(e.data);
}

var hugeData = [ ... ];

filterWorker.postMessage(hugeData);
```

### Proxy for other Js library APIs

[example](examples/proxy)

You can use web workers to load and run Javascript libraries in separate threads so that none of the downloading or parsing is handled on the main thread

```JS
// cool-worker.js
loadScripts('https://large/but/cool/library.js');

self.onmessage = function (e) {
  switch(e.data.type) {
    case: 'thingIWantToDo':
      myLibraryScope.doTheThing(e.data.payload).then(res => {
        self.postMessage({
          status: 'COMPLETED'
          type: e.data.type,
          payload: res
        })
      });

      break;

    default:
      throw new Error(`Action ${e.data.type} is not handled by cool-worker`);
  }
}

// app.js
var coolWorker = new Worker('cool-worker.js');

dispatch({
  type: 'thingIWantToDo',
  payload: 1000
}).then(console.log);

function dispatch(action) {
  return new Promise(resolve => {
    const listener = res => {
      if (res.data.type === action.type && res.data.status === 'COMPLETED') {
        resolve(res.data.payload);

        coolWorker.removeEventListener('message', listener);
      }
    };

    coolWorker.addEventListener('message', listener);

    coolWorker.postMessage(action);
  });
}
```

### Polling

Yes yes yes polling is gross, but sometimes it can be necessary, offload the grossness to a new thread.
NOTE: web workers will hold their state but NOT permanently, so don't keep anything in them that you can't get some other way.

```JS
// polling-worker.js
self.onmessage = function (e) {
  let cache;

  const compare = (newData, oldData) => { ... };

  var myRequest = new Request('/my-api-endpoint');

  setInterval(() => {
    fetch(myRequest)
      .then(res => res.json())
      .then(data => {
        if(!compare(data, cache)) {
          cache = data;

          self.postMessage(data);
        }
      })
  }, 1000)
});

// app.js
var pollingWorker = new Worker('polling-worker.js');

pollingWorker.onmessage = () => {
  // render data
}

pollingWorker.postMessage('init');
```

## Sweet Links

- https://github.com/mchaov/WebWorkers
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Functions_and_classes_available_to_workers
- [Query database in a web worker](https://github.com/genderev/assassin)
