import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import Colors from "../../Colors";
import Url from "../../Resources/Url";
import FetchRequest from "../../Tools/FetchRequest";
import StepView from "./../../Components/StepView";
import TransitView from './../../Components/TransitView';

class PlayScreen extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            region: {
                latitude: null,
                longitude: null,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            },
            search: "",
            followingCurrentPosition: true,
            currentTransitIndex: this.getTransitIndexFromProgress(),
            inTransit: true,
            okGeoLoc: false,
            over: false,
            score: 0,
            startTime: null,
            expanded: false,
            currentQuestionIndex: 0,
            answeredQuestions: 0,
            showDescription: true
        };
        this.circuit = this.props.offlineReducer.circuits.find(item => item.id === this.props.navigation.getParam("id"));
        this.requests = [];
    }

    componentDidMount()
    {

        navigator.geolocation.getCurrentPosition(
            (infos) =>
            {
                if (this.checkPosition(infos.coords.latitude, infos.coords.longitude))
                {
                    this.setState({ okGeoLoc: true })
                }
            }
        );
        if (this.getAnsweredQuestions())
        {
            this.setState({ currentTransitIndex: this.state.currentTransitIndex + 1 })
        }

        this.trackPosition(this.state.inTransit);


    }

    trackPosition = (on) => 
    {
        if (on)
        {
            this.tracker = navigator.geolocation.watchPosition(
                (infos) =>
                {
                    if (this.circuit.transits[this.state.currentTransitIndex].step)
                    {
                        if (!this.state.over && this.circuit.transits[this.state.currentTransitIndex].step.geoLoc)
                        {
                            if (this.checkPosition(infos.coords.latitude, infos.coords.longitude))
                            {
                                this.setState({ okGeoLoc: true })
                            }
                        }
                    }
                },
                () => { },
                { enableHighAccuracy: true, distanceFilter: 1, timeout: 20000 }
            )
        }
        else
        {
            navigator.geolocation.clearWatch(this.tracker)
        }
    }

    getTransitIndexFromProgress()
    {
        let circuit = this.props.offlineReducer.circuits.find(item => item.id === this.props.navigation.getParam("id"));
        if (circuit.progress && circuit.progress.step)
        {
            let stepId = circuit.progress.step.id;
            let transit = circuit.transits.find(transit => transit.step.id === stepId);
            return transit.transitIndex;
        }
        else
        {
            return 0;
        }
    }

    getAnsweredQuestions()
    {
        let circuit = this.props.offlineReducer.circuits.find(item => item.id === this.props.navigation.getParam("id"));
        return circuit.transits[this.state.currentTransitIndex].step.questions.filter(question => question.questionProgress).length === this.circuit.transits[this.state.currentTransitIndex].step.questions.length
    }

    checkPosition = (lat, lng) =>
    {
        if (this.circuit.transits[this.state.currentTransitIndex].step)
        {
            if (Math.abs(lat.toFixed(3) - this.circuit.transits[this.state.currentTransitIndex].step.latitude.toFixed(3)) + Math.abs(lng.toFixed(3) - this.circuit.transits[this.state.currentTransitIndex].step.longitude.toFixed(3)) < 0.005) return true;
        }
    }


    componentWillUnmount()
    {
        this.requests.forEach(req => req.abort());
        navigator.geolocation.clearWatch(this.tracker)
    }

    _validTransit = (over) =>
    {
        if (over)
        {
            this.props.navigation.navigate('MainScreen')
        } else
        {
            this.setState({
                okGeoLoc: false,
                inTransit: false
            })
            this.trackPosition(false);
            if(!this.state.startTime) this.setState({startTime:Date.now()})

        }
    }

    _validStep = (score) =>
    {
        if (this.circuit.transits[this.state.currentTransitIndex + 1].step === null)
        {
            over = true;
        } else
        {
            over = false;
        }

        let startTime = this.state.startTime;
        if (this.circuit.transits[this.state.currentTransitIndex].transitIndex === 1)
        {
            startTime = Date.now();
        }

        this.setState({
            inTransit: true,
            currentTransitIndex: this.state.currentTransitIndex + 1,
            over,
            score: score + this.state.score,
            answeredQuestions: 0,
            currentQuestionIndex: 0,
            startTime
        }, () => this._sendProgress())
        this.trackPosition(true);
    }

    _sendProgress = () =>
    {
        let timeInterval = 0;
        if (this.state.startTime != null)
        {
            timeInterval = Date.now() - this.state.startTime;
        }
        body = {
            score: this.state.score,
            time: timeInterval
        }
        let f = new FetchRequest(Url.updateProgress.replace('{idCircuit}', this.circuit.id) + this.circuit.transits[this.state.currentTransitIndex - 1].step.id, 'POST', JSON.stringify(body));
        this.requests.push(f);
        f.open()
            .then(response =>
            {
                if (!response.ok)
                {
                    Alert.alert("Erreur lors de la mise à jour de la progression", "Impossible de mettre à jour la progression.")
                }
            })
        let action = { type: "UPDATE_PROGRESS", value: { id: this.circuit.id, progress: { step: this.circuit.transits[this.state.currentTransitIndex].step, score: this.state.score, time: timeInterval } } };
        this.props.dispatch(action);
    }

    _questionProgress = (transitId, questionId, progress) =>
    {
        let action = { type: "QUESTION_PROGRESS", value: { circuitId: this.circuit.id, transitId: transitId, questionId: questionId, questionProgress: progress } };
        this.props.dispatch(action);
        this.setState({
            answeredQuestions: this.state.answeredQuestions + 1
        }, () =>
            {
                if (this.state.answeredQuestions === this.circuit.transits[this.state.currentTransitIndex].step.questions.length)
                {
                    let totalScore = 0;
                    this.circuit.transits[this.state.currentTransitIndex].step.questions.forEach(question =>
                    {
                        totalScore += question.questionProgress.score
                    })
                    this._validStep(totalScore);
                }
            })
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

        let maxIndex = this.circuit.transits[this.state.currentTransitIndex].step.questions.length - 1;
        if (this.state.currentQuestionIndex < maxIndex)
        {
            this.setState({ currentQuestionIndex: this.state.currentQuestionIndex + 1 })
        }
    }

    _pauseCircuit = () =>
    {
        this.props.navigation.navigate("MainScreen");
    }

    _abandonCircuit = () =>
    {
        let action = { type: "REMOVE_PROGRESS", value: { id: this.circuit.id } };
        this.props.dispatch(action);
        let f = new FetchRequest(Url.updateProgress.slice(0, -1).replace('{idCircuit}', this.circuit.id), "DELETE");
        this.requests.push(f);
        f.open();
        this.props.navigation.navigate("MainScreen");
    }

    _goToQuestions = () =>
    {
        if (this.circuit.transits[this.state.currentTransitIndex].step.questions.length > 0)
        {
            this.setState({
                showDescription: false
            })
        }
        else
        {
            this.setState({
                showDescription: false
            })
            this._validStep(this.state.score)
        }
    }



    render()
    {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 11 }}>
                    {this.state.inTransit ? <TransitView transit={this.circuit.transits[this.state.currentTransitIndex]} okGeoLoc={this.state.okGeoLoc} validTransit={(over) => this._validTransit(over)} /> : <StepView goToQuestions={this._goToQuestions} showDescription={this.state.showDescription} transitId={this.circuit.transits[this.state.currentTransitIndex].id} step={this.circuit.transits[this.state.currentTransitIndex].step} currentQuestionIndex={this.state.currentQuestionIndex} answerQuestion={this._questionProgress} validStep={(score) => this._validStep(score)} />}
                </View>
                <View style={{ flex: 1, borderColor: Colors.primaryLight, borderWidth: 1, justifyContent: "center", flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: Colors.primary, fontSize: 16, flex: 1 }}>{(this.state.inTransit ? "Transit n°" : "Étape n°") + (this.state.currentTransitIndex + 1) + "/" + this.circuit.transits.length}</Text>
                    {
                        !this.state.inTransit ?
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <TouchableOpacity style={{ width: 32 }} onPress={this._previousQuestion} disabled={this.state.currentQuestionIndex <= 0}>
                                    <Icon name="navigate-before" size={32} color={this.state.currentQuestionIndex <= 0 ? "rgba(0,0,0,0)" : "grey"} />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 16, color: Colors.primary }}>{!this.state.inTransit ? "Question " + (this.state.currentQuestionIndex + 1) : null}</Text>
                                <TouchableOpacity style={{ width: 32 }} onPress={this._nextQuestion} disabled={this.state.currentQuestionIndex >= this.circuit.transits[this.state.currentTransitIndex].step.questions.length - 1}>
                                    <Icon name="navigate-next" size={32} color={this.state.currentQuestionIndex >= this.circuit.transits[this.state.currentTransitIndex].step.questions.length - 1 ? "rgba(0,0,0,0)" : "grey"} />
                                </TouchableOpacity>

                            </View>
                            :
                            null
                    }
                    {
                        this.state.currentTransitIndex === this.circuit.transits.length -1 ?
                            <View>
                            </View>
                            :
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>

                                <TouchableOpacity style={{ width: 32, borderWidth: 1, borderColor: "black", borderRadius: 2, marginRight: 5 }} onPress={this._pauseCircuit}>
                                    <Icon name="pause" size={32} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: 32, borderWidth: 1, borderColor: "black", borderRadius: 2, marginRight: 5 }} onPress={this._abandonCircuit} >
                                    <Icon name="flag" size={32} />
                                </TouchableOpacity>
                            </View>
                    }


                </View>
            </View>




        );
    }
}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(PlayScreen)