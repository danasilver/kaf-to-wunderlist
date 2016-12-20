const clientId = 'b8082b4c0e661f5eae9c';

const createUrl = () => {
  const url = 'https://www.wunderlist.com/oauth/authorize?';
  const params = {
    client_id: clientId,
    redirect_uri: 'https://bddhhgcoebofgcbiebhidimgknkflpkl.chromiumapp.org/options.html',
    state: Math.random().toString(36).substring(2)
  };

  return url + $.param(params);
};

const parseParams = url => {
  var urlRe = /https:\/\/(.*)\.chromiumapp.org\/options.html\?(.*)/,
      parts = url.match(urlRe),
      paramString = parts[2];

  return paramString.split('&').reduce((params, param) => {
    var paramParts = param.split('=');
    params[paramParts[0]] = paramParts[1];
    return params;
  }, {});
};

const saveToken = response => {
  chrome.storage.sync.set({
    accessToken: response.access_token
  });
};

const beginOAuthFlow = () => {
  chrome.identity.launchWebAuthFlow({
    url: createUrl(),
    interactive: true
  }, function(redirect_url) {
    $.post('https://www.wunderlist.com/oauth/access_token', {
      data: {
        client_id: clientId,
        client_secret: '040491e366a36439eb803c449a8fb6597177761b8c80bc7e364881ffeded',
        code: parseParams(redirect_url).code;
      },
      success:
    });
  });
};
