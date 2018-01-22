import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import Text from '../helpers/Text'
import {styles, colors} from '../Styles';
import LoginForm from './LoginForm';
import Constants from '../Constants';
import API from '../helpers/net';


import OrderRow from './OrderRow.js';
import Section from './Section.js';
import OrdersListView from './OrdersListView.js';

const DEBUG = false;
function info(r){
  if(DEBUG)console.log(r);
}

const imageBaseURL = "http://mourgos.gr";

export default class ListOrdersScreen extends React.Component {
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
  componentWillMount(){this._mounted = true;
    API.checkSession(this.navigation);
  }

  componentDidMount(){
    this.navigation.setParams({ logout: this.logout, refresh: this.loadOrders });
  }

  constructor(props){
    super(props);
    // avoid update while unmounted... still bad practice better encapsulate to React.NoNeedToWorryAboutSetStateOnUnmountedComponent
    this._setState = this.setState;
    this.setState = (...args) => {
      if(this._mounted)
        this._setState(...args);
    }


    info("Constructing List");

    this.navigation = props.navigation;

    this.state = {
      // dataSource : this.ds.cloneWithRows([]),
      orders : [],
      ImageUrl : require('../img/mourgos-logo-white.png')
    }
    
    this.loadOrders().
    catch( (err) => {
      info("Error loading orders...");
      info(err);
      API.checkSession(this.navigation);
    }); 
    this.socket = API.socket;
    this.setupSockets('all');
  }

  setupSockets = (id) => {
    info("Setup sockets!");
    this.socket.on('new-order', () => {
      info("New order!");
      this.loadOrders();
    });
    this.socket.on('update-order', () => {
      info("update order!");
      this.loadOrders();
    });
    this.socket.on('assign-order', () => {
      info("assign order!");
      this.loadOrders();
    });
  }

  logout = () => {
    info("Logging out...");
    return AsyncStorage.removeItem("@Mourgos:token").
    then(() => API.navigate(this.props.navigation,  "Login", "Login"));
  }

  loadOrders = ()=>{
    info("Loading orders");
    return API.getWithToken("orders/my").
    // then( (data) => {
    //   const forbidden = ['99','10'];
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
        orders : data
      }); 
    });
  }
  
  goToOrder = (orderId) => {
    this.props.navigation.navigate("OrderDetails",{orderId : orderId});
  }

  render() {
    return (
      <KeyboardAvoidingView 
        behavior = "padding"
        style = {styles.container}>
        <OrdersListView style={styles.orderList}
            orders={this.state.orders}
            renderRow={(rowData) => <OrderRow data={rowData} onPress={this.goToOrder}/>}
            renderSectionHeader={(section, category) => <Section data={section} key={category} />}
          />
      </KeyboardAvoidingView>
    );
  }
}
