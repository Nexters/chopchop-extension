chrome.browserAction.onClicked.addListener(async function(tab) {
  const url = "https://www.nexters.me/api/v1/shorten";
  const req = { originUrl: tab.url };
  const id = Date.now() + "";
  chrome.notifications.create(id, {
    type: "basic",
    title: "Url을 줄이는중...",
    message: tab.url,
    iconUrl: "./images/logo.png"
  });
  let success = false;
  let bodyData = {};
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
    bodyData = await res.json();
    chrome.tabs.executeScript({
      code: `
      (function() {
        var el = document.createElement("textarea");
        el.value = "https://${bodyData.shortUrl}";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      })()
      `
    });
    chrome.notifications.clear(id);
    chrome.notifications.create({
      type: "basic",
      title: `${bodyData.shortUrl} - Url이 복사되었습니다.`,
      message: tab.url,
      iconUrl: "./images/logo.png"
    });
  } catch (err) {
    chrome.notifications.clear(id);
    chrome.notifications.create({
      type: "basic",
      title: "실패했습니다. 다시 시도해 주세요",
      message: "",
      iconUrl: "./images/logo.png"
    });
  }
});
