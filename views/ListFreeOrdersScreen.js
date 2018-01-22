import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import Text from '../helpers/Text'
import {styles, colors} from '../Styles';
import LoginForm from './LoginForm';
import Constants from '../Constants';
import API from '../helpers/net';

import Section from './Section.js';
import OrderRow from './OrderRow.js';
import OrdersListView from './OrdersListView.js';

const imageBaseURL = "http://mourgos.gr";

export default class ListFreeOrdersScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let title = 'Παραγγελίες';
    let headerRight = (
      <View style={styles.logoutButton}>
        <View style={{paddingRight: 5}}>
          <Button
            title="Refresh"
            onPress={params.refresh ? params.refresh : () => null}
          />
        </View>
        <Button
          title="Logout"
          onPress={params.logout ? params.logout : () => null}
        />
      </View>
    );
    return { title, headerRight };
  };
  componentWillUnmount(){this._mounted = false}
  componentWillMount(){this._mounted = true;}

  componentDidMount(){
    API.checkSession(this.navigation);
    this.navigation.setParams({ logout: this.logout, refresh: this.loadOrders });
  }

  constructor(props) {
    super(props);
    // avoid update while unmounted... still bad practice better encapsulate to React.NoNeedToWorryAboutSetStateOnUnmountedComponent
    this._setState = this.setState;
    this.setState = (...args) => {
      if(this._mounted)
        this._setState(...args);
    }

    console.log("Constructing List");

    this.navigation = props.navigation;
    this.state = {
      orders: [],
      ImageUrl : require('../img/mourgos-logo-white.png')
    }
    
    this.setupSockets('all');
    this.loadOrders().catch( (err) => {
      console.log("Error loading orders...");
      console.log(err);
      API.checkSession(this.navigation);
    });
  }


  setupSockets = (id) => {
    this.socket = API.socket;
    this.socket.on('connect', () => {
      console.log("Connected to webSocket!");
    });
    this.socket.on('new-order', () => {
      console.log("New order!");
      this.loadOrders();
    });
    this.socket.on('update-order', () => {
      this.loadOrders();
    });
    this.socket.on('assign-order', () => {
      this.loadOrders();
    });
    this.socket.on('connect_failed', function() {
       console.log("Sorry, there seems to be an issue with the connection!");
    });
    this.socket.on('error', function() {
       console.log("Sorry,error");
    });
  }

  logout = () => {
    console.log("Logging out...");
    return AsyncStorage.removeItem("@Mourgos:token").
    then(() => API.navigate(this.props.navigation,  "Login", "Login"));
  }

  loadOrders = ()=>{
    console.log("Loading orders");
    return API.getWithToken("orders/free").
    // then( (data) => {
    //   const forbidden = ["99", "10"];
    //   let newdata = [];
    //   for (var i=0; i < data.length; i += 1) {
    //     if ( !forbidden.includes(data[i].Status) ) {
    //       newdata.push(data[i]);
    //     }
    //   }
    //   return newdata;
    // }).
    then( (data) => {
      this.setState({
        orders: data
      }); 
    });
  }

  goToOrder = (orderId) => {
    this.props.navigation.navigate("OrderDetails",{orderId : orderId});
  }
  
  assignMeOrders = (data) => {
    let ids = data.map((d) => d.id);

    let proms = [];
    for(var i in ids) {
      proms.push(API.getWithToken("orders/assign/" + ids[i]));
    }
    // assign me order
    Promise.all(proms).
    then(() => this.loadOrders());
  }

  render() {
    return (
      <KeyboardAvoidingView 
        behavior = "padding"
        style = {styles.container}>
        <OrdersListView style={styles.orderList}
            orders={this.state.orders}
            renderRow={(rowData) => <OrderRow data={rowData} onPress={this.goToOrder}/>}
            renderSectionHeader={(section, category) => <Section data={section} key={category} onPress={this.assignMeOrders}/>}/>
      </KeyboardAvoidingView>
    );
  }
}
