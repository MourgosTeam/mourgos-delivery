import { AsyncStorage, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation'

import SocketIOClient from 'socket.io-client';

const baseURL = "http://mourgos.gr/api/";
//const baseURL = "http://192.168.1.10:3000/";

var DEBUG = false;
var info = (msg) => {
	if(DEBUG)console.log(msg + "\n");
}

function jsonForm(data){
	if(data && data.status === 200){
		return data.json();
	}
	return Promise.reject("This is not json or there is an error with this data.");
}


let socket = SocketIOClient('http://mourgos.gr?id=all', { path: "/api/socket.io/" });
//let socket = SocketIOClient('http://192.168.1.10:3000?id=all', { path: "/socket.io/" });
export default {
	checkSession : function(navigation){
		let Token = null;
		info("Checking session...");
		return AsyncStorage.getItem("@Mourgos:token").then( (token) => {
			Token = token;
			return this.getIt("check/session",token);
		}).then((data) => {
			if( data === undefined ){
				info("There is no internet!");
				// Works on both iOS and Android
				Alert.alert(
				  'Αποτυχία Σύνδεσης',
				  'Δεν έχεις πρόσβαση στο Internet',
				  [
				    {text: 'OK', onPress: () => console.log('OK Pressed')},
				  ],
				  { cancelable: false }
				)
				throw Error("No net");
			}
			else if(data.status === 403){
				info("We have an error here... Lets see");
				throw Error("This is a forbidden response. This token is no more valid : " + Token);
			}
			else{
				info(data.status);
				info("Session OK");
				return Token;
			}
		}).
		catch( (err) => {
			info("Cannot check session...");
			info(err);
			AsyncStorage.removeItem("@Mourgos:token").then(() => this.navigate(navigation, "Login", "Login"));
		});
	},
	getIt : function(url, token){
		info("Getting : " + url);info("Token : " + token);
		return fetch(baseURL+url, {
		  method: 'GET',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		    'Token' : token
		  }
		}).catch( (err) => {
			info("Cannot get it...");
			info(err);
		});
	},
	postIt : function(url, json, token){
		info("Posting : " + url);info("Token : " + token);
		return fetch(baseURL+url, {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		    'Token' : token
		  },
		  body: JSON.stringify(json)
		}).catch( (err) => {
			info("Cannot post it...");
			info(err);
		});
	},
	getWithToken: function(url) {
		return AsyncStorage.getItem("@Mourgos:token").then( (token) => {
			return this.getIt(url,token).then(jsonForm);
		}).catch( (err) => {
			info("Cannot getItWith token...");
			info(err);
		});
	},
	postWithToken: function(url,json) {
		return AsyncStorage.getItem("@Mourgos:token").then( (token) => {
			return this.postIt(url,json,token).then(jsonForm);
		}).catch( (err) => {
			info("Cannot postit with token...");
			info(err);
		});
	},

	resetNavi(navigation, route){
		console.log("Reseting");
	    return navigation.dispatch(NavigationActions.reset(
        {
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: route })
            ]
        }));
  	},
  	socket,
  	navigate(navigation, routeName, route){
		console.log("Navigating");
	    return navigation.dispatch(NavigationActions.navigate(
        {
            routeName: routeName,
            action: NavigationActions.navigate({ routeName: route })
        }));
  	}
}