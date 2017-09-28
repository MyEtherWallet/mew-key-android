// import React from 'react';
import {StackNavigator} from 'react-navigation';
import SendTXHome from './Home'
import TXReader from './TXReader'

const SendTX = StackNavigator({
  SendTXHome: {
    screen: SendTXHome
  },
  TXReader: {
    screen: TXReader
  }
}, {
  headerMode: 'none'
})

export default SendTX;
