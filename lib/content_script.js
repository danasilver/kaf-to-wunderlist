class ExportButton extends React.Component {
  constructor(props) {
    super();

    this.state = {
      moused: false,
      oauthToken: null,
      folder: null,
      wunderlist: new Wunderlist(props.clientId)
    };
  }

  componentWillMount() {
    Promise.all([Storage.getToken(), Storage.getFolder()])
      .then(store => {
        const [oauthToken, folder] = store;
        this.setState({oauthToken, folder});
      });
  }

  componentWillUpdate(nextProps, nextState) {
    this.state.wunderlist.oauthToken = nextState.oauthToken;
  }

  mouseOver() {
    this.setState({moused: true});
  }

  mouseOut() {
    this.setState({moused: false});
  }

  clickExport() {
    this.updateFolder()
      .then(this.createLists.bind(this))
      .then(this.addListsToFolder.bind(this));
  }

  updateFolder() {
    if (!this.state.folder) return Promise.resolve();

    return this.state.wunderlist.folder(this.state.folder.id)
      .then(folder => {
        this.setState({folder});
        return Storage.setFolder(folder);
      });
  }

  createLists() {
    const recipes = ExportButton.recipe;
    const wunderlist = this.state.wunderlist;

    return Promise.all(recipes.map(recipe => {
      return wunderlist.createListWithTasks(recipe.title, recipe.ingredients);
    }));
  }

  addListsToFolder(taskLists) {
    const folder = this.state.folder;
    const wunderlist = this.state.wunderlist;
    const listIds = taskLists.map(tasks => tasks[0].list_id);

    if (folder) return wunderlist.addListsToFolder(folder, listIds);
    else return Promise.resolve();
  }

  clickLogin() {
    window.open(chrome.extension.getURL('options.html'));
  }

  static titleCase(string) {
    return string.trim().replace(/\w+/g, s => {
      return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
    });
  }

  static get recipe() {
    const title = ExportButton.titleCase($('.recipe-title').text());

    return $('.ingredient-units-container.fadeInDown .ingredient-group').map((_, group) => {
      const groupTitle = ExportButton.titleCase($(group).find('h4').text().trim());
      const ingredients = $(group).find('li[itemprop="ingredients"]').map((_, ingredient) => {
        return $(ingredient).text().trim().replace(/\s+/g, ' ');
      }).toArray();

      return {
        title: `${title}${groupTitle && ': '}${groupTitle}`,
        ingredients: ingredients
      };
    }).toArray();
  }

  get icon() {
    return chrome.extension.getURL('img/icon48.png');
  }

  get linkText() {
    const style = {
      fontSize: '14px'
    };
    const text = this.state.oauthToken ? 'Save to Wunderlist' : 'Login to Wunderlist';

    return React.createElement('span', {style: style}, text);
  }

  render() {
    const style = {
      textAlign: 'center'
    };

    const aStyle = {
      textDecoration: this.state.moused ? 'underline' : null,
      cursor: 'pointer',
      color: '#22252e'
    };

    const imgStyle = {
      height: '14px',
      margin: '0 3px 1px 0'
    };

    const click = this.state.oauthToken ? this.clickExport : this.clickLogin;

    return React.createElement('div', {style: style},
      React.createElement('a', {
        onMouseOver: this.mouseOver.bind(this),
        onMouseOut: this.mouseOut.bind(this),
        onClick: click.bind(this),
        style: aStyle
      },
        React.createElement('img', {src: this.icon, style: imgStyle}),
        this.linkText));
  }
}

ExportButton.propTypes = {
  clientId: React.PropTypes.string.isRequired
};

try {
  const root = document.createElement('div');

  document.querySelector('.recipe-sidebar-details')
    .appendChild(root);

  ReactDOM.render(
    React.createElement(ExportButton, {
      clientId: 'b8082b4c0e661f5eae9c'
    }),
    root
  );
} catch (e) {
  // On the /recipes root, not a particular recipe page
}

