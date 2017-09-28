import React from 'react';
import {View, Button, Text, TextInput, StyleSheet} from 'react-native';
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import Tx from 'ethereumjs-tx'
import WalletService from '../../services/Wallet'
import {goTo, savePassword, saveHash} from '../../actions'

class SendTXHome extends React.Component {
  static propTypes = {
    password: PropTypes.string,
    keystore: PropTypes.string,
    rawTX: PropTypes.object,
    web3: PropTypes.object,
    hash: PropTypes.string,
    afterSendTX: PropTypes.func.isRequired,
    onScanTXPress: PropTypes.func.isRequired,
    onChangePassword: PropTypes.func.isRequired
  };

  signAndSend() {
    const {
      web3,
      keystore,
      rawTX,
      password,
      afterSendTX,
      onChangePassword
    } = this.props
    const pk = WalletService.fromV3(keystore, password, true)
    const rawTXClean = rawTX ? {...rawTX, node: undefined, nodeProvider: undefined} : null
    const tx = new Tx(rawTXClean)

    tx.sign(pk)

    const serializedTx = tx.serialize()

    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .then(function(hash) {
      afterSendTX(hash)
      onChangePassword('')
    })
    .catch(function (err) {
      afterSendTX(err.message)
    })
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.password !== nextProps.password) {
      return false
    }

    return true
  }

  render() {
    const {
      onScanTXPress,
      password,
      onChangePassword,
      rawTX,
      hash
    } = this.props

    const rawTXClean = rawTX ? JSON.stringify({...rawTX, node: undefined, nodeProvider: undefined}) : null

    const PassForm = () =>  (rawTX && !hash) ? (
      <View style={style.form}>
        <Text style={style.label}>Enter Password To Sign And Send Transaction:</Text>
        <TextInput
          placeholder="At least 9 characters"
          onChangeText={(text) => onChangePassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <View style={style.centered}>
          <View style={style.button}>
            <Button
              title="Sign & Send"
              onPress={() => this.signAndSend()}
            />
          </View>
        </View>
      </View>
    ) : (<View style={style.centered}>
      <View style={style.button}>
        <Button
          title="Scan Transaction"
          onPress={() => onScanTXPress()}
        />
      </View>
    </View>
      )

    return (
      <View style={style.tabView}>
        <Text style={style.label}>Raw Transaction:</Text>
        <Text>{rawTXClean ? rawTXClean : 'No transaction scanned'}</Text>

        <Text style={style.label}>Node Provider:</Text>
        <Text>{rawTX ? rawTX.nodeProvider : 'No transaction scanned'}</Text>

        {hash ? (
          <View>
            <Text style={style.label}>Transaction Hash:</Text>
            <Text>{hash}</Text>
          </View>
        ) : null}

        <PassForm />
      </View>
    )
  }

}

const style = StyleSheet.create({
  button: {
    width: 200,
    margin: 'auto'
  },
  centered: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 50
  },
  tabView: {
    marginTop: 10,
    marginRight: 20,
    marginLeft: 20
  },
  label: {
    fontWeight: 'bold'
  },
  form: {
    marginTop: 30
  }
})

const mapStateToProps = state => ({
  password: state.wallet.password,
  address: state.wallet.address,
  keystore: state.wallet.keystore,
  rawTX: state.tx.rawTX,
  web3: state.tx.web3,
  hash: state.tx.hash
})

const mapDispatchToProps = dispatch => {
  return {
    onScanTXPress: () => {
      dispatch(goTo('TXReader'))
    },
    onChangePassword: text => {
      dispatch(savePassword(text))
    },
    afterSendTX: hash => {
      dispatch(saveHash(hash))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendTXHome)
