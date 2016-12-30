class Wunderlist {
  constructor(clientId, oauthToken) {
    this.clientId = clientId;
    this.oauthToken = oauthToken;
  }

  user() {
    return this.get('/user');
  }

  folders() {
    return this.get('/folders');
  }

  folder(id) {
    return this.get(`/folders/${id}`);
  }

  createList(title) {
    return this.post('/lists', {title});
  }

  createTask(list, title) {
    return this.post('/tasks', {list_id: list.id, title});
  }

  createListWithTasks(list, tasks) {
    return this.createList(list)
      .then(listResponse => {
        return Promise.all(tasks.map(task => {
          return this.createTask(listResponse, task);
        }));
      });
  }

  addListsToFolder(folder, listIds) {
    const revision = folder.revision;
    const list_ids = [...folder.list_ids, ...listIds];
    return this.patch(`/folders/${folder.id}`, {revision, list_ids});
  }

  get(endpoint, data) {
    const params = new URLSearchParams();
    for (let key in data) params.append(key, data[key]);
    return this.makeRequest(`${endpoint}?${params.toString()}`, 'GET');
  }

  post(endpoint, data) {
    return this.makeRequest(endpoint, 'POST', JSON.stringify(data));
  }

  patch(endpoint, data) {
    return this.makeRequest(endpoint, 'PATCH', JSON.stringify(data));
  }

  makeRequest(endpoint, method, body, extraHeaders) {
    const headers = new Headers();
    headers.append('X-Access-Token', this.oauthToken);
    headers.append('X-Client-ID', this.clientId);

    if (method === 'POST' || method === 'PATCH') {
      headers.append('Content-Type', 'application/json');
    }

    const options = {headers, method};
    if (body) options.body = body;

    return fetch(`${Wunderlist.baseURL}${endpoint}`, options)
      .then(response => response.json())
  }
}

Wunderlist.baseURL = 'https://a.wunderlist.com/api/v1';
