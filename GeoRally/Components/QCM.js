import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import Colors from './../Colors';
import HTML from "react-native-render-html";
import Button from './Button';

class QCM extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            borderColor: Colors.primary,
            disabled: false
        }
    }

    _checkAnswer = (answer) =>
    {
        if (this.props.question.rightAnswers.includes(answer))
        {
            color = "green";
            score = this.props.question.points;
        } else
        {
            color = Colors.error;
            score = 0;
        }
        this.setState({
            borderColor: color,
            disabled: true
        })
        this.props.sendScore(score)
    }

    render()
    {
        let answers = [];
        answers = answers.concat(this.props.question.falseAnswers, this.props.question.rightAnswers)
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <HTML
                        html={this.props.question.text}
                    />
                </ScrollView>

                <View>

                    {answers.map((answer, index) =>
                    {
                        if (answer)
                        {
                            let color = index % 2 ? Colors.primaryDark : Colors.primaryLight;
                            return <Button disabled={this.state.disabled} color={color} title={answer.toString()} key={index} onPress={() => this._checkAnswer(answer)} />
                        }

                    })}
                </View>

            </View>

        )
    }
}

export default QCM;