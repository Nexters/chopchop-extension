chrome.browserAction.onClicked.addListener(async function(tab) {
  const url = "https://www.nexters.me/api/v1/shorten";
  const req = { originUrl: tab.url };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json; charset=UTF-8"
      },
      mode: "cors",
      body: JSON.stringify(req)
    });
    const bodyData = await res.json();
    chrome.tabs.executeScript({
      code: `
      (function() {
        var el = document.createElement("textarea");
        el.value = "https://${bodyData.shortUrl}";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        alert("복사완료!");
      })()
      `
    });
  } catch (err) {
    chrome.tabs.executeScript({
      code: `
      alert("실패했습니다!");
      `
    });
  }
});
