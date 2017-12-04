import React from 'react';
import { Platform, TouchableOpacity, KeyboardAvoidingView, ScrollView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import Text from '../helpers/Text'

import {styles, colors} from '../Styles';
import API from '../helpers/net';

import { MapView, Constants, Location, Permissions } from 'expo';


import SocketIOClient from 'socket.io-client';




var DEBUG = true;
var info = (msg) => {
  if(DEBUG)console.log(msg);
}

export default class MapScreen extends React.Component {
  static navigationOptions = {
    title: 'Παραγγελία'
  };

  constructor(props){
    super(props);
    // avoid update while unmounted... still bad practice better encapsulate to React.NoNeedToWorryAboutSetStateOnUnmountedComponent
    this._setState = this.setState;
    this.setState = (...args) => {
      if(this._mounted)
        this._setState(...args);
    }

    this.shopPin = require('../img/shop-pin.png')

    this.state = {
      orders: [],
      location: {
        latitude: 40.6204706,
        longitude: 22.9535798
      },
      region: {
        latitude: 40.6204706,
        longitude: 22.9535798,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      orderMarkers: [],
      freeOrderMarkers: [],
      shopMarkers: []
    };
    Location.setApiKey("AIzaSyDmrjJLGdkenqRrg-MW3_oc_RKKSKsvbFg");
  }
  componentWillUnmount(){this._mounted = false;}
  componentWillMount(){
    this._mounted = true;
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
    this.loadShops().
    then(() => this.loadFreeOrders()).
    then(() => this.loadOrders()).
    catch((err) => console.log(err));
    this.setupSockets('all');
  }

  loadOrders = () => {
    info("Loading orders");
    return API.getWithToken("orders/my").
    then((data) => this.calculateLocations(data)).
    then((data) => this.setState({
      orderMarkers : data
    }));
  }

  loadFreeOrders = () => {
    info("Loading orders");
    return API.getWithToken("orders/free").
    then((data) => this.calculateLocations(data)).
    
    then((data) => this.setState({
      freeOrderMarkers : data
    }));
  }

  loadShops = () => {
    info("Loading Shops");
    return API.getWithToken("catalogues/").
    then((data) => this.calculateShopLocations(data)).
    then((data) => this.setState({
      shopMarkers : data
    }));
  }
  
  assignMeOrder = (code) => {
    // assign me order
    info("Assigning Order: " + code);
    API.getWithToken("orders/assign/" + code);
  }

  calculateShopLocations = (shops) => {
    info("Shops:");
    info(shops);
    if(!Array.isArray(shops))return;

    const len = shops.length;
    let arr = [];
    for(var i=0;i<len;i+=1) {
      const address = shops[i].Address;
      if(!address)continue;
      let location = { latitude: parseFloat(shops[i].Latitude), longitude: parseFloat(shops[i].Longitude) }; //await Location.geocodeAsync(address);
    
      let data = location;
      data.id = shops[i].id;
      data.title = shops[i].Name;
      data.description = address;
      data.address = address;
      arr.push(data);
    }
    info("Shop Marker Array: ");
    info(arr);
    return arr; 
  }
  calculateLocations = (orders) => {
    info("Orders: ");
    info(orders);
    if(!Array.isArray(orders))return;

    const len = orders.length;
    let arrr = [];
    for(var i=0;i<len;i+=1) {
      const address = orders[i].Address;
      const location = { latitude: parseFloat(orders[i].Latitude), longitude: parseFloat(orders[i].Longitude) }; //await Location.geocodeAsync(address);
      const shopAddress = orders[i].ShopAddress;
      const shoplocation = { latitude: parseFloat(orders[i].ShopLatitude), longitude: parseFloat(orders[i].ShopLongitude) }; //await Location.geocodeAsync(shopAddress);
      
      let data = location;
      data.shop = shoplocation;
      data.id = orders[i].id;
      data.title = address.split(",")[0];
      data.description = orders[i].Name;
      data.address = address;
      arrr.push(data);
    }
    info("Marker Array: ");
    info(arrr);
    return arrr;
  }
  
  onRegionChange = (region) =>{
    this.setState({ region: region })
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    this.setState({ location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
    } });
  };

  setupSockets = (id) => {
    //this.socket = SocketIOClient('http://mourgos.gr?id=all', { path: "/api/socket.io/" });
    this.socket = SocketIOClient('http://192.168.1.5:3000?id=all', { path: "/socket.io/" });
    this.socket.on('connect', () => {
      info("Connected to webSocket!");
      //this.loadOrders();
    });
    this.socket.on('new-order', () => {
      info("New order!");
      //this.loadOrders();
    });
    this.socket.on('update-order', () => {
      this.loadOrders();
      this.loadFreeOrders();
    });
    this.socket.on('assign-order', () => {
      this.loadOrders();
      this.loadFreeOrders();
    });
    this.socket.on('connect_failed', function() {
       info("Sorry, there seems to be an issue with the connection!");
    });
    this.socket.on('error', function() {
       info("Sorry,error");
    });
  }


  render() {
    let keys = this.state.shopMarkers.length;
    return (
        <MapView
          style={{ flex: 1 }}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
        >
          {this.state.shopMarkers.map( (marker, index) => 
            <MapView.Marker key={'shop' + marker.id}
              coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
              title={marker.title}
              description={marker.description}
              pinColor={'#0000ff'}
            />
          )}
          {this.state.freeOrderMarkers.map( (marker, index) => 
            <MapView.Marker key={'shop' + marker.id}
              coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
              title={marker.title}
              description={marker.description}
              pinColor={'#cecece'}
            >
            <MapView.Callout onPress={() => this.assignMeOrder(marker.id)} />
            </MapView.Marker>
          )}
          {this.state.orderMarkers.map( (marker, index) => 
            <MapView.Marker key={'orders' + marker.id}
              coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
              title={marker.title}
              description={marker.description}
              pinColor={'#ff00ff'}
            />

          )}  
          
          {this.state.orderMarkers.map( (marker, index) => 
            <MapView.Polyline key={'lines' + marker.id}
              coordinates={[{latitude: marker.shop.latitude, longitude: marker.shop.longitude},
                            {latitude: marker.latitude, longitude: marker.longitude}]}
              strokeWidth={1}
              strokeColor={colors.main}
            />
          )}

          {this.state.location ? 
            <MapView.Circle radius={25}
            fillColor={colors.mapPosition}
            center={ { latitude: this.state.location.latitude, longitude: this.state.location.longitude } }

            />
            : ''
          }
        </MapView>
    );
  }
}
