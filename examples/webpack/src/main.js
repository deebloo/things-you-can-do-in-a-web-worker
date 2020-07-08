const worker = new Worker("./worker.js", { type: "module" });

worker.addEventListener("message", (e) => {
  alert(e.data);
});
