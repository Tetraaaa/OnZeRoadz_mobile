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
            selectedAnswers: [],
            score:null,
            disabled: false
        }
    }

    _checkAnswer = () =>
    {
        let correct = true;
        this.state.selectedAnswers.forEach(answer =>
        {
            if (this.props.question.falseAnswers.includes(answer))
            {
                correct = false;
            }
        })


        if (correct)
        {
            score = this.props.question.points;
        }
        else
        {
            color = Colors.error;
            score = 0;
        }

        this.props.sendScore(score)
        this.setState({
            score:score,
            borderColor: color,
            disabled: true
        })

    }

    _selectUnselect = (answer) =>
    {
        if (this.state.selectedAnswers.includes(answer))
        {
            this.setState({
                selectedAnswers: this.state.selectedAnswers.filter(item => item !== answer)
            })
        }
        else
        {
            this.setState({
                selectedAnswers: this.state.selectedAnswers.concat(answer)
            })
        }
    }

    _renderButtons = () =>
    {
        let answers = [];
        answers = answers.concat(this.props.question.falseAnswers, this.props.question.rightAnswers)
        let jsx = [];
        let i = 0;
        while (i < answers.length)
        {
            let answer1 = answers[i];
            let answer2 = answers[i + 1];

            jsx.push(
                <View key={i} style={{ flexDirection: "row", flex: 1 }}>
                    <Button disabledColor={this.props.question.rightAnswers.includes(answer1) ? "green" : Colors.error} style={{ flex: 1, margin: 3 }} disabled={this.state.disabled} color={this.state.selectedAnswers.includes(answer1) ? Colors.primaryLight : Colors.primaryDark} title={answer1.toString()} key={i} onPress={() => this._selectUnselect(answer1)} />
                    {answer2 ? <Button disabledColor={this.props.question.rightAnswers.includes(answer1) ? "green" : Colors.error} style={{ flex: 1, margin: 3 }} disabled={this.state.disabled} color={this.state.selectedAnswers.includes(answer2) ? Colors.primaryLight : Colors.primaryDark} title={answer2.toString()} key={i + 1} onPress={() => this._selectUnselect(answer2)} /> : <View style={{ flex: 1, margin: 3, padding: 7 }} />}
                </View>
            )
            i += 2;
        }
        return (
            <View style={{ flex: 1 }}>
                {jsx.map(item => item)}
            </View>
        );

    }

    render()
    {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <HTML
                        html={this.props.question.text}
                    />
                    {this._renderButtons()}
                </ScrollView>
                <View>
                    <Button color={Colors.primary} disabledColor={this.state.score === 0 ? Colors.error : "green" } disabled={this.state.disabled} title="Valider la réponse" onPress={this._checkAnswer} />
                </View>
            </View>

        )
    }
}

export default QCM;