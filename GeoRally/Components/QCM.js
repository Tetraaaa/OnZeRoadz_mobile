import React from 'react';
import { ScrollView, View, Dimensions } from "react-native";
import HTML from "react-native-render-html";
import Colors from './../Colors';
import Button from './Button';
import Strings from '../Resources/i18n';

class QCM extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            borderColor: Colors.primary,
            selectedAnswers: [],
            disabled: this.props.question.questionProgress ? true : false
        }
    }

    _checkAnswer = () =>
    {
        let falseAnswers = this.props.question.answers.filter(answer => !answer.isTrue)
        if (this.state.selectedAnswers.length === 0) 
        {
            this.props.sendScore(0);
            return;
        }

        let correct = true;
        this.state.selectedAnswers.forEach(answer =>
        {
            if (falseAnswers.includes(answer))
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
            score = 0;
        }

        this.props.sendScore(score)

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
        let rightAnswers = this.props.question.answers.filter(answer => answer.isTrue);
        let answers = [];
        answers = this.shuffle(this.props.question.answers);
        let jsx = [];
        let i = 0;
        while (i < answers.length)
        {
            let answer1 = answers[i];
            let answer2 = answers[i + 1];

            jsx.push(
                <View key={i} style={{ flexDirection: "row", flex: 1 }}>
                    <Button disabledColor={rightAnswers.includes(answer1) ? "green" : Colors.error} style={{ flex: 1, margin: 3 }} disabled={this.props.question.questionProgress ? true : false} color={this.state.selectedAnswers.includes(answer1) ? Colors.primaryLight : Colors.primaryDark} title={answer1.value.toString()} key={i} onPress={() => this._selectUnselect(answer1)} />
                    {answer2 ? <Button disabledColor={rightAnswers.includes(answer2) ? "green" : Colors.error} style={{ flex: 1, margin: 3 }} disabled={this.props.question.questionProgress ? true : false} color={this.state.selectedAnswers.includes(answer2) ? Colors.primaryLight : Colors.primaryDark} title={answer2.value.toString()} key={i + 1} onPress={() => this._selectUnselect(answer2)} /> : <View style={{ flex: 1, margin: 3, padding: 7 }} />}
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
                        containerStyle={{ margin: 5 }}
                        imagesMaxWidth={Dimensions.get('window').width * 0.95}
                        html={this.props.question.text}
                    />
                    {this._renderButtons()}
                </ScrollView>
                <View>
                    <Button color={Colors.primary} disabledColor={this.props.score === 0 ? Colors.error : "green"} disabled={this.props.question.questionProgress ? true : false} title={Strings("playScreen", "validateAnswer")} onPress={this._checkAnswer} />
                </View>
            </View>

        )
    }
}

export default QCM;