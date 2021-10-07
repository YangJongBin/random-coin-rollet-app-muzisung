import React, {Component} from 'react';
import {Text, StyleSheet, View, Dimensions} from 'react-native';

export default class DetailView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.detailArea1}>
          <View>
            <View>
              <View>
                <Text>100,000</Text>
              </View>
            </View>
            <View>
              <View>
                <Text>+4.41</Text>
              </View>
              <View>
                <Text>+200,000</Text>
              </View>
            </View>
          </View>
          <View></View>
        </View>
        <View style={styles.detailArea2}></View>
        <View style={styles.detailArea3}></View>
      </View>
    );
  }
}
const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '65%',
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailArea1: {
    width: '80%',
    height: 150, // FIXME:
    flexDirection: 'column',
    margin: 3,
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: 'gray', //FIXME:
  },
  detailArea2: {
    width: '80%',
    height: 50, // FIXME:
    flexDirection: 'column',
    margin: 3,
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: 'gray', //FIXME:
  },
  detailArea3: {
    width: '80%',
    height: 150, // FIXME:
    flexDirection: 'column',
    margin: 3,
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: 'gray', //FIXME:
  },
});
