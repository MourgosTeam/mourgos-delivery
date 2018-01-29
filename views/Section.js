
import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import Text from '../helpers/Text'
import {styles, colors} from '../Styles';
import Constants from '../Constants';


export default class Section extends React.Component{
  render() {
    return <View style={styles.section}>            
            <Text style={[styles.whiteText, styles.centerText]}>
              {this.props.data[0].Address}
            </Text>
            <Text style={[styles.whiteText, styles.centerText]}>
              {this.props.data[0].Name} - Όροφος: {this.props.data[0].Orofos}
            </Text>
            <Text style={[styles.whiteText, styles.boldText, styles.rightText]}>
              Σύνολο: {this.props.data.reduce((a,b) => a+b.FinalPrice, 0).toFixed(2)}
            </Text>
            {this.props.onPress &&
              <Button
                title = {this.props.buttonText}
                color = {colors.green}
                onPress={() => this.props.onPress(this.props.data)}
              />}

          </View>;
  }

}
