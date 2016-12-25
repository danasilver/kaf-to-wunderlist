class Profile extends React.Component {
  constructor() {
    super();

    this.state = {
      oauthToken: null,
      user: null
    }
  }

  componentWillMount() {
    Storage.getToken().then(oauthToken => {
      if (oauthToken) this.setState({oauthToken}, this.getUser);
    });
  }

  login() {
    const oauth = new OAuth(this.props.clientId, this.props.clientSecret);

    oauth.login()
      .then(oauthToken => {
        this.setState({oauthToken}, this.getUser);
        Storage.setToken(oauthToken);
      })
      .catch(err => {
        // Either the user closed the OAuth window without signing in
        // or the OAuth "state" param didn't match.
      });
  }

  getUser() {
    const wunderlist = new Wunderlist(this.state.oauthToken, this.props.clientId);

    wunderlist.user()
      .then(user => this.setState({user}))
      .catch(err => this.login());
  }

  logout() {
    Storage.removeToken()
      .then(() => {
        this.setState({oauthToken: null, user: null});
      });
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
      border: '2px solid #ca6161',
      borderRadius: '3px',
      padding: '6px 10px',
      backgroundColor: '#ffc8c8'
    };
    return React.createElement('button', {onClick: authFunction, style: style}, text);
  }

  get removeAppText() {
    return React.createElement('p', null,
      React.createElement('text', null, 'To completely disconnect Wunderlist, remove the app '),
      React.createElement('a', {href: 'https://www.wunderlist.com/account/applications'}, 'here'),
      React.createElement('text', null, '.'));
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
