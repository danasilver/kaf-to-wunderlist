const clientId = 'b8082b4c0e661f5eae9c';
const clientSecret = '8825326dbeca19640e202045d8893213986e67aa641b65764dc483e059ca';
const oauth = new OAuth(clientId, clientSecret);

oauth.beginFlow()
  .then(oauth.fetchAccessToken.bind(oauth))
  .then(console.log);
