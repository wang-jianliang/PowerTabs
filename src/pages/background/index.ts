import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import { browser } from 'webextension-polyfill-ts';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

browser.runtime.onMessage.addListener(async request => {
  console.log('background.js', 'onMessage', request);
  if (request.command === 'get_tabs') {
    return await browser.tabs
      .query({})
      .then(tabs => {
        return { tabs: tabs };
      })
      .catch(error => {
        alert(`Failed to query tabs: ${error}`);
      });
  } else if (request.command === 'active_tab') {
    browser.windows.update(request.windowId, { focused: true }).then(() => {
      browser.tabs
        .update(request.tabId, { active: true })
        .then(() => {})
        .catch(error => {
          alert(`Failed to active tab: ${request.tabId}: ${error}`);
        });
    });
  } else if (request.command === 'close_tab') {
    browser.tabs
      .remove(request.tabId)
      .then(() => {})
      .catch(error => {
        alert(`Failed to close tab: ${request.tabId}: ${error}`);
      });
  } else if (request.command === 'get_position') {
    return await browser.storage.sync
      .get('position')
      .then(response => {
        return { position: response.position || 'topLeft' };
      })
      .catch(error => {
        alert(`Failed to get position: ${error}`);
      });
  } else if (request.command === 'save_position') {
    return await browser.storage.sync
      .set({ position: request.position })
      .then(() => {})
      .catch(error => {
        alert(`Failed to save position: ${error}`);
      });
  }
});
