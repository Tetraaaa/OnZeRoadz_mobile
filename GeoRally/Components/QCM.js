import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, Image, Alert, ScrollView, Button } from "react-native";
import Colors from './../Colors';

class QCM extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            borderColor: Colors.primary,
            disabled: false
        }
    }

    _checkAnswer = (answerId) => {
        
        if(answerId === this.props.question.answer.id){
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
                {this.props.question.answers.map((answer, index) => {
                    color = index % 2 ? Colors.primaryDark : Colors.primaryLight;
                    return <Button color={color} disabled={this.state.disabled} key={answer.id} title={answer.label} onPress={() => this._checkAnswer(answer.id)}/>
                })}
            </View>
        );
    }
}

export default QCM;