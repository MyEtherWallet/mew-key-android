import {TabNavigator} from 'react-navigation';
import Wallet from './components/Wallet';
import SendTX from './components/SendTX';

const Nav = TabNavigator({
  Wallet: {
    screen: Wallet
  },
  SendTX: {
    screen: SendTX
  }
}, {
  tabBarOptions: {
  }
});

export default Nav
