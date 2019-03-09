import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, Image, Alert, ScrollView, Button, Animated, PermissionsAndroid } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import GooglePlacesSearchBar from '../Components/GooglePlacesSearchBar';
import { connect } from 'react-redux'
import FetchRequest from "../Tools/FetchRequest";
import Url from "../Resources/Url";
import Colors from '../Colors';
import MapStyles from "../Resources/MapStyles";
import CircuitModal from "../Components/CircuitModal";

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
            return MapStyles.night;
        }
        else
        {
            return MapStyles.day;
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
                    throw new Error("Erreur lors de la récupération du circuit")
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
    }

    _unselectCircuit = () => 
    {
        this.setState({selectedMarker:null})
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
                <CircuitModal marker={this.state.selectedMarker} downloadingCircuit={this.state.downloadingCircuit} open={this.state.selectedMarker !== null} playable={this.state.selectedMarker && this.props.offlineReducer.circuits.map(item => item.id).includes(this.state.selectedMarker.id)} onPlay={() => { this.props.navigation.navigate("PlayScreen", { id: this.state.selectedMarker.id }) }} onDownload={() => { this._downloadCircuit(this.state.selectedMarker) }} />
            </View>

        );
    }
}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(MainScreen)