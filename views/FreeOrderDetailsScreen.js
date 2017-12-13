import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView, ScrollView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import Text from '../helpers/Text'

import {styles, colors} from '../Styles';
import Constants from '../Constants';
import API from '../helpers/net';

import PresentOrder from './PresentOrder.js'

import { Location, Permissions } from 'expo';


export default class FreeOrderDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Παραγγελία'
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


    this.statusTexts = ['ΝΕΑ ΠΑΡΑΓΓΕΛΙΑ', 'ΕΤΟΙΜΑΖΕΤΑΙ', 'ΕΤΟΙΜΑΣΤΗΚΕ', 'ΣΤΟ ΔΡΟΜΟ'];
    this.statusTexts[99] = 'ΑΠΟΡΡΙΦΘΗΚΕ';
    this.statusTexts[10] = 'ΠΑΡΑΔΟΘΗΚΕ';
    this.state = {
      order: {
        Status : 0,
        statusText : "",
        FullDescription: [],
        Address : "",
        Comments : "",
        id : "XXXXX",
        Name : '',
        Koudouni: '',
        Phone: ''
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
    }).
    then(() => {
      return this._getLocationAsync();
    }).
    then((location) => API.postWithToken("orders/saw/" + this.code, location));
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return {};
    }

    let location = await Location.getCurrentPositionAsync({});
    return location;
  };


  assignMeOrder = () => {
    // assign me order
    API.getWithToken("orders/assign/" + this.code).
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
        <PresentOrder order={this.state.order} />
        <View>
            <View style={{paddingTop: 10}}>
              <Button
                title = "ΚΑΤΟΧΥΡΩΣΗ"
                color = {colors.green}
                onPress={() => this.assignMeOrder()}
              />
            </View>
        </View>
      </View>
      </ScrollView>
    );
  }
}
