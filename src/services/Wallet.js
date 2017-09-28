import crypto from 'react-native-crypto'
import ethUtil from 'ethereumjs-util'

function fromV3(input, password, nonStrict) {
  const json = (typeof input === 'object') ? input : JSON.parse(nonStrict ? input.toLowerCase() : input)
    if (json.version !== 3) {
        throw new Error('Not a V3 wallet')
    }
    let derivedKey
    let kdfparams

    kdfparams = json.crypto.kdfparams
    if (kdfparams.prf !== 'hmac-sha256') {
        throw new Error('Unsupported parameters to PBKDF2')
    }
    derivedKey = crypto.pbkdf2Sync(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256')

    const ciphertext = new Buffer(json.crypto.ciphertext, 'hex')
    const mac = ethUtil.sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
    if (mac.toString('hex') !== json.crypto.mac) {
        throw new Error('Key derivation failed - possibly wrong passphrase')
    }
    const decipher = crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), new Buffer(json.crypto.cipherparams.iv, 'hex'))
    let seed = Buffer.concat([decipher.update(ciphertext), decipher.final()])

    while (seed.length < 32) {
        const nullBuff = new Buffer([0x00]);
        seed = Buffer.concat([nullBuff, seed]);
    }
    
    return seed
}

const WalletService = {
  fromV3
}

export default WalletService
