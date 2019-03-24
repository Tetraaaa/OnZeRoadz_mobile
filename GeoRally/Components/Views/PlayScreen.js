import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import Colors from "../../Colors";
import Url from "../../Resources/Url";
import FetchRequest from "../../Tools/FetchRequest";
import StepView from "./../../Components/StepView";
import TransitView from './../../Components/TransitView';
import GeoLocConfig from './../../Resources/GeoLoc';

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
            currentTransitIndex: this.props.offlineReducer.circuits.find(item => item.id === this.props.navigation.getParam("id")).progress.currentProgressIndex || 0,
            inTransit: this.props.offlineReducer.circuits.find(item => item.id === this.props.navigation.getParam("id")).progress.inTransit || true,
            okGeoLoc: false,
            over: false,
            score: 0,
            startTime: null,
            expanded: false,
            currentQuestionIndex: 0,
            answeredQuestions:0
        };
        this.circuit = this.props.offlineReducer.circuits.find(item => item.id === this.props.navigation.getParam("id"));
        this.requests = [];
    }

    componentDidMount()
    {
        this.tracker = navigator.geolocation.watchPosition(
            (infos) =>
            {
                if (!this.state.over && this.circuit.transits[this.state.currentTransitIndex].step.geoLoc)
                {

                    if (infos.coords.latitude >= this.circuit.transits[this.state.currentTransitIndex].step.latitude - GeoLocConfig.latitudeDelta && infos.coords.latitude <= this.circuit.transits[this.state.currentTransitIndex].step.latitude + GeoLocConfig.latitudeDelta &&
                        infos.coords.longitude >= this.circuit.transits[this.state.currentTransitIndex].step.longitude - GeoLocConfig.longitudeDelta && infos.coords.longitude <= this.circuit.transits[this.state.currentTransitIndex].step.longitude + GeoLocConfig.longitudeDelta)
                    {
                        if (!this.state.okGeoLoc)
                        {
                            this.setState({
                                okGeoLoc: true
                            })
                        }
                    }

                }

                if (this.map && this.state.followingCurrentPosition)
                {
                    this._centerMapOnPoint(infos.coords.latitude, infos.coords.longitude)
                }
            },
            () => { },
            { enableHighAccuracy: true, distanceFilter: 1, timeout: 20000 }
        )

        navigator.geolocation.getCurrentPosition(
            (position) =>
            {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: this.state.region.latitudeDelta,
                        longitudeDelta: this.state.region.longitudeDelta
                    }
                });
            }
        );
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
            startTime
        }, () => this._sendProgress())
    }

    _sendProgress = () =>
    {
        let timeInterval = 0;
        if (this.state.startTime != null)
        {
            timeInterval = Date.now() / 1000 - this.state.startTime / 1000;
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
        let action = { type: "UPDATE_PROGRESS", value: { id: this.circuit.id, progress: { currentTransitIndex: this.circuit.transits[this.state.currentTransitIndex - 1].step.id, score: this.state.score, time: timeInterval, inTransit:this.state.inTransit } } };
        this.props.dispatch(action);
    }

    _questionProgress = (transitId, questionId, progress) =>
    {
        let action = {type:"QUESTION_PROGRESS", value:{circuitId: this.circuit.id, transitId:transitId, questionId:questionId, questionProgress:progress}};
        this.props.dispatch(action);
        this.setState({
            answeredQuestions:this.state.answeredQuestions + 1
        }, () => {
            if(this.state.answeredQuestions === this.circuit.transits[this.state.currentTransitIndex].step.questions.length)
            {
                let totalScore = 0;
                this.circuit.transits[this.state.currentTransitIndex].step.questions.forEach(question => {
                    totalScore+=question.questionProgress.score
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
        this.props.navigation.navigate("MainScreen");
    }

    render()
    {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 11 }}>
                    {this.state.inTransit ? <TransitView transit={this.circuit.transits[this.state.currentTransitIndex]} okGeoLoc={this.state.okGeoLoc} validTransit={(over) => this._validTransit(over)} /> : <StepView transitId={this.circuit.transits[this.state.currentTransitIndex].id} step={this.circuit.transits[this.state.currentTransitIndex].step} currentQuestionIndex={this.state.currentQuestionIndex} answerQuestion={this._questionProgress} validStep={(score) => this._validStep(score)} />}
                </View>
                <View style={{ flex: 1, borderColor: Colors.primaryLight, borderWidth: 1, justifyContent: "center", flexDirection: "row", alignItems:"center" }}>
                    <Text style={{ color: Colors.primary, fontSize: 16, flex:1 }}>{(this.state.inTransit ? "Transit n°" : "Étape n°") + (this.state.currentTransitIndex + 1) + "/" + this.circuit.transits.length}</Text>
                    {
                        !this.state.inTransit ?
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <TouchableOpacity style={{ width: 32}} onPress={this._previousQuestion} disabled={this.state.currentQuestionIndex <= 0}>
                                    <Icon name="navigate-before" size={32} color={this.state.currentQuestionIndex <= 0 ? "rgba(0,0,0,0)" : "grey"} />
                                </TouchableOpacity>
                                <Text style={{fontSize:16, color:Colors.primary}}>{!this.state.inTransit ? "Question " + (this.state.currentQuestionIndex + 1) : null}</Text>
                                <TouchableOpacity style={{ width: 32}} onPress={this._nextQuestion} disabled={this.state.currentQuestionIndex >= this.circuit.transits[this.state.currentTransitIndex].step.questions.length -1}>
                                    <Icon name="navigate-next" size={32} color={this.state.currentQuestionIndex >= this.circuit.transits[this.state.currentTransitIndex].step.questions.length -1 ? "rgba(0,0,0,0)" : "grey"} />
                                </TouchableOpacity>

                            </View>
                            :
                            null
                    }

                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                        <TouchableOpacity style={{ width: 32, borderWidth: 1, borderColor: "black", borderRadius: 2, marginRight: 5 }} onPress={this._pauseCircuit}>
                            <Icon name="pause" size={32} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: 32, borderWidth: 1, borderColor: "black", borderRadius: 2, marginRight: 5 }} onPress={this._abandonCircuit} >
                            <Icon name="flag" size={32} />
                        </TouchableOpacity>
                    </View>

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