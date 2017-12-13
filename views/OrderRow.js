import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import Text from '../helpers/Text'
import {styles, colors} from '../Styles';
import Constants from '../Constants';


export default class OrderRow extends React.Component{
  constructor(props){
    super(props);
    this.statusTexts = Constants.statusTexts;
    this.highlightColors = Constants.highlightColors;
    this.description = this.props.data.FullDescription.map((data,index) => {
      var s =  `${data.Quantity} x ${data.Name}  \n`;
      s += data.Attributes.map( (attr) => {
        return `${attr.Name} - ${attr.Value}` + ((attr.Price>0)? `+ ${attr.Price}` : '') + '';
      }).join('\n') + '\n';
      return s;
    });
    this.opened = this.props.data.Opened;
    this.bg = this.opened === "1" ? colors.main : colors.secondary;

  }


  componentWillUpdate(props){
    this.bg = props.data.Opened === "1" ? colors.main : colors.secondary
  }

  render() {
    return (<TouchableOpacity style={{backgroundColor : this.bg}} onPress={() => this.props.onPress(this.props.data.id)}>
            <View style = {styles.orderRow}>
              <View style = {styles.orderRowLeft}>
                <Text style={styles.orderRowLeftText, styles.boldText}>
                  {this.props.data.ShopName} - {this.props.data.id.toUpperCase()}
                </Text>
                <Text style={styles.orderRowLeftText}>
                  {this.props.data.Address}
                </Text>
                <Text style={styles.orderRowLeftText, styles.boldText}>
                  {this.props.data.Name}
                </Text>
              </View>
              <View style = {styles.orderRowRight}>
                <Text style={styles.orderRowRightText, styles.centerText, styles.boldText , {color: this.highlightColors[this.props.data.Status]}} adjustsFontSizeToFit={true} numberOfLines={1}>
                  { this.statusTexts[this.props.data.Status] }
                </Text> 
                <Text style={styles.orderRowRightText, styles.centerText}>  
                  { ( parseFloat(this.props.data.Total) + parseFloat(this.props.data.Extra ? Constants.EXTRA : 0)).toFixed(2) } €
                </Text>
              </View>
            </View> 
            </TouchableOpacity>);
  }

}
