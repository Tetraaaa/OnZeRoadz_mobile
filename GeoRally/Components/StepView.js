import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, Image, Alert, ScrollView, Button } from "react-native";
import FreeQuestion from './../Components/FreeQuestion';
import QCM from './../Components/QCM';
import Colors from './../Colors';

class StepView extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            score: 0,
            nbResponse: 0,
            disabled: this.props.step.questions.length === 0 ? false: true
        }
    }

    _addScore = (score) => {
        disabled = this.state.disabled;
        if(this.state.nbResponse+1 === this.props.step.questions.length){
            disabled = false;
        }
        this.setState({
            score: this.state.score + score,
            nbResponse: this.state.nbResponse+1,
            disabled: disabled
        })
    }

    render(){
        return(     
            <View style={{flex:3}}>
                <ScrollView style={{margin:5}}>
                    <Text>{this.props.step.name}</Text>
                    <Text>{this.props.step.description}</Text>
                    {this.props.step.questions.map((question) => {
                        if(question.type === "Free"){
                            return <FreeQuestion key={question.id} question={question} sendScore={(score) => this._addScore(score)}/>
                        }else if(question.type === "QCM"){
                            return <QCM key={question.id} question={question} sendScore={(score) => this._addScore(score)}/>
                        }
                    })}
                    <Button disabled={this.state.disabled} color={Colors.secondary} title="Valider l'étape" onPress={() => this.props.validStep(this.state.score)}/>
                </ScrollView>
            </View>            
        );
    }
}

export default StepView;