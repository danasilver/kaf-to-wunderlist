class Storage {
  static getToken() {
    return new Promise(resolve => {
      chrome.storage.sync.get({oauthToken: null}, store => {
        resolve(store.oauthToken);
      });
    });
  }

  static setToken(token) {
    return new Promise(resolve => {
      chrome.storage.sync.set({oauthToken: token}, resolve);
    });
  }

  static removeToken() {
    return new Promise(resolve => {
      chrome.storage.sync.remove('oauthToken', resolve);
    });
  }

  static getFolder() {
    return new Promise(resolve => {
      chrome.storage.sync.get({folder: null}, store => {
        resolve(store.folder);
      });
    });
  }

  static setFolder(folder) {
    return new Promise(resolve => {
      chrome.storage.sync.set({folder: folder}, resolve);
    });
  }

  static removeFolder() {
    return new Promise(resolve => {
      chrome.storage.sync.remove('folder', resolve);
    });
  }
}
