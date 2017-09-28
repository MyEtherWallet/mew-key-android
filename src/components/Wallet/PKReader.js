import {connect} from 'react-redux'
import ethUtil from 'ethereumjs-util'
import QRCodeReader from '../QRCodeReader'
import {savePK, goTo, saveAddress, saveKeystore} from '../../actions'

function storeDataAndReturn(data, dispatch) {
  const pkBuf = new Buffer(data.data, 'hex')
  const address = ethUtil.privateToAddress(pkBuf).toString('hex')

  dispatch(savePK(data.data))
  dispatch(saveAddress(address))
  dispatch(saveKeystore(null))
  dispatch(goTo('WalletHome'))
}

const mapDispatchToProps = dispatch => {
  return {
    onQRCodeRead: data => storeDataAndReturn(data, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(QRCodeReader)
