class Profile extends React.Component {
  constructor() {
    super();

    this.state = {
      oauthToken: null,
      user: null,
      folder: null,
      folders: []
    };
  }

  componentWillMount() {
    Promise.all([Storage.getToken(), Storage.getFolder()])
      .then(store => {
        const [oauthToken, folder] = store;
        if (oauthToken) this.setState({oauthToken}, this.getUserAndFolders);
        if (folder) this.setState({folder});
      });
  }

  login() {
    const oauth = new OAuth(this.props.clientId, this.props.clientSecret);

    oauth.login()
      .then(oauthToken => {
        this.setState({oauthToken}, this.getUserAndFolders);
        Storage.setToken(oauthToken);
      })
      .catch(err => {
        // Either the user closed the OAuth window without signing in
        // or the OAuth "state" param didn't match.
      });
  }

  getUserAndFolders() {
    const wunderlist = new Wunderlist(this.props.clientId, this.state.oauthToken);

    Promise.all([wunderlist.user(), wunderlist.folders()])
      .then(userData => {
        const [user, folders] = userData;
        return this.setState({user, folders});
      })
      .catch(err => this.login());
  }

  logout() {
    Storage.removeToken()
      .then(() => {
        this.setState({oauthToken: null, user: null});
      });
  }

  setFolder(event) {
    // setting undefined is a noop, setting null unsets the current value
    const folder = this.state.folders.find(f => f.id === +event.target.value) || null;
    this.setState({folder});
    Storage.setFolder(folder);
  }

  get userIsAuthorized() {
    return this.state.user && this.state.user.id;
  }

  get avatarURL() {
    if (this.userIsAuthorized) {
      return `${Wunderlist.baseURL}/avatar?user_id=${this.state.user.id}&size=128`;
    } else {
      return 'https://avatars.wunderlist.io/static/avatars/128.png';
    }
  }

  get authButton() {
    const text = this.userIsAuthorized ? 'Disconnect' : 'Authorize Wunderlist';
    const authFunction = this.userIsAuthorized ? this.logout.bind(this) : this.login.bind(this);
    const style = {
      display: 'block',
      margin: '20px auto',
      fontSize: '16px',
      outline: 'none',
      border: this.userIsAuthorized ? '2px solid #ca6161' : '2px solid #238c1c',
      borderRadius: '3px',
      padding: '6px 10px',
      backgroundColor: this.userIsAuthorized ? '#ffc8c8' : '#d5f3cb'
    };
    return React.createElement('button', {onClick: authFunction, style: style}, text);
  }

  get removeAppText() {
    return React.createElement('p', null,
      React.createElement('text', null, 'To completely disconnect Wunderlist, remove KAF to Wunderlist '),
      React.createElement('a', {href: 'https://www.wunderlist.com/account/applications'}, 'here'),
      React.createElement('text', null, '.'));
  }

  get folderPicker() {
    const style = {
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: '300'
    };

    const value = this.state.folder ? this.state.folder.id : 0;
    const onChange = this.setFolder.bind(this);

    return React.createElement('div', {style},
      React.createElement('text', null, 'Save recipes to '),
      React.createElement('select', {onChange, value}, this.folderOptions));
  }

  get folderOptions() {
    return this.state.folders.map(folder => {
      return React.createElement('option', {value: folder.id, key: folder.id}, folder.title);
    })
    .concat([React.createElement('option', {value: 0, key: 0}, 'no folder')]);
  }

  render() {
    const imgStyle = {
      display: 'block',
      margin: '0 auto',
      borderRadius: '3px',
      height: '128px'
    };

    return React.createElement('div', null,
      React.createElement('img', {src: this.avatarURL, style: imgStyle}),
      this.authButton,
      this.userIsAuthorized ? this.folderPicker : null,
      this.userIsAuthorized ? this.removeAppText : null
    );
  }
}

Profile.propTypes = {
  clientId: React.PropTypes.string.isRequired,
  clientSecret: React.PropTypes.string.isRequired
};

ReactDOM.render(
  React.createElement(Profile, {
    clientId: 'b8082b4c0e661f5eae9c',
    clientSecret: '8825326dbeca19640e202045d8893213986e67aa641b65764dc483e059ca'
  }),
  document.getElementById('profile')
);
