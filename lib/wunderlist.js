class Wunderlist {
  constructor(clientId, oauthToken) {
    this.clientId = clientId;
    this.oauthToken = oauthToken;
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
    headers.append('X-Client-ID', this.clientId);

    const options = {headers, method};
    if (body) options.body = body;

    return fetch(`${Wunderlist.baseURL}${endpoint}`, options)
      .then(response => response.json())
  }
}

Wunderlist.baseURL = 'https://a.wunderlist.com/api/v1';
