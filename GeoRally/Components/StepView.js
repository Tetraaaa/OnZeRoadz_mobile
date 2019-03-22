import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import FreeQuestion from './../Components/FreeQuestion';
import QCM from './../Components/QCM';
import Colors from './../Colors';
import Button from './Button';

class StepView extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            score: 0,
            nbResponse: 0,
            disabled: this.props.step.questions.length === 0 ? false : true,
            currentQuestionIndex: 0
        }
    }

    _previousQuestion = () =>
    {
        if (this.state.currentQuestionIndex > 0)
        {
            this.setState({ currentQuestionIndex: this.state.currentQuestionIndex - 1 })
        }
    }

    _nextQuestion = () =>
    {
        let maxIndex = this.props.step.questions.length - 1;
        if (this.state.currentQuestionIndex < maxIndex)
        {
            this.setState({ currentQuestionIndex: this.state.currentQuestionIndex + 1 })
        }
    }

    _addScore = (score) =>
    {
        disabled = this.state.disabled;
        if (this.state.nbResponse + 1 === this.props.step.questions.length)
        {
            disabled = false;
        }
        this.setState({
            score: this.state.score + score,
            nbResponse: this.state.nbResponse + 1,
            disabled: disabled
        })
    }

    render()
    {
        let question = this.props.step.questions[this.state.currentQuestionIndex]
        return (
            <View style={{ flex: 1 }}>
                <View style={{ margin: 5, flex:9}}>
                    {
                        question.type === "Free" ?
                            <FreeQuestion key={question.id} question={question} sendScore={(score) => this._addScore(score)} />
                            :
                            <QCM key={question.id} question={question} sendScore={(score) => this._addScore(score)} />
                    }
                    {
                        this.state.currentQuestionIndex === this.props.step.questions.length - 1 && <Button style={{margin:5}} disabled={this.state.disabled} color={Colors.secondary} title="Valider l'étape" onPress={() => this.props.validStep(this.state.score)} />
                    }
                </View>
                <View style={{flexDirection: "row", padding: 5, flex:1 }}>
                    <Button style={{ margin: 5 }} color={Colors.secondaryLight} title="Question précédente" onPress={this._previousQuestion} />
                    <Button style={{ margin: 5 }} color={Colors.secondaryLight} title="Question suivante" onPress={this._nextQuestion} />
                </View>
            </View>
        );
    }
}

export default StepView;