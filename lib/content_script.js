class ExportButton extends React.Component {
  constructor() {
    super();

    this.state = {
      moused: false,
      oauthToken: null
    };
  }

  componentWillMount() {
    Storage.getToken().then(oauthToken => {
      this.setState({oauthToken});
    });
  }

  mouseOver() {
    this.setState({moused: true});
  }

  mouseOut() {
    this.setState({moused: false});
  }

  click() {
    console.log(ExportButton.recipe);
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
        recipe: `${title}${groupTitle && ': '}${groupTitle}`,
        ingredients: ingredients
      };
    }).toArray();
  }

  get icon() {
    return chrome.extension.getURL('img/icon48.png');
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

    const spanStyle = {
      fontSize: '14px'
    };

    return React.createElement('div', {style: style},
      React.createElement('a', {
        onMouseOver: this.mouseOver.bind(this),
        onMouseOut: this.mouseOut.bind(this),
        onClick: this.click.bind(this),
        style: aStyle
      },
        React.createElement('img', {src: this.icon, style: imgStyle}),
        React.createElement('span', {style: spanStyle}, 'Export to Wunderlist')));
  }
}

ExportButton.propTypes = {
  wunderlist: React.PropTypes.object.isRequired
};

const root = document.createElement('div');

document.querySelector('.recipe-sidebar-details')
  .appendChild(root);

ReactDOM.render(
  React.createElement(ExportButton, {wunderlist: new Wunderlist()}),
  root
);
