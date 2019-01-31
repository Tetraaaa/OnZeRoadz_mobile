import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

class MainScreen extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            region: {
                latitude: null,
                longitude: null,
                latitudeDelta: null,
                longitudeDelta: null
            },
            loading: true,
        };
    }



    componentDidMount()
    {
        navigator.geolocation.getCurrentPosition(
            (position) =>
            {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    },
                    loading: false
                });
            }
        );
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
                            "color": "#242f3e"
                        }
                    ]
                },
                {
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#746855"
                        }
                    ]
                },
                {
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#242f3e"
                        }
                    ]
                },
                {
                    "featureType": "administrative.locality",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#d59563"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#d59563"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#263c3f"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#6b9a76"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#38414e"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#212a37"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#9ca5b3"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#746855"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#1f2835"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#f3d19c"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#2f3948"
                        }
                    ]
                },
                {
                    "featureType": "transit.station",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#d59563"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#17263c"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#515c6d"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#17263c"
                        }
                    ]
                }
            ];
        }
        else
        {
            return [];
        }
    }

    _centerMapOnSelf = () =>
    {
        navigator.geolocation.getCurrentPosition(
            (position) =>
            {
                this.map.animateToRegion({latitude:position.coords.latitude, longitude:position.coords.longitude, longitudeDelta:0.005, latitudeDelta:0.005}, 1000)
            }
        );
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
                <View style={{ flex: 1 }}>
                    <MapView
                        style={{ flex: 1 }}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={this.state.region}
                        onRegionChange={(region) => this.setState({ region })}
                        customMapStyle={this._getMapStyleDependingOnCurrentTime()}
                        ref={component => this.map = component}
                    />
                </View>
                <TouchableOpacity onPress={this._centerMapOnSelf} style={{margin:10, elevation:4, alignItems:"center", justifyContent:'center', position:'absolute', bottom:0, right:1, width: 54, height: 54, borderRadius: 26, backgroundColor: "white", shadowOffset: 2 }}>
                    <Image style={{width:32, height:32}} source={require("../Resources/Images/target.png")}/>
                </TouchableOpacity>
            </View>

        );
    }
}

export default MainScreen;