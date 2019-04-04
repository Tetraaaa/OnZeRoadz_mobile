import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, Image, Alert, ScrollView, Dimensions } from "react-native";
import FreeQuestion from './../Components/FreeQuestion';
import QCM from './../Components/QCM';
import Colors from './../Colors';
import Button from './Button';
import HTML from 'react-native-render-html';
import Strings from '../Resources/i18n';

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



    _addScore = (questionId, score) =>
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
        this.props.answerQuestion(this.props.transitId, questionId, { id: questionId, score: score });
    }

    render()
    {
        let question = this.props.step.questions[this.props.currentQuestionIndex]
        return (
            <View style={{ flex: 1 }}>
                {
                    this.props.showDescription || !question ?
                        <View style={{ margin: 5, flex: 9 }}>
                            <Text style={{ textAlign: "center", fontSize: 16 }}>{this.props.step.name}</Text>
                            <ScrollView>
                                <HTML
                                    containerStyle={{ margin: 5 }}
                                    imagesMaxWidth={Dimensions.get('window').width * 0.95}
                                    html={this.props.step.description}
                                />
                                <Button title={this.props.step.questions.length > 0 ? Strings("playScreen", "goToQuestions") : Strings("playScreen", "nextStep")} onPress={() => { this.props.goToQuestions() }} />
                            </ScrollView>

                        </View>

                        :
                        <View style={{ margin: 5, flex: 9 }}>
                            {
                                question.type === "Free" ?
                                    <FreeQuestion key={question.id} question={question} sendScore={(score) => this._addScore(question.id, score)} />
                                    :
                                    <QCM key={question.id} question={question} sendScore={(score) => this._addScore(question.id, score)} />
                            }
                        </View>

                }

            </View>
        );
    }
}

export default StepView;