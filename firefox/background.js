chrome.browserAction.onClicked.addListener(async function(tab) {
  const url = "https://www.nexters.me/api/v1/shorten";
  const req = { originUrl: tab.url };
  let success = false;
  let bodyData = {};
  chrome.notifications.create({
    type: "basic",
    title: "Url을 줄이는중...",
    message: tab.url,
    iconUrl: "./images/logo.png"
  });
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
    success = true;
  } catch (err) {
    success = false;
  }
  setTimeout(() => {
    if (success) {
      chrome.notifications.create({
        type: "basic",
        title: "Url이 복사되었습니다.",
        message: bodyData.shortUrl,
        iconUrl: "./images/logo.png"
      });
      return;
    }
    chrome.notifications.create({
      type: "basic",
      title: "실패했습니다. 다시 시도해 주세요",
      message: "",
      iconUrl: "./images/logo.png"
    });
  }, 800);
});
