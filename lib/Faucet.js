import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Header, Button, Text, Link } from '@bpanel/bpanel-ui';
import { getClient, Currency } from '@bpanel/bpanel-utils';
import { Address as bcoinAddr } from 'bcoin';
import { Address as hsdAddr } from 'hsd';
import { Address as bcashAddr } from 'bcash';

class Faucet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      error: null,
      tx: null,
      receiveAddress: '',
      balance: 0
    };
    this.Address = {
      bitcoin: bcoinAddr,
      bitcoincash: bcashAddr,
      handshake: hsdAddr
    };
    this.client = getClient();
  }

  static get propTypes() {
    return {
      network: PropTypes.string,
      chain: PropTypes.string
    };
  }

  componentDidMount() {
    this.getFaucetInfo();
    this.client.on('set clients', () => this.getFaucetInfo());
  }

  componentWillUnmount() {
    this.client.removeListener('set clients', () => this.getFaucetInfo());
  }

  async getFaucetInfo() {
    if (!this.client.id)
      return null;
    const walletInfo = await this.client.get(`/${this.client.id}/faucet/info`);
    if (walletInfo) {
      const { receiveAddress, balance } = walletInfo;
      this.setState({ receiveAddress, balance: balance.confirmed });
    } else this.setState({ receiveAddress: '', balance: 0 });
  }

  onChange(e) {
    this.setState({ address: e.target.value });
  }

  testAddress(addr) {
    const { network, chain } = this.props;
    const Address = this.Address[chain];
    Address.fromString(addr, network);
    return true;
  }

  async onSubmit() {
    const { chain } = this.props;
    try {
      this.testAddress(this.state.address);
      const { fee } = await this.client.node.execute('estimatesmartfee', [3]);
      const currency = new Currency(chain);
      const rate = fee > 0 ? currency.fromCoins(fee).value : undefined;
      const result = await this.client.post(`/${this.client.id}/faucet/drip`, {
        address: this.state.address,
        rate
      });
      if (result) this.setState({ tx: result, error: null });
      else
        this.setState({
          error:
            'There was a problem sending the request. Please contact the node administrator or wait and try again later.'
        });
    } catch (e) {
      this.setState({ error: e.message });
    }
  }

  render() {
    const { tx, address, error, receiveAddress, balance } = this.state;
    const { network, chain } = this.props;
    const currency = chain ? new Currency(chain, balance) : null;
    return (
      <div>
        <Header type="h2">Faucet</Header>
        <Text type="p">
          This is a simple faucet application to receive funds for the {chain}{' '}
          {network} blockchain. Built with{' '}
          <Link to="https://bpanel.org">bPanel</Link>.
        </Text>
        <Text type="p">
          Enter the destination address of where you want to receive the funds.
        </Text>
        {tx ? (
          <div>
            <Header type="h3">Success!</Header>
            <Text type="p">
              Your transaction was broadcast to the network. Check the status of
              your transaction by looking for the transaction hash below in a
              block explorer.
            </Text>
            <Text type="p">
              Transaction Hash:{' '}
              <Text type="condensed" copyIcon={true} prefix={35} suffix={35}>
                {tx.hash}
              </Text>
            </Text>
          </div>
        ) : (
          <div className="row mb-4 ml-auto">
            <Input
              name="address"
              placeholder="destination address"
              value={address}
              onChange={e => this.onChange(e)}
              className="col-lg-6"
            />
            <Button
              className="col-lg-2 ml-lg-4"
              onClick={() => this.onSubmit()}
            >
              Submit
            </Button>
          </div>
        )}
        {error && <Text type="p">Error: {error}</Text>}
        <Text type="p">
          Faucet Balance: {currency ? currency.to('currency') : '...'}{' '}
          {currency ? currency.getUnit('unit').toUpperCase() : ''}
        </Text>
        <Text type="p">
          Help support this service by returning any unused funds to the
          following address:
        </Text>
        {(receiveAddress && receiveAddress.length) ? (
          <Text type="condensed" copyIcon={true} prefix={40} suffix={40}>
            {receiveAddress}
          </Text>
        ) : (
          <Text type="p">
            No faucet available on this server. Please contact site
            administrator
          </Text>
        )}
      </div>
    );
  }
}

export default Faucet;
