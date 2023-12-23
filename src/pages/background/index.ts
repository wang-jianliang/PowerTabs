import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import { browser } from 'webextension-polyfill-ts';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');

browser.runtime.onMessage.addListener(async request => {
  console.log(`[background.js]onMessage: ${request} tabId: ${request.tabId}`);
  if (request.command === 'get_tabs') {
    return await browser.tabs
      .query({})
      .then(tabs => {
        console.log('tabs:', tabs);
        return { tabs: tabs };
      })
      .catch(error => {
        alert(`Failed to query tabs: ${error}`);
      });
  } else if (request.command === 'active_tab') {
    browser.windows.update(request.windowId, { focused: true }).then(() => {
      browser.tabs
        .update(request.tabId, { active: true })
        .then(() => {
          console.log('active tag:', request.tabId);
        })
        .catch(error => {
          alert(`Failed to active tab: ${request.tabId}: ${error}`);
        });
    });
  }
});
console.log('background loaded end');
