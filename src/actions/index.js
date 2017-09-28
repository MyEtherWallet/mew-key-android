export const goTo = screen => {
  return {
    type: 'GO_TO',
    screen
  }
}

export const savePassword = password => {
  return {
    type: 'SAVE_PASSWORD',
    password
  }
}

export const saveKeystore = keystore => {
  return {
    type: 'SAVE_KEYSTORE',
    keystore
  }
}

export const savePK = pk => {
  return {
    type: 'SAVE_PRIVATE_KEY',
    pk
  }
}

export const saveRawTX = rawTX => {
  return {
    type: 'SAVE_RAW_TX',
    rawTX
  }
}

export const saveWeb3 = web3 => {
  return {
    type: 'SAVE_WEB3',
    web3
  }
}

export const saveAddress = address => {
  return {
    type: 'SAVE_ADDRESS',
    address
  }
}

export const saveHash = hash => {
  return {
    type: 'SAVE_HASH',
    hash
  }
}
