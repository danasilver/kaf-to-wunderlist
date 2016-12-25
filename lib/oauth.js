class OAuth {
  constructor(clientId, clientSecret) {
    this.baseURL = 'https://www.wunderlist.com/oauth'
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectURI = chrome.identity.getRedirectURL('options.html');
  }

  get state() {
    return this.oauthState || (this.oauthState = Math.random().toString(36).substring(2));
  }

  get authorizeUrl() {
    const params = new URLSearchParams();
    params.append('client_id', this.clientId);
    params.append('redirect_uri', this.redirectURI);
    params.append('state', this.state);

    return `${this.baseURL}/authorize?${params.toString()}`;
  }

  parseParams(url) {
    const urlRegex = /https:\/\/(.*)\.chromiumapp.org\/.*\?(.*)/;
    const parts = url.match(urlRegex);
    const queryString = parts[2];

    return new URLSearchParams(queryString);
  }

  login() {
    return this.beginFlow()
      .then(this.fetchAccessToken.bind(this))
      .then(response => response.access_token);
  }

  beginFlow() {
    return new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow({
        url: this.authorizeUrl,
        interactive: true
      }, callbackURL => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve(callbackURL);
      });
    });
  }

  fetchAccessToken(callbackURL) {
    const params = this.parseParams(callbackURL);

    if (params.get('state') !== this.state) return Promise.reject('Invalid state param.');
    if (params.has('error')) return Promise.reject(params.get('error'));

    const body = JSON.stringify({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: params.get('code')
    });

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = {method: 'post', body, headers};

    return fetch(`${this.baseURL}/access_token`, options)
      .then(response => response.json());
  }
}
