import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView, ScrollView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import Text from '../helpers/Text'

import {styles, colors} from '../Styles';
import Constants from '../Constants';
import API from '../helpers/net';


class Comments extends React.Component {
  render() { 
    if(!this.props.text)return <View></View>;
    return (
      <View style={this.props.style || {}}>
        <Text style={ { fontSize : 19, paddingBottom:5 } , (this.props.textStyle || {}) }>
          Σχόλια
        </Text> 
        <Text style={ { paddingBottom : 10 } , (this.props.textStyle || {})}>
          { this.props.text } 
        </Text>
      </View>
     );
  } 
}

export default class OrderDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Παραγγελία',
  };

  componentWillUnmount(){this._mounted = false}
  componentWillMount(){this._mounted = true}

  constructor(props){
    super(props);
    // avoid update while unmounted... still bad practice better encapsulate to React.NoNeedToWorryAboutSetStateOnUnmountedComponent
    this._setState = this.setState;
    this.setState = (...args) => {
      if(this._mounted)
        this._setState(...args);
    }


    this.statusTexts = ['ΝΕΑ ΠΑΡΑΓΓΕΛΙΑ', 'ΕΤΟΙΜΑΣΤΗΚΕ', 'ΣΤΑΛΘΗΚΕ'];
    this.statusTexts[99] = 'ΑΠΟΡΡΙΦΘΗΚΕ';
    this.statusTexts[10] = 'ΠΑΡΑΔΟΘΗΚΕ';
    this.state = {
      order: {
        Status : 0,
        statusText : "",
        FullDescription: [],
        Address : "",
        Comments : "",
        id : "XXXXX"
      }
    };
    const { navigate } = props.navigation;
    if(!props.navigation.state.params || !props.navigation.state.params.orderId){
      props.navigation.goBack();
      return;
    }
    this.code = props.navigation.state.params.orderId;
    API.checkSession(props.navigation.navigate).then( () => API.getWithToken("orders/" + this.code )).
    then((data) => {
      data.statusText = this.statusTexts[data.Status];
      this.setState({order:data});
    });
  }

  freeOrder = () => {
    // assign me order
    API.getWithToken("orders/free/" + this.code).
    then((order)=> this.props.navigation.goBack());
  }

  deliveredOrder = () => {
    // assign me order
    API.getWithToken("orders/delivered/" + this.code).
    then((order)=> this.props.navigation.goBack());
  }

  render() {
    return (
      <ScrollView style={{backgroundColor: colors.main}}>
      <View behavior = "padding"
        style = {styles.orderContainer}>
        <Text style={styles.orderDetailsHeader}> 
          {this.state.order.statusText}
        </Text>
        <View style={styles.orderDetailsContainer} >
            <Text style={ { fontSize : 18, paddingBottom:5, textAlign: 'center' } }>Προιόντα παραγγελίας {this.state.order.id.toUpperCase()}</Text>
            <View style={styles.orderDetailsInner}>
              {this.state.order.FullDescription.map((data, index)=>{
                return <View key={index}>
                  <View style={{flexDirection:'row'}}>
                   <Text style={styles.orderDetailsQuantity}>{data.Quantity} x</Text>
                   <View style={styles.orderDetailsPanel}>
                    <Text style={styles.orderDetailsProducts}>{data.Name}</Text>
                    {data.Attributes.map((att,attindex)=>
                      <Text style={styles.orderDetailsAttributes} key={attindex}>
                        {att.Name} : {att.Value}
                      </Text>
                    )}
                   </View>
                  </View>
                  <Comments text={data.Comments} style={{paddingLeft:5, backgroundColor:colors.gray}} textStyle={{fontSize:12}}/>
                </View>
              })}
            </View>
            
            <Text style={ { fontSize : 16, paddingBottom:5 } }>
              Παράδοση
            </Text>
            <Text style={ { paddingBottom : 10 } }>
              {this.state.order.Address} 
            </Text>

            <Comments text={this.state.order.Comments} />


            <Text style={ { fontSize : 16, paddingBottom:5 } }>
              Χρέωση
            </Text>
            <Text style={ { paddingBottom : 10 } }>
              { (parseFloat(this.state.order.Total) + parseFloat(this.state.order.Extra ? Constants.EXTRA : 0)).toFixed(2) }
            </Text>



            <View style={{paddingTop: 10}}>
              <Button
                title = "ΕΛΕΥΘΕΡΩΣΗ"
                color = {colors.main}
                onPress={() => this.freeOrder()}
              />
              <Button
                title = "ΠΑΡΑΔΟΘΗΚΕ"
                color = {colors.green}
                onPress={() => this.deliveredOrder()}
              />
            </View>
        </View>
      </View>
      </ScrollView>
    );
  }
}
