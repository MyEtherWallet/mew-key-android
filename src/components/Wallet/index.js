// import React from 'react';
import {StackNavigator} from 'react-navigation';
import WalletHome from './Home'
import PKReader from './PKReader'

const Wallet = StackNavigator({
  WalletHome: {
    screen: WalletHome
  },
  PKReader: {
    screen: PKReader
  }
}, {
  headerMode: 'none'
})

export default Wallet;
