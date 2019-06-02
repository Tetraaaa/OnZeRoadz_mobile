import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, Dimensions } from "react-native";
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
        let renderers= {
            p: {fontSize:16}
        }
        return (
            <View style={{ flex: 1 }}>
                {
                    this.props.showDescription || !question ?
                        <View style={{ margin: 5, flex: 9 }}>
                            <Text style={{ textAlign: "center", fontSize: 20, color:Colors.primaryDark }}>{this.props.step.name}</Text>
                            <ScrollView>
                                <HTML
                                    tagsStyles={renderers}
                                    ignoredTags={["br"]}
                                    ignoredStyles={["display"]}
                                    containerStyle={{ margin: 5 }}
                                    imagesMaxWidth={Dimensions.get('window').width * 0.95}
                                    html={this.props.step.description || "<p>" + Strings("playScreen", "noDescription") + "</p>"}
                                />
                            </ScrollView>
                            <Button title={this.props.step.questions.length > 0 ? Strings("playScreen", "goToQuestions") : Strings("playScreen", "nextStep")} onPress={() => { this.props.goToQuestions() }} />
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