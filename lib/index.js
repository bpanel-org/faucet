// Entry point for your plugin
// This should expose your plugin's modules

import Faucet from './Faucet';

export const metadata = {
  name: '@bpanel/faucet',
  pathName: 'faucet',
  displayName: 'Faucet',
  author: 'bpanel-devs',
  description:
    'A plugin for adding a faucet interface for your bPanel instance, includes rate limiting for the API requests',
  version: require('../package.json').version,
  nav: true,
  icon: 'tint'
};

export const mapComponentState = {
  Panel: (state, map) =>
    Object.assign(map, {
      network: state.node.node.network,
      chain: state.clients.currentClient.chain
    })
};

export const getRouteProps = {
  '@bpanel/faucet': (parentProps, props) =>
    Object.assign(props, {
      network: parentProps.network,
      chain: parentProps.chain
    })
};

// a decorator for the Panel container component in our app
// here we're extending the Panel's children by adding
// our plugin's component (`MyComponent` below)
// You'll want to make sure to import an actual component
// This is what you need if you're making a new view/route
export const decoratePanel = (Panel, { React }) => {
  return class extends React.Component {
    static displayName() {
      return metadata.name;
    }

    render() {
      const { customChildren = [] } = this.props;
      const routeData = {
        metadata,
        Component: Faucet
      };
      return (
        <Panel
          {...this.props}
          customChildren={customChildren.concat(routeData)}
        />
      );
    }
  };
};
/* END EXPORTS */
