import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, Button, Animated, PermissionsAndroid, ActivityIndicator } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import GooglePlacesSearchBar from '../../Components/GooglePlacesSearchBar';
import { connect } from 'react-redux'
import FetchRequest from "../../Tools/FetchRequest";
import Url from "../../Resources/Url";
import MapStyles from "../../Resources/MapStyles";
import CircuitModal from "../../Components/CircuitModal";
import Colors from '../../Colors';
import Strings from '../../Resources/i18n';
import ActivityIndicatorLogo from '../ActivityIndicator';
import GeoSpy from '../../Tools/GeoSpy';

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
            loadingCircuit: false,
            fetchingCircuits: false,
            minDistance: 0,
            maxDistance: 0,
            minDuration: 0,
            maxDuration: 0,
            minNote: 0            
        };
        socketOpen = false;
    }

    componentDidMount()
    {
        this.tracker = navigator.geolocation.watchPosition(
            (infos) =>
            {
                console.log("TICK Main");
                if(this.socketOpen){                        
                    GeoSpy.send(this.ws,infos.coords.longitude, infos.coords.latitude);
                }

                if (this.map && this.state.followingCurrentPosition)
                {
                    this._centerMapOnPoint(infos.coords.latitude, infos.coords.longitude)
                }
            },
            () => { },
            { enableHighAccuracy: true, distanceFilter: 1, timeout: 20000 }
        )

        this.ws = GeoSpy.create("MainScreen", (value) => this.socketOpen = value);

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

        this._checkDownloadedCircuitsVersion();
    }

    componentWillUnmount()
    {        
        this.ws.close();
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

    _fetchCircuits = (northeast, southwest) =>
    {
        this.setState({ fetchingCircuits: true })
        let body = {
            "NElongitude": northeast.longitude,
            "NElatitude": northeast.latitude,
            "SOlongitude": southwest.longitude,
            "SOlatitude": southwest.latitude,
            "distanceMin": this.state.minDistance,
            "distanceMax": this.state.maxDistance,
            "note": this.state.minNote,
            "durationMax": this.state.maxDuration,
            "durationMin": this.state.minDuration,
        }
        new FetchRequest(Url.publishedCircuits, "POST", JSON.stringify(body)).open()
            .then(response =>
            {
                if (response.ok)
                {
                    response.json().then(json =>
                    {
                        let action = { type: "SET_CIRCUITS", value: json }
                        this.props.dispatch(action);
                        this.setState({ fetchingCircuits: false })
                    })
                }
            })
    }

    _downloadCircuit = (item, languageId) =>
    {
        
        this.setState({ downloadingCircuit: true })
        let f = new FetchRequest(Url.circuit + item.id+'?languageId='+languageId);
        f.open()
            .then(response =>
            {
                if (response.ok)
                {
                    response.json()
                        .then(json =>
                        {
                            let circuit = json.circuit;
                            let progress = json.progress;
                            Object.assign(circuit, progress);
                            let action = { type: "DOWNLOAD_CIRCUIT", value: circuit }
                            this.props.dispatch(action);
                            this.setState({ downloadingCircuit: false, selectedMarker:circuit})
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
        this.setState({ selectedMarker: null })
    }

    _checkDownloadedCircuitsVersion = () =>
    {
        circuits = [];
        this.props.offlineReducer.circuits.map((circuit) => circuits.push({
            "circuitId": circuit.id,
            "version": circuit.versionId
        }))
        let body = { "circuits": circuits };
        let f = new FetchRequest(Url.checkCircuitsVersion, "POST", JSON.stringify(body));
        f.open()
            .then(response =>
            {
                if (response.ok)
                {
                    response.json()
                        .then(json =>
                        {
                            let action = { type: "CHECK_UPDATE", value: json }
                            this.props.dispatch(action);
                        })
                }
                else
                {
                    throw new Error("Erreur lors de la vérification des mises à jour")
                }
            })
            .catch(error =>
            {
                Alert.alert("Erreur lors de la récupération des mises à jour des circuits", "Il est possible que certains de vos circuits ne soient pas à jour.")
                this.setState({ downloadingCircuit: false })
            })
    }
    _filterSelection = (filters) =>
    {
        this.setState({
            fetchingCircuits: true,
            minDistance: filters.distanceMin,
            maxDistance: filters.distanceMax,
            minDuration: filters.durationMin,
            maxDuration: filters.durationMax,
            minNote: filters.note
        })
        let region = this.state.region;
        let northeast = {
            latitude: region.latitude + region.latitudeDelta / 2,
            longitude: region.longitude + region.longitudeDelta / 2,
        };
        let southwest = {
            latitude: region.latitude - region.latitudeDelta / 2,
            longitude: region.longitude - region.longitudeDelta / 2,
        };
        let body = {
            "distanceMin": filters.distanceMin,
            "distanceMax": filters.distanceMax,
            "note": filters.note,
            "durationMax": filters.durationMax,
            "durationMin": filters.durationMin,
            "NElongitude": northeast.longitude,
            "NElatitude": northeast.latitude,
            "SOlongitude": southwest.longitude,
            "SOlatitude": southwest.latitude,
        }
        new FetchRequest(Url.publishedCircuits, "POST", JSON.stringify(body)).open()
            .then(response =>
            {
                if (response.ok)
                {
                    response.json().then(json =>
                    {
                        let action = { type: "SET_CIRCUITS", value: json }
                        this.props.dispatch(action)
                        this.setState({ fetchingCircuits: false })
                    })
                }
            })
    }
    onRegionChangeComplete = (region) =>
    {
        let northeast = {
            latitude: region.latitude + region.latitudeDelta / 2,
            longitude: region.longitude + region.longitudeDelta / 2,
        };
        let southwest = {
            latitude: region.latitude - region.latitudeDelta / 2,
            longitude: region.longitude - region.longitudeDelta / 2,
        };


        this._fetchCircuits(northeast, southwest);
        this.setState({ region });
    }


    render()
    {
        let markers = [];
        if (this.props.connectionReducer.connected)
        {
            markers = markers.concat(this.props.circuitsReducer.circuits.filter(item => !this.props.offlineReducer.circuits.map(i => i.id).includes(item.id)).map(item => Object.assign(item, { color: Colors.secondary })), this.props.offlineReducer.circuits.map(item => Object.assign(item, { color: Colors.primary })))
        }
        else
        {
            markers = markers.concat(this.props.circuitsReducer.circuits.map(item => Object.assign(item, { color: Colors.secondary })))
        }


        if (this.state.loading)
        {
            return (
                <View style={{ alignItems: 'center' }}>
                    <ActivityIndicatorLogo text={Strings("map", "loading")}/>
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
                        onRegionChangeComplete={this.onRegionChangeComplete}
                        customMapStyle={this._getMapStyleDependingOnCurrentTime()}
                        showsUserLocation={true}
                        loadingEnabled={true}
                        onPanDrag={() => { if (this.state.followingCurrentPosition) this.setState({ followingCurrentPosition: false }) }}
                        ref={component => this.map = component}
                    >
                        {
                            markers.map(item => 
                            {
                                if (item.transits[0] && item.transits[0].step)
                                {
                                    return <Marker key={item.color + item.id} coordinate={{ longitude: item.transits[0].step.longitude, latitude: item.transits[0].step.latitude }} pinColor={item.color} onPress={() => { this._selectCircuit(item) }} />
                                }
                            }
                            )
                        }

                    </MapView>
                </ScrollView>
                <View style={{ position: "absolute", top: 0, left: 0, backgroundColor: "rgba(0,0,0,0)", width: "100%", flex: 1, flexDirection: "row" }}>
                    <GooglePlacesSearchBar minDistance={this.state.minDistance} maxDistance={this.state.maxDistance} minDuration={this.state.minDuration} maxDuration={this.state.maxDuration} minNote={this.state.minNote} onFilterSelection={this._filterSelection} onChangeText={(search) => this.setState({ search })} value={this.state.search} onSearch={(searchInfos) => { this.setState({ followingCurrentPosition: false }, () => { this.map.animateToRegion({ latitude: searchInfos.result.geometry.location.lat, longitude: searchInfos.result.geometry.location.lng, longitudeDelta: 0.005, latitudeDelta: 0.005 }, 1000) }) }} />
                </View>
                {
                    this.state.fetchingCircuits &&
                    <View style={{ position: "absolute", top: 0, right: 1, marginTop: "16%", flex: 1}}>
                        <ActivityIndicator size="large" color="gray" />
                    </View>
                }

                <TouchableOpacity onPress={this._centerMapOnSelf} style={{ margin: 10, elevation: 4, alignItems: "center", justifyContent: 'center', position: 'absolute', bottom: 0, right: 1, width: 54, height: 54, borderRadius: 26, backgroundColor: "white" }}>
                    <Image style={{ width: 32, height: 32 }} source={require("../../Resources/Images/target.png")} />
                </TouchableOpacity>
                <CircuitModal marker={this.state.selectedMarker} connected={this.props.connectionReducer.connected} downloadingCircuit={this.state.downloadingCircuit} open={this.state.selectedMarker !== null} playable={this.state.selectedMarker && this.props.offlineReducer.circuits.map(item => item.id).includes(this.state.selectedMarker.id)} onPlay={() => { this.props.navigation.navigate("PlayScreen", { id: this.state.selectedMarker.id }) }} onDownload={(languageId) => { this._downloadCircuit(this.state.selectedMarker, languageId) }} />
            </View>

        );
    }
}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(MainScreen)