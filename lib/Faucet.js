import React, { PureComponent } from 'react';
import { Input, Header } from '@bpanel/bpanel-ui';

class Faucet extends PureComponent {
  render() {
    return (
      <div>
        <Header type="h2">Faucet</Header>
        <Input name="address" />
      </div>
    );
  }
}

export default Faucet;
