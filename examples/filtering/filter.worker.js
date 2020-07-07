self.onmessage = (e) => {
  const res = e.data.filter((item) => item.flagged);

  self.postMessage(res);
};
