# bPanel Faucet Plugin
This plugin adds a rate limited faucet plugin to your bPanel instance. There are both client and server side components to this plugin, which means that a minimum version of bPanel `v1.0.0-beta` is required (since older versions do not support backend plugins).

![preview](https://raw.githubusercontent.com/bpanel-org/faucet/master/preview.gif "bPanel Faucet")

## Features
- Multi-network support: Bitcoin, Bitcoin Cash, Handshake
- Automatic address validation
- Server-side rate limiting (defaults to 1 request per hour)
- Blacklisting all non-faucet wallet endpoints
- Displays faucet balance and a return address
- Plugs into the [bPanel theming system](https://bpanel.org/docs/theming-started.html) for easy, custom skins

## Installation
Make sure you've got the latest version of [`bpanel-cli`](https://www.npmjs.com/package/@bpanel/bpanel-cli) installed

```bash
$ npm install -g @bpanel/bpanel-cli
```

Then install the plugin with bpanel-cli:

```bash
$ bpanel-cli install @bpanel/faucet
```

Finally, if you've got bPanel already running, make sure to restart the server. Otherwise, just start bPanel as normal:

```bash
# from your bPanel project directory
$ npm run start
```
*This plugin is purely an interface with a compatible wallet node*. By default, you will need
to have a wallet server running on the node you're connecting to and it will need to have
a (funded) wallet with the id `faucet` in order to have full functionality. See steps below
for additional configuration options.

## Development and Setup
By default, the plugin will blacklist _all_ backend calls to wallet endpoints not made to a wallet with
the id `faucet`. This is to avoid accidentally opening up other wallets on your server to the faucet service.

#### Faucet Admin
Absent any other kind of authentication, you can set the config variable `faucet-admin` in your bPanel configs
which will disable the blacklisting and rate limiting. This can be helpful when testing during development.

#### Faucet ID
Another useful configuration is `faucet-id` which lets you set a custom wallet id for the faucet source.
For example, if you're using a dedicated node for your faucet, you might just want to use your `primary`
wallet since that is the default wallet created by a bcoin, bcash, or hsd node.

### Setting configs
The bPanel Faucet plugin uses the bPanel configuration system, built with
[bcfg](https://github.com/bcoin-org/bcfg). These can be set at runtime (i.e. `npm run start -- --faucet-admin=true --faucet-id=foobar`), in your bpanel's `config.js` file or with an environment variable
(`BPANEL_FAUCET_ID=primary`). Read more about bPanel's configurations
[here](https://bpanel.org/docs/configuration.html).

### Customizing the Rate Limiter
The rate limiter uses the [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) middleware
for Express. To customize the limiter, you can change the options in the `apiLimiter` handler in
`/server/handlers.js`.
