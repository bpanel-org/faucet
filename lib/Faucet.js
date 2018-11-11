import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Header, Button, Text } from '@bpanel/bpanel-ui';
import { getClient } from '@bpanel/bpanel-utils';
import { Address as bcoinAddr } from 'bcoin';
import { Address as hsdAddr } from 'hsd';
import { Address as bcashAddr } from 'bcash';

class Faucet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      error: null
    };
    this.Address = {
      bitcoin: bcoinAddr,
      bitcoincash: bcashAddr,
      handshake: hsdAddr
    };
  }

  static get propTypes() {
    return {
      network: PropTypes.string,
      chain: PropTypes.string
    };
  }

  onChange(e) {
    this.setState({ address: e.target.value });
  }

  testAddress() {
    const { network, chain } = this.props;

    const Address = this.Address[chain];
    try {
      const address = Address.fromString(this.state.address, network);
      console.log('address:', address);
    } catch (e) {
      console.error('problem with address: ', e);
    }
  }

  async onSubmit() {
    const client = getClient();
    this.testAddress();
    try {
      const result = await client.post('/faucet/drip', {
        address: this.state.address
      });
      console.log('result:', result);
    } catch (e) {
      if (e.code === 429) this.setState({ error: e.message });
      else console.error(e);
    }
  }

  render() {
    return (
      <div>
        <Header type="h2">Faucet</Header>
        <Input
          name="address"
          placeholder="destination address"
          value={this.state.address}
          onChange={e => this.onChange(e)}
        />
        <Button onClick={() => this.onSubmit()}>Submit</Button>{' '}
        {this.state.error && <Text type="p">{this.state.error}</Text>}
      </div>
    );
  }
}

export default Faucet;
