import React from 'react';
import { Image, View, Dimensions, ScrollView } from "react-native";
import HTML from "react-native-render-html";
import Colors from './../Colors';
import TextInput from "./TextInput";
import Button from './Button';
import Strings from '../Resources/i18n';

class FreeQuestion extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            userAnswer: '',
            borderColor: Colors.primary,
            disabled: false
        }
    }

    _banalizeString(string)
    {
        let correspondances = {
            "é": "e",
            "è": "e",
            "ê": "e",
            "ë": "e",
            "-": " ",
            "ô": "o",
            "à": "a",
            "â": "a",
            "ù": "u",
            "ü": "u"
        }
        let final = ""
        for (let i = 0; i < string.length; i++)
        {
            let char = string[i].toLowerCase()
            if (correspondances[char]) 
            {
                final += correspondances[char]
            }
            else
            {
                final += char
            }
        }
        return final;

    }

    _normalize = (keywords) =>
    {
        return keywords.map(word => this._banalizeString(word.toLowerCase()))
    }

    _matchWithTolerance = (string1, string2, tolerance = 1) =>
    {
        let s1 = this._banalizeString(string1);
        let s2 = this._banalizeString(string2);

        let diff = s1.length - s2.length;

        if (diff < 0)
        {
            s1 = s1.padEnd(string2.length, "a")
        }
        else if (diff > 0)
        {
            s2 = s2.padEnd(string1.length, "a")
        }
        let remainingErrors = tolerance;
        for (let i = 0; i < s1.length; i++)
        {
            if (s1[i] !== s2[i])
            {
                remainingErrors--;
            }
        }
        return remainingErrors >= 0
    }


    _checkAnswer = () =>
    {
        let normalizedKeywords = this._normalize(this.props.question.keywords)
        let normalizedAnswer = this._banalizeString(this.state.userAnswer)

        this.rightAnswer = false;
        normalizedKeywords.forEach(keyword =>
        {
            if (this._matchWithTolerance(keyword, normalizedAnswer))
            {
                this.rightAnswer = true;
                return;
            }
        })

        if (this.rightAnswer)
        {
            color = "green";
            this.score = this.props.question.points;
        } else
        {
            color = Colors.error;
            this.score = 0;
        }
        this.setState({
            borderColor: color,
            disabled: true
        })
        this.props.sendScore(this.score)
    }

    render()
    {
        return (
            <View style={{flex: 1 }}>
                <ScrollView>
                    <HTML
                        containerStyle={{ margin: 5 }}
                        imagesMaxWidth={Dimensions.get('window').width * 0.95}
                        html={this.props.question.text}
                    />
                </ScrollView>
                <View>
                    <TextInput onChangeText={(userAnswer) => this.setState({ userAnswer })} placeholder={Strings("playScreen", "response")} editable={this.props.question.questionProgress ? false : true}/>
                    <Button color={Colors.primary} disabled={this.props.question.questionProgress ? true : false} disabledColor={this.rightAnswer ? "green" : Colors.error} title={Strings("playScreen", "validateAnswer")} onPress={this._checkAnswer} />
                </View>


            </View>
        );
    }
}

export default FreeQuestion;