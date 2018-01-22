import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import Text from '../helpers/Text'
import {styles, colors} from '../Styles';
import Constants from '../Constants';

import OrderRow from './OrderRow.js';

export default class OrdersListView extends React.Component{
  constructor(props){
    super(props);

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      dataSource: this.ds.cloneWithRowsAndSections({})
    };
  }

  componentWillReceiveProps(props){
    this.setState({
      dataSource: this.ds.cloneWithRowsAndSections(this.mapOrders(props.orders))
    });
  }

  mapOrders = (data) => {
    //data.reduce((a,b) => console.log(b), {});
    let indexes = {};
    let oldDate = new Date();
    for (let i=0; i < data.length ; i+=1) {
      let keyDate = new Date(data[i].PostDate);
      keyDate.setMilliseconds(0);
      if (keyDate.getTime() === oldDate.getTime() && data[i].Phone === oldPhone) {
        //(!indexes[keyDate]) ? indexes[keyDate] = [data[i]] : indexes[keyDate].push(data[i]);
        indexes[keyDate].push(data[i]);
      } else {
        indexes[keyDate] = [data[i]];
      }
      oldDate = keyDate;
      oldPhone = data[i].Phone;
    }

    return indexes;
  }

  render() {
    return (<ListView enableEmptySections={false} 
            {...this.props}
            dataSource={this.state.dataSource}
      />);
  }

}
