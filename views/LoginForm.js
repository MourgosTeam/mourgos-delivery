import React from 'react';
import { KeyboardAvoidingView, View, Image, TextInput, Button, Alert} from 'react-native';
import Text from '../helpers/Text'
import {styles, colors} from '../Styles';
import LoginFormInput from './LoginFormInput';
import API from '../helpers/net';

export default class LoginForm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      username : "mourgos",
      password : "deliveryatmourgos"
    }
  }

  login = () => {
    var user = {
      username : this.state.username,
      password : this.state.password
    };
    API.postIt("users/login",user).then((data) => {
      if(data.status !== 200){
        return Promise.reject("Bad credentials");
      }
      else{
        return data.json().then( (jsonData) => {
          if(jsonData.role !== 2){
            return Promise.reject("Not authorized");
          }
          return jsonData;
        });
      }
    }).
    then((data) => this.props.onLogin(data)).
    catch( (err) => {
      Alert.alert(
          'Αποτυχία Σύνδεσης',
          'Τα στοιχεία που έγραψες δεν είναι σωστά',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        );
    });
  }

  render() {
    return (
      <View
        style = {styles.loginForm}>
        <LoginFormInput
          name = 'Αναγνωριστικό διανομέα'
          onChange = { (val) => this.setState({username:val}) }
          value = {this.state.username}
          style={styles.loginTextInput}
        />
        <LoginFormInput
          name = 'Κωδικός πρόσβασης'
          secureTextEntry = {true}
          onChange = { (val) => this.setState({password:val}) }
          value = {this.state.password}
          style={styles.loginTextInput}
        />
        <Button
          title = "Συνδεση"
          color = {colors.dark}
          onPress={this.login}
        />
      </View>
    );
  }
}
