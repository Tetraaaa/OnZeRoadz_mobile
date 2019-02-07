import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, Image, Alert } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import GooglePlacesSearchBar from '../Components/GooglePlacesSearchBar';

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
            loading: true
        };
    }



    componentDidMount()
    {
        this.tracker = navigator.geolocation.watchPosition(
            (infos) => {
                if(this.map && this.state.followingCurrentPosition)
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
                        latitudeDelta:this.state.region.latitudeDelta,
                        longitudeDelta:this.state.region.longitudeDelta
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
                        onRegionChangeComplete={(region) => {this.setState({region})}}
                        customMapStyle={this._getMapStyleDependingOnCurrentTime()}
                        showsUserLocation={true}
                        loadingEnabled={true}
                        onPanDrag={() => {if (this.state.followingCurrentPosition) this.setState({followingCurrentPosition:false})}}
                        mapType={"hybrid"}
                        ref={component => this.map = component}
                    >
                    </MapView>
                </View>
                <View style={{ position: "absolute", top: 0, left: 0, backgroundColor: "white", width: "100%", flex: 1, flexDirection: "row" }}>
                    <GooglePlacesSearchBar onChangeText={(search) => this.setState({ search })} value={this.state.search} onSearch={(searchInfos) => {this.setState({followingCurrentPosition:false}, () => {this.map.animateToRegion({ latitude: searchInfos.result.geometry.location.lat, longitude: searchInfos.result.geometry.location.lng, longitudeDelta: 0.005, latitudeDelta: 0.005 }, 1000)})}} />
                </View>
                <TouchableOpacity onPress={this._centerMapOnSelf} style={{ margin: 10, elevation: 4, alignItems: "center", justifyContent: 'center', position: 'absolute', bottom: 0, right: 1, width: 54, height: 54, borderRadius: 26, backgroundColor: "white"}}>
                    <Image style={{ width: 32, height: 32 }} source={require("../Resources/Images/target.png")} />
                </TouchableOpacity>
            </View>

        );
    }
}

export default MainScreen;