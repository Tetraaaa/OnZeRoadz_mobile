import React from 'react';
import { View, ActivityIndicator, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, Button } from "react-native";
import Colors from './../Colors';

class FreeQuestion extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            userAnswer: '',
            borderColor: Colors.primary,
            disabled: false
        }
    }

    _checkAnswer = () => {
        upperAnswer = this.props.question.response.toUpperCase();
        if(this.state.userAnswer.toUpperCase().includes(upperAnswer)){
            color = "green";
            score = this.props.question.points;
        }else{
            color= Colors.error;
            score = 0;
        }
        this.setState({
            borderColor: color,
            disabled: true
        })
        this.props.sendScore(score)
    }

    render(){
        return(
            <View style={{borderRadius:5, borderColor: this.state.borderColor, borderWidth: 2, borderStyle:"solid" }}>
                <Text>{this.props.question.text}</Text>
                <TextInput onChangeText={(userAnswer) => this.setState({ userAnswer })} placeholder="Réponse" />
                <Button color={Colors.primary} disabled={this.state.disabled} title="Valider la réponse" onPress={() => this._checkAnswer()}/>
            </View>
        );
    }
}

export default FreeQuestion;