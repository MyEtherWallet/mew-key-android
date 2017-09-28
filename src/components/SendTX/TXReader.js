import {connect} from 'react-redux'
import QRCodeReader from '../QRCodeReader'
import {saveRawTX, goTo, saveWeb3} from '../../actions'
import Web3 from 'web3'

function storeDataAndReturn(data, dispatch) {
  const rawTX = JSON.parse(data.data)
  const provider = new Web3.providers.HttpProvider(rawTX.node)
  const web3 = new Web3(provider)
  
  dispatch(saveRawTX(rawTX))
  dispatch(saveWeb3(web3))
  dispatch(goTo('SendTXHome'))
}

const mapDispatchToProps = dispatch => {
  return {
    onQRCodeRead: data => storeDataAndReturn(data, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(QRCodeReader)
