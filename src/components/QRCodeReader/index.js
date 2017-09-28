import React from 'react'
import PropTypes from 'prop-types'
import {View, StyleSheet} from 'react-native';
import Camera from 'react-native-camera';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});

const QRCodeReader = ({ onQRCodeRead }) => {

  return (
    <View style={styles.container}>
      <Camera
        aspect={Camera.constants.Aspect.fill}
        style={styles.preview}
        onBarCodeRead={(data) => onQRCodeRead(data)}
      >
      </Camera>
    </View>
  );
}

QRCodeReader.propTypes = {
  onQRCodeRead: PropTypes.func.isRequired
}

export default QRCodeReader
