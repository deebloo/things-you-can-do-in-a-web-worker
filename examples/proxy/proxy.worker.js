importScripts("https://momentjs.com/downloads/moment-with-locales.min.js");

self.onmessage = (msg) => {
  switch (msg.data.type) {
    case "FORMAT":
      self.postMessage(moment(msg.data.date).format());
      break;
  }
};
