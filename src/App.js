import React from 'react'
import {AsyncStorage} from 'react-native'
import { addNavigationHelpers } from 'react-navigation'
import { connect, Provider } from 'react-redux'
import { createStore } from 'redux'
import PropTypes from 'prop-types'
import AppReducer from './reducers/AppReducer'
import Nav from './Nav'
import {saveKeystore, saveAddress} from './actions'

class NavWithState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
    afterKeystoreTakenFromStorage: PropTypes.func.isRequired,
    afterAddressObtained: PropTypes.func.isRequired
  };

  componentDidMount() {
    const {
      afterKeystoreTakenFromStorage,
      afterAddressObtained
    } = this.props

    AsyncStorage.getItem('keystore')
    .then((keystore) => {
      afterKeystoreTakenFromStorage(keystore)
      const keystoreObj = JSON.parse(keystore)
      console.log(keystoreObj);
      const address = keystoreObj.address
      afterAddressObtained(address)
    })
    .catch(function (err) {
      console.log(err);
    })
  }

  render() {
    const {
      dispatch,
      nav
    } = this.props;

    return <Nav navigation={addNavigationHelpers({ dispatch, state: nav })} />
  }
}

const mapStateToProps = state => ({
  nav: state.nav
});

const mapDispatchToProps = dispatch => ({
  afterKeystoreTakenFromStorage: keystore => {
    dispatch(saveKeystore(keystore))
  },
  afterAddressObtained: address => {
    dispatch(saveAddress(address))
  },
  dispatch
})

const AppNav = connect(mapStateToProps, mapDispatchToProps)(NavWithState);

const store = createStore(AppReducer)

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppNav></AppNav>
      </Provider>
    )
  }
}

export default App;
