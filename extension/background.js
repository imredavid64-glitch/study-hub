const STUDYHUB_API = 'https://study-hub-plum-omega.vercel.app/api/gemini';

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'GET_PAGE_CONTEXT') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs && tabs[0];
      if (!tab || !tab.id) { sendResponse({ title: '', text: '' }); return; }
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const title = document.title || location.href;
          const body = (document.body && document.body.innerText || '').slice(0, 4000);
          return { title, text: body };
        }
      }).then((res) => {
        const r = res && res[0] && res[0].result;
        sendResponse(r || { title: '', text: '' });
      }).catch(() => sendResponse({ title: '', text: '' }));
    });
    return true; // async
  }
  if (msg && msg.type === 'ASK_AI') {
    fetch(STUDYHUB_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemini-1.5-flash',
        messages: msg.messages,
        max_tokens: 600,
        temperature: 0.7
      })
    })
      .then((r) => r.json())
      .then((data) => sendResponse({ ok: true, content: data.choices && data.choices[0] && data.choices[0].message.content || '' }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true; // async
  }
});
