import React from "react";
import { View, Text, FlatList, ScrollView, ActivityIndicator, } from "react-native";
import { connect } from 'react-redux'
import FetchRequest from "../../Tools/FetchRequest";
import Url from "../../Resources/Url";
import CircuitListItem from './../../Components/CircuitListItem';
import UpdateModal from './../UpdateModal';
import Colors from "../../Colors";
import Strings from "../../Resources/i18n";
import Swipeable from "../Swipeable";

class Circuits extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            isLoadingCircuits: false,
            isLoadingDownloadedCircuits: false,
            downloadingCircuit: false,
            selectedCircuit: null
        }
    }


    _fetchMyCircuits = () =>
    {
        this.setState({ isLoadingCircuits: true })
        let f = new FetchRequest(Url.myCircuits);
        f.open()
            .then(response =>
            {
                if (response.ok)
                {
                    response.json()
                        .then(json =>
                        {
                            let action = { type: "SET_MY_CIRCUITS", value: json };
                            this.props.dispatch(action);
                            this.setState({ isLoadingCircuits: false })
                        });
                }
                else
                {
                    throw new Error("Erreur lors de la récupération des circuits de l'utilisateur")
                }
            })
            .catch(error =>
            {
                this.setState({ isLoadingCircuits: false })
            })
    }

    _checkDownloadedCircuitsVersion = () =>
    {
        this.setState({ isLoadingDownloadedCircuits: true })
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
                            this.setState({ isLoadingDownloadedCircuits: false })
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

    _playCircuit = (id) =>
    {
        this.setState({
            selectedCircuit: null
        }, () => this.props.navigation.navigate("PlayScreen", { id: id }))

    }

    _deleteCircuit = (circuit) => 
    {
        let action = { type: "REMOVE_CIRCUIT", value: circuit.id }
        this.props.dispatch(action);
    }

    _downloadCircuit = (id, type) =>
    {
        if(this.props.offlineReducer.circuits.find(circuit => circuit.id === id)) return;
        this.setState({ downloadingCircuit: true })
        let f = new FetchRequest(Url.circuit + id);
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
                            let action = { type: type, value: circuit }
                            this.props.dispatch(action);
                            this.setState({ downloadingCircuit: false, selectedCircuit: null })
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
                this.setState({ downloadingCircuit: false, selectedCircuit: null })
            })
    }

    render()
    {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ backgroundColor: Colors.primary, margin: 5, fontSize: 25, borderRadius: 3, color: 'rgba(255,255,255,1)', fontFamily: 'Billabong', textAlign: 'center', textAlignVertical: 'center' }}>{Strings("circuits", "myCircuits")}</Text>
                    {this.state.isLoadingCircuits ?
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text>{Strings("circuits", "loading")}</Text>
                            <ActivityIndicator size="large" color={Colors.primary} />
                        </View>
                        :
                        <FlatList
                            onRefresh={this._fetchMyCircuits}
                            refreshing={this.state.isLoadingCircuits}
                            data={this.props.circuitsReducer.myCircuits}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => <CircuitListItem data={item} download={(id) => this._downloadCircuit(id, "DOWNLOAD_CIRCUIT")} />}
                            ListEmptyComponent={<Text style={{ textAlign: "center", color: "black" }}>{Strings("circuits", "noCircuits")}</Text>}
                        />
                    }

                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ backgroundColor: Colors.primary, margin: 5, fontSize: 25, borderRadius: 3, color: 'rgba(255,255,255,1)', fontFamily: 'Billabong', textAlign: 'center', textAlignVertical: 'center' }}>{Strings("circuits", "downloaded")}</Text>
                    {
                        this.state.isLoadingDownloadedCircuits ?
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text>{Strings("circuits", "loading")}</Text>
                                <ActivityIndicator size="large" color={Colors.primary} />
                            </View>
                            :
                            <FlatList
                                onRefresh={this._checkDownloadedCircuitsVersion}
                                refreshing={this.state.isLoadingDownloadedCircuits}
                                data={this.props.offlineReducer.circuits.filter(circuit => !this.props.circuitsReducer.circuits.includes(circuit))}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => <Swipeable onSwipeComplete={this._deleteCircuit} item={item}><CircuitListItem data={item} downloaded={true} update={(id) => this.setState({ selectedCircuit: id })} play={(id) => this._playCircuit(id)} /></Swipeable>}
                                ListEmptyComponent={<Text style={{ textAlign: "center", color: "black" }}>{Strings("circuits", "noCircuits")}</Text>}
                            />

                    }


                </View>
                <UpdateModal open={this.state.selectedCircuit !== null} circuitId={this.state.selectedCircuit} wantUpdate={(choice) => choice ? this._downloadCircuit(this.state.selectedCircuit, "UPDATE_CIRCUIT") : this._playCircuit(this.state.selectedCircuit)} />
            </View>
        );
    }
}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(Circuits)