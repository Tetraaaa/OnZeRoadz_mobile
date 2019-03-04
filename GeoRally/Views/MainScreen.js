import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, Image, Alert, ScrollView, Button, Animated } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import GooglePlacesSearchBar from '../Components/GooglePlacesSearchBar';
import { connect } from 'react-redux'
import FetchRequest from "../Tools/FetchRequest";
import Url from "../Resources/Url";
import Colors from '../Colors';

class MainScreen extends React.Component
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
            selectedMarker: null,
            modalHeight: new Animated.Value(0),
            loading: true,
            loadingCircuit: false
        };
    }

    componentDidMount()
    {
        this.tracker = navigator.geolocation.watchPosition(
            (infos) =>
            {
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

    _downloadCircuit = (item) =>
    {
        this.setState({ downloadingCircuit: true })
        let f = new FetchRequest(Url.circuit + item.id);
        f.open()
            .then(response =>
            {
                if (response.ok)
                {
                    response.json()
                        .then(json =>
                        {
                            let action = { type: "DOWNLOAD_CIRCUIT", value: json }
                            this.props.dispatch(action);
                            this.setState({ downloadingCircuit: false })
                        })

                }
                else
                {
                    Alert.alert("Erreur lors de la récupération du circuit", "Impossible de télécharger le circuit sélectionné.")
                    this.setState({ downloadingCircuit: false })
                }
            })
            .catch(error =>
            {
                Alert.alert("Erreur lors de la récupération du circuit", "Impossible de télécharger le circuit sélectionné.")
                this.setState({ downloadingCircuit: false })
            })
    }

    _centerMapOnPoint = (latitude, longitude) =>
    {
        this.map.animateToRegion({ latitude: latitude, longitude: longitude, longitudeDelta: this.state.region.longitudeDelta, latitudeDelta: this.state.region.latitudeDelta }, 1000)
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

    _selectCircuit = (item) => 
    {
        this.setState({ selectedMarker: item, followingCurrentPosition: false });
        Animated.spring(this.state.modalHeight, {
            toValue: 150,
            duration: 1500
        }).start()
    }

    _unselectCircuit = () => 
    {

        Animated.timing(this.state.modalHeight, {
            toValue: 0,
            duration: 300
        }).start(() =>
        {
            this.setState({ selectedMarker: null })
        }
        )
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
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
                    <MapView
                        onPress={this._unselectCircuit}
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
                        {
                            this.props.circuitsReducer.circuits.filter(item => !this.props.offlineReducer.circuits.map(i => i.id).includes(item.id)).map((item) =>
                            {
                                return (
                                    <Marker key={item.id} coordinate={{ longitude: item.transits[0].step.longitude, latitude: item.transits[0].step.latitude }} pinColor={"red"} onPress={() => { this._selectCircuit(item) }} />
                                )
                            })
                        }
                        {
                            this.props.offlineReducer.circuits.map((item) =>
                            {
                                return (
                                    <Marker key={item.id} coordinate={{ longitude: item.transits[0].step.longitude, latitude: item.transits[0].step.latitude }} pinColor={"blue"} onPress={() => { this._selectCircuit(item) }} />
                                )
                            })
                        }
                    </MapView>
                </ScrollView>
                <View style={{ position: "absolute", top: 0, left: 0, backgroundColor: "rgba(0,0,0,0)", width: "100%", flex: 1, flexDirection: "row" }}>
                    <GooglePlacesSearchBar onChangeText={(search) => this.setState({ search })} value={this.state.search} onSearch={(searchInfos) => { this.setState({ followingCurrentPosition: false }, () => { this.map.animateToRegion({ latitude: searchInfos.result.geometry.location.lat, longitude: searchInfos.result.geometry.location.lng, longitudeDelta: 0.005, latitudeDelta: 0.005 }, 1000) }) }} />
                </View>
                <TouchableOpacity onPress={this._centerMapOnSelf} style={{ margin: 10, elevation: 4, alignItems: "center", justifyContent: 'center', position: 'absolute', bottom: 0, right: 1, width: 54, height: 54, borderRadius: 26, backgroundColor: "white" }}>
                    <Image style={{ width: 32, height: 32 }} source={require("../Resources/Images/target.png")} />
                </TouchableOpacity>
                {
                    this.state.selectedMarker ?
                        this.state.downloadingCircuit ?
                            <Animated.View style={{ height: this.state.modalHeight, position: "absolute", bottom: 1, backgroundColor: "white", borderTopLeftRadius: 10, borderTopRightRadius: 10, width: "100%", elevation: 4 }}>
                                <ActivityIndicator size="large" color={Colors.primary} />
                                <Text style={{textAlign:"center"}}>Téléchargement du circuit...</Text>
                            </Animated.View>

                            :
                            <Animated.View style={{ height: this.state.modalHeight, position: "absolute", bottom: 1, backgroundColor: "white", borderTopLeftRadius: 10, borderTopRightRadius: 10, width: "100%", elevation: 4  }}>
                                <Text style={{ textAlign: "center", color: "black", fontSize: 18, margin: 3 }}>{this.state.selectedMarker.name}</Text>
                                <Text style={{ color: "black" }}>{this.state.selectedMarker.description}</Text>
                                <Text>{this.state.selectedMarker.length / 1000 + " km"}</Text>
                                <Button style={{margin:8}} title={this.props.offlineReducer.circuits.map(item => item.id).includes(this.state.selectedMarker.id) ? "Jouer" : "Télécharger"} onPress={this.props.offlineReducer.circuits.map(item => item.id).includes(this.state.selectedMarker.id) ? () => { this.props.navigation.navigate("PlayScreen", { id: this.state.selectedMarker.id }) } : () => { this._downloadCircuit(this.state.selectedMarker) }} />
                            </Animated.View>
                        :
                        null

                }
            </View>

        );
    }
}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(MainScreen)