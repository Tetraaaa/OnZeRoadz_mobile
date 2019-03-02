import React from "react";
import { View, ActivityIndicator, Text, TouchableOpacity, Image, Alert, ScrollView, Button } from "react-native";
import Url from "../Resources/Url";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import FetchRequest from "../Tools/FetchRequest";
import { connect } from 'react-redux'
import TransitView from './../Components/TransitView';
import StepView from "./../Components/StepView";

class PlayScreen extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            region: {
                latitude: null,
                longitude: null,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
            },
            search: "",
            followingCurrentPosition: true,
            currentTransitIndex:0,
            inTransit:true,
            loading: true,
            okLatitude:false,
            okLongitude:false,
            okGeoLoc: false,
            over: false
        };
        this.circuit = this.props.offlineReducer.circuits.find(item => item.id === this.props.navigation.getParam("id"))
    }

    componentDidMount()
    {                
        this.tracker = navigator.geolocation.watchPosition(
            (infos) =>
            {                      
                if(!this.state.over && this.circuit.transits[this.state.currentTransitIndex].step.geoLoc){

                    currentTransit = this.circuit.transits[this.state.currentTransitIndex];   
                    
                    if(infos.coords.latitude >= currentTransit.step.latitude-this.state.region.latitudeDelta && infos.coords.latitude <= currentTransit.step.latitude+this.state.region.latitudeDelta &&
                        infos.coords.longitude >= currentTransit.step.longitude-this.state.region.longitudeDelta && infos.coords.longitude <= currentTransit.step.longitude+this.state.region.longitudeDelta){
                        if(!this.state.okGeoLoc){
                            this.setState({
                                okGeoLoc:true
                            },() => {
                                Alert.alert("ok geoloc");
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
        navigator.geolocation.clearWatch(this.tracker)
    }

    _validTransit(over){    
        if(over){
            this.props.navigation.navigate('MainScreen')
        }else{
            this.setState({
                okGeoLoc: false,
                okLatitude: false,
                okLongitude: false,
                inTransit: false
            })                
        }
    }

    _validStep(){
        if(this.circuit.transits[this.state.currentTransitIndex+1].step === null){
            over = true;       
        }else{
            over = false;
        }
        
        this.setState({
            inTransit: true,
            currentTransitIndex: this.state.currentTransitIndex+1,
            over
        })        
    }

    _getMapStyleDependingOnCurrentTime = () =>
    {
        let hours = new Date().getHours()
        if (hours > 21 || hours < 6)
        {
            return [
                {
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#1d2c4d"
                        }
                    ]
                },
                {
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#8ec3b9"
                        }
                    ]
                },
                {
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#1a3646"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "administrative.country",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#4b6878"
                        }
                    ]
                },
                {
                    "featureType": "administrative.land_parcel",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#64779e"
                        }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#4b6878"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#334e87"
                        }
                    ]
                },
                {
                    "featureType": "landscape.natural",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#023e58"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#283d6a"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#6f9ba5"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#1d2c4d"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#023e58"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#3C7680"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#304a7d"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#98a5be"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#1d2c4d"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#2c6675"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#255763"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#b0d5ce"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#023e58"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#98a5be"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#1d2c4d"
                        }
                    ]
                },
                {
                    "featureType": "transit.line",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#283d6a"
                        }
                    ]
                },
                {
                    "featureType": "transit.station",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#3a4762"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#0e1626"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#4e6d70"
                        }
                    ]
                }
            ]
        }
        else
        {
            return [
                {
                    "featureType": "administrative",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                }
            ]
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
                <View style={{ flex: 1 }}>
                    {this.state.inTransit ? <TransitView transit={this.circuit.transits[this.state.currentTransitIndex]} okGeoLoc={this.state.okGeoLoc} validTransit={(over) => this._validTransit(over)}/> : <StepView step={this.circuit.transits[this.state.currentTransitIndex].step} validStep={() => this._validStep()} /> }
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