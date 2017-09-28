import { NavigationActions } from 'react-navigation';
import { combineReducers } from 'redux'
import Nav from '../Nav'

function nav(state = null, action) {
  let nextState;
  switch (action.type) {
    case 'GO_TO':
      nextState = Nav.router.getStateForAction(
        NavigationActions.navigate({ routeName: action.screen }),
        state
      );
      break;
    default:
      nextState = Nav.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
}

function wallet(state = {}, action) {
  switch (action.type) {
    case 'SAVE_PRIVATE_KEY':
      return {...state, pk: action.pk}
    case 'SAVE_ADDRESS':
      return {...state, address: action.address}
    case 'SAVE_KEYSTORE':
      return {...state, keystore: action.keystore}
    case 'SAVE_PASSWORD':
      return {...state, password: action.password}
    default:
      return state
  }
}

function tx(state = {}, action) {
  switch (action.type) {
    case 'SAVE_RAW_TX':
      return {...state, rawTX: action.rawTX}
    case 'SAVE_WEB3':
      return {...state, web3: action.web3}
    case 'SAVE_HASH':
      return {...state, hash: action.hash}
    default:
      return state
  }
}

const AppReducer = combineReducers({
  nav,
  wallet,
  tx
})

export default AppReducer
