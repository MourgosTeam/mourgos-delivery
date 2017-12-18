import React from 'react';
import { View, Image, TextInput } from 'react-native';
import Text from '../helpers/Text'

import {styles, colors} from '../Styles';
import Constants from '../Constants';
import API from '../helpers/net';
import Anchor from '../helpers/Anchor'


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

export default class PresentOrder extends React.Component {
  static navigationOptions = {
    title: 'Παραγγελία',
  };

  componentWillUnmount(){this._mounted = false}
  componentWillMount(){this._mounted = true}

  constructor(props){
    super(props);
    // avoid update while unmounted... still bad practice better encapsulate to React.NoNeedToWorryAboutSetStateOnUnmountedComponent
    this.statusTexts = Constants.statusTexts;
  }

  render() {
    return (
        <View style={styles.orderDetailsContainer} >
            <Text style={ { fontSize : 18, paddingBottom:5, textAlign: 'center' } }>Προιόντα παραγγελίας {this.props.order.id.toUpperCase()}</Text>
            <View style={styles.orderDetailsInner}>
              {this.props.order.FullDescription.map((data, index)=>{
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
              {this.props.order.Address} 
            </Text>
            <Text style={ { paddingBottom : 10 } }>
              {this.props.order.Name} 
            </Text>
            <Text style={ { paddingBottom : 10 } }>
              {this.props.order.Koudouni != '' ? 'Κουδουνι : ' + this.props.order.Koudouni : ''} 
            </Text>
            <Text style={ { paddingBottom : 10 } }>
              Όροφος : {this.props.order.Orofos} 
            </Text>
            <Anchor href={'tel:'+this.props.order.Phone} style={ { paddingBottom: 10, textDecorationLine: 'underline' } }>
              Τηλέφωνο : {this.props.order.Phone} 
            </Anchor>
            
            <Comments text={this.props.order.Comments} />

            <Text style={ { fontSize : 16, paddingBottom:5 } }>
              Χρέωση
            </Text>
            <Text style={ { paddingBottom : 10 } }>
              { parseFloat(this.props.order.FinalPrice).toFixed(2) }
            </Text>
        </View>
    );
  }
}
