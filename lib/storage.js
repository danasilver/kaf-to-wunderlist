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
}
