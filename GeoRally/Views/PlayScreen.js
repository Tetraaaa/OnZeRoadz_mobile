import React from "react";
import { View, ActivityIndicator, Text, TouchableOpacity, Image, Alert, ScrollView, Button } from "react-native";
import Url from "../Resources/Url";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import FetchRequest from "../Tools/FetchRequest";
import { connect } from 'react-redux'
import TransitView from './../Components/TransitView';
import StepView from "./../Components/StepView";
import GeoLocConfig  from './../Resources/GeoLoc';
import MapStyles from "../Resources/MapStyles";

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
            currentTransitIndex:0,
            inTransit:true,
            loading: true,
            okGeoLoc: false,
            over: false,
            score:0,
            startTime: null
        };
        this.circuit = this.props.offlineReducer.circuits.find(item => item.id === this.props.navigation.getParam("id"));
        this.requests = [];
    }

    componentDidMount()
    {                
        this.tracker = navigator.geolocation.watchPosition(
            (infos) =>
            {                      
                if(!this.state.over && this.circuit.transits[this.state.currentTransitIndex].step.geoLoc){
                    
                    if(infos.coords.latitude >= this.circuit.transits[this.state.currentTransitIndex].step.latitude-GeoLocConfig.latitudeDelta && infos.coords.latitude <= this.circuit.transits[this.state.currentTransitIndex].step.latitude+GeoLocConfig.latitudeDelta &&
                        infos.coords.longitude >= this.circuit.transits[this.state.currentTransitIndex].step.longitude-GeoLocConfig.longitudeDelta && infos.coords.longitude <= this.circuit.transits[this.state.currentTransitIndex].step.longitude+GeoLocConfig.longitudeDelta){
                        if(!this.state.okGeoLoc){
                            this.setState({
                                okGeoLoc:true
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
                    },
                    loading: false
                });
            }
        );
    }


    componentWillUnmount()
    {
        this.requests.forEach(req => req.abort());
        navigator.geolocation.clearWatch(this.tracker)
    }

    _validTransit = (over) => {    
        if(over){
            this.props.navigation.navigate('MainScreen')
        }else{
            this.setState({
                okGeoLoc: false,
                inTransit: false
            })                
        }
    }

    _validStep = (score) => {
        if(this.circuit.transits[this.state.currentTransitIndex+1].step === null){
            over = true;       
        }else{
            over = false;
        }

        let startTime = this.state.startTime;
        if(this.circuit.transits[this.state.currentTransitIndex].transitIndex === 1){
            startTime = Date.now();
        }

        this.setState({
            inTransit: true,
            currentTransitIndex: this.state.currentTransitIndex+1,
            over,
            score: score+this.state.score,
            startTime
        }, () => this._sendProgress())                
    }

    _sendProgress = () => {
        let timeInterval = 0;        
        if(this.state.startTime != null){            
            timeInterval = Date.now()/1000 - this.state.startTime/1000;
        }
        body = {
            score: this.state.score,
            time: timeInterval
        }
        let f = new FetchRequest(Url.updateProgress.replace('{idCircuit}',this.circuit.id)+this.circuit.transits[this.state.currentTransitIndex-1].step.id,'POST',JSON.stringify(body));
        this.requests.push(f);
        f.open()
        .then(response =>
        {
            if (!response.ok)
            {
                Alert.alert("Erreur lors de la mise à jour de la progression", "Impossible de mettre à jour la progression.")
            }
        })
        .catch(error =>
        {
            Alert.alert("Erreur lors de la mise à jour de la progression", "Impossible de mettre à jour la progression.")
        })
    }

    _getMapStyleDependingOnCurrentTime = () =>
    {
        let hours = new Date().getHours()
        if (hours > 21 || hours < 6)
        {
            return MapStyles.night;
        }
        else
        {
            return MapStyles.day;
        }
    }    

    _centerMapOnSelf = () =>
    {
        this.setState({ followingCurrentPosition: true })
        navigator.geolocation.getCurrentPosition(
            (position) =>
            {                
                this.map.animateToRegion({ latitude: position.coords.latitude, longitude: position.coords.longitude, longitudeDelta: this.state.region.longitudeDelta, latitudeDelta: this.state.region.latitudeDelta }, 1000)             
            },
            () => { },
            { enableHighAccuracy: true }
        );
    }

    _centerMapOnPoint = (latitude, longitude) =>
    {
        this.map.animateToRegion({ latitude: latitude, longitude: longitude, longitudeDelta: this.state.region.longitudeDelta, latitudeDelta: this.state.region.latitudeDelta }, 1000)
    }

    render()
    {
        if (this.state.loading)
        {
            return (
                <View style={{ alignItems: 'center' }}>
                    <ActivityIndicator size={"large"} />
                    <Text>Chargement des cartes en cours...</Text>
                </View>
            );
        }
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 2 }}>
                    <MapView
                        style={{ flex: 1 }}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={this.state.region}
                        onRegionChangeComplete={(region) => { this.setState({ region }) }}
                        customMapStyle={this._getMapStyleDependingOnCurrentTime()}
                        showsUserLocation={true}
                        loadingEnabled={true}
                        onPanDrag={() => { if (this.state.followingCurrentPosition) this.setState({ followingCurrentPosition: false }) }}
                        ref={component => this.map = component}
                    >
                        {!this.state.over && <Marker coordinate={{ longitude: this.circuit.transits[this.state.currentTransitIndex].step.longitude, latitude: this.circuit.transits[this.state.currentTransitIndex].step.latitude }} pinColor={"red"} />}

                    </MapView>
                    <TouchableOpacity onPress={this._centerMapOnSelf} style={{ margin: 10, elevation: 4, alignItems: "center", justifyContent: 'center', position: 'absolute', bottom: 0, right: 1, width: 54, height: 54, borderRadius: 26, backgroundColor: "white" }}>
                        <Image style={{ width: 32, height: 32 }} source={require("../Resources/Images/target.png")} />
                    </TouchableOpacity>
                </View>               
                {this.state.inTransit ? <TransitView transit={this.circuit.transits[this.state.currentTransitIndex]} okGeoLoc={this.state.okGeoLoc} validTransit={(over) => this._validTransit(over)}/> : <StepView step={this.circuit.transits[this.state.currentTransitIndex].step} validStep={(score) => this._validStep(score)} /> }
            </View>

        );
    }
}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(PlayScreen)