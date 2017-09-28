import React from 'react';
import {View, Button, Text, TextInput, AsyncStorage, StyleSheet} from 'react-native';
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import crypto from 'react-native-crypto'
import uuid from 'react-native-uuid'
// import fastCrypto from 'react-native-fast-crypto'
import ethUtil from 'ethereumjs-util'
import {goTo, savePassword, saveKeystore} from '../../actions'

class WalletHome extends React.Component {
  static propTypes = {
    pk: PropTypes.string,
    password: PropTypes.string,
    address: PropTypes.string,
    keystore: PropTypes.string,
    afterKeystoreSavedInStorage: PropTypes.func.isRequired,
    onScanPKPress: PropTypes.func.isRequired,
    onChangePassword: PropTypes.func.isRequired
  };

  createKeystore() {
    const {
      pk,
      password,
      afterKeystoreSavedInStorage,
      address,
      onChangePassword
    } = this.props

    const salt = crypto.randomBytes(32)
    const kdfparams = {
      c: 262144,
      prf: 'hmac-sha256',
      n: 262144,
      r: 8,
      p: 1,
      dklen: 32,
      salt: salt.toString('hex')
    }
    const iv = crypto.randomBytes(16)
    const derivedKey = crypto.pbkdf2Sync(new Buffer(password), salt, kdfparams.c, kdfparams.dklen, 'sha256')

    const cipher = crypto.createCipheriv('aes-128-ctr', derivedKey.slice(0, 16), iv)
    const pkBuffer = new Buffer(pk, 'hex')
    const ciphertext = Buffer.concat([cipher.update(pkBuffer), cipher.final()])
    const mac = ethUtil.sha3(Buffer.concat([derivedKey.slice(16, 32), new Buffer(ciphertext, 'hex')]))
    const keystore = {
        version: 3,
        id: uuid.v4({
            random: crypto.randomBytes(16)
        }),
        address,
        Crypto: {
            ciphertext: ciphertext.toString('hex'),
            cipherparams: {
                iv: iv.toString('hex')
            },
            cipher: 'aes-128-ctr',
            kdf: 'pbkdf2',
            kdfparams,
            mac: mac.toString('hex')
        }
    }

    const keystoreString = JSON.stringify(keystore)
    AsyncStorage.setItem('keystore', keystoreString)
    .then(() => {
      afterKeystoreSavedInStorage(keystoreString)
      onChangePassword('')
    })
    .catch(function (err) {
      console.log(err);
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
      onScanPKPress,
      pk,
      password,
      onChangePassword,
      address,
      keystore
    } = this.props

    const PassForm = () =>  (pk && !keystore) ? (
      <View style={style.form}>
        <Text style={style.label}>Enter New Password:</Text>
        <TextInput
          placeholder="At least 9 characters"
          onChangeText={(text) => onChangePassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <View style={style.centered}>
          <View style={style.button}>
            <Button
              title="Submit Password"
              onPress={() => this.createKeystore()}
            />
          </View>
        </View>
      </View>
    ) : (<View style={style.centered}>
      <View style={style.button}>
        <Button
          title="Scan Private Key"
          onPress={() => onScanPKPress()}
        />
      </View>
    </View>
      )

    return (
      <View style={style.tabView}>
        <Text style={style.label}>Current Wallet Address:</Text>
        <Text>{address ? `0x${address}` : 'No private key scanned'}</Text>

        {keystore ? <Text style={{marginTop: 20}}>Password Set</Text> : null}

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
  pk: state.wallet.pk,
  password: state.wallet.password,
  address: state.wallet.address,
  keystore: state.wallet.keystore
})

const mapDispatchToProps = dispatch => {
  return {
    onScanPKPress: () => {
      dispatch(goTo('PKReader'))
    },
    onChangePassword: text => {
      dispatch(savePassword(text))
    },
    afterKeystoreSavedInStorage: keystore => {
      dispatch(saveKeystore(keystore))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletHome)
