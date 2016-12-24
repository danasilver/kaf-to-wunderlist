class WunderlistClient {
  constructor(oauthToken, clientId) {
    this.baseURL = 'a.wunderlist.com/api/v1';
    this.oauthToken = oauthToken;
    this.clientId = clientId;
  }

  user() {
    return this.get('/user');
  }

  get(endpoint, data) {
    const params = new URLSearchParams();
    for (let key in data) params.append(key, data[key]);
    return this.makeRequest(`${endpoint}?${params.toString()}`, 'GET');
  }

  post(endpoint, data) {
    const form = new FormData();
    for (let key in data) form.append(key, data[key]);
    return this.makeRequest(endpoint, 'POST', form);
  }

  makeRequest(endpoint, method, body) {
    const headers = new Headers();
    headers.append('X-Access-Token', this.oauthToken);
    headers.append('CLIENT-ID', this.clientId);

    const options = {headers, method};
    if (body) options.body = body;

    return fetch(`${this.baseURL}${endpoint}`, options);
  }
}
