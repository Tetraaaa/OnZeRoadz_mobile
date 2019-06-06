import React from 'react';
import { Text, View, Button, TextInput, Image } from "react-native";
import GeoLocTools from '../Resources/GeoLoc';
import IconM from 'react-native-vector-icons/MaterialIcons';
import FetchRequest from "../Tools/FetchRequest";
import Url from '../Resources/Url';
import Colors from "../Colors";
import {getImage} from "../Resources/i18n";
import Strings from "../Resources/i18n";

class TransitFinal extends React.Component
{

    constructor(props){
        super(props);
        this.state = {
            grade:0,
            comment: '',            
            newComment: true
        }
        this.requests = [];
    }

    componentWillUnmount()
    {        
        this.requests.forEach(req => req.abort());
    }     

    componentDidMount(){
        let f = new FetchRequest(Url.rating.replace('{idCircuit}', this.props.circuit.id));
        this.requests.push(f);
        f.open()
        .then(response =>
        {            
            if (response.ok)
            {
                response.json().then(json => {         
                    this.setState({
                        newComment: false,
                        grade: json.grade,
                        comment: json.comment
                    })
                })
            }
        })

    }
    
    _changeGrade = (grade) => {
        this.setState({grade})
    }

    _sendRating = () => {
        let method = 'PUT';
        if(this.state.newComment){
            method ='POST';
        }
        body = {
            comment: this.state.comment,
            grade: this.state.grade
        }
        let f = new FetchRequest(Url.rating.replace('{idCircuit}', this.props.circuit.id), method, JSON.stringify(body));
        this.requests.push(f);
        f.open()
        .then(response =>
        {
            if (!response.ok)
            {
                Alert.alert("Erreur lors l'envoi de l'évaluation", "Impossible d'évaluer le circuit.")
            }else{
                this.props.removeCircuit();
            }
        })
    }
    
    _renderRating = () => {
        starGauge = [];
        let rating = this.state.grade

        for (let i = 1; i <= 5; i++)
        {
            if (rating >= 1)
            {
                starGauge.push(<IconM key={i} color="#f7cb4f" name="star" size={35} onPress={() => this._changeGrade(i)}/>);
                rating--;
            }            
            else
            {
                starGauge.push(<IconM key={i} color="#f7cb4f" name="star-border" size={35} onPress={() => this._changeGrade(i)}/>);
            }
        }

        return (
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <Text>{Strings("transitFinal", "grade") }</Text>
                {starGauge.map(item => item)}                
            </View>
        )
    }        

    render()
    {                
        return(
            <View style={{flex:1}}>
                <View style={{flex:1, alignItems: "center", justifyContent: "center"}} >
                    <Image source={getImage()}/>
                    <View style={{ flexDirection: 'row'}} >
                        <Text style={{flex:1, color:"black", fontSize:22, textAlign:"center", fontFamily: 'WelixBrush'}}>{Strings("transitFinal", "score") } {this.props.score} pts</Text>
                        <Text style={{flex:1, color:"black", fontSize:22, textAlign:"center", fontFamily: 'WelixBrush'}}>{Strings("transitFinal", "time") } {this.props.chrono}</Text>
                    </View>
                </View>
                <View style={{flex:1, margin:5, padding:5, borderWidth: 2, borderRadius:5, borderColor:Colors.secondary, backgroundColor:Colors.accent2}}>
                    <Text style={{flex:1, marginBottom:10, color:"black", fontSize:22,justifyContent:"center", textAlign:"center", fontFamily: 'WelixBrush'}}>{Strings("transitFinal", "evaluate") }</Text>
                    {this._renderRating()}
                    <TextInput style={{flex:5, marginVertical:5, backgroundColor: "white", borderColor: Colors.secondaryLight, borderWidth:1, borderRadius:5}} placeholder={Strings("transitFinal", "comment") } value={this.state.comment} multiline={true} onChangeText={(text) => this.setState({comment: text})} />
                    <Button color={Colors.secondary} style={{ borderRadius:5}} onPress={() => this._sendRating() } title={Strings("transitFinal", "send") }/>
                </View>
                <Button color={Colors.secondary} onPress={() => this.props.removeCircuit()} title={Strings("transitFinal", "backToMap") } />                
            </View>
        )
    }
}

export default TransitFinal;