import React from 'react';
import { Text, View, Image, FlatList } from "react-native";
import TextInput from "../../Components/TextInput";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../Colors';
import FetchRequest from "../../Tools/FetchRequest";
import Url from "../../Resources/Url";
import Button from "../Button"
import { connect } from 'react-redux'
import Strings from '../../Resources/i18n';
import CircuitListItem from '../CircuitListItem';
import Swipeable from '../Swipeable';

class Favorites extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            login: "",
            password: "",
            loginFocused: false,
            passwordFocused: false,
            loading: false,
            errMess: ""
        }
        this.requests = [];
    }

    _playCircuit = (id) =>
    {
        this.setState({
            selectedCircuit: null
        }, () => this.props.navigation.navigate("PlayScreen", { id: id }))

    }

    _downloadCircuit = (id, type) =>
    {
        if (type !== "UPDATE_CIRCUIT" && this.props.offlineReducer.circuits.find(circuit => circuit.id === id)) return;
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
                <Text style={{ backgroundColor: Colors.primary, margin: 5, fontSize: 25, borderRadius: 3, color: 'rgba(255,255,255,1)', fontFamily: 'Billabong', textAlign: 'center', textAlignVertical: 'center' }}>{Strings("circuits", "favorites")}</Text>
                <FlatList
                    onRefresh={this._fetchMyCircuits}
                    refreshing={this.state.isLoadingCircuits}
                    data={this.props.circuitsReducer.favorites}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (                                          
                        <CircuitListItem data={item} downloaded={this.props.offlineReducer.circuits.find((i) => i.id === item.id)} download={(id) => this._downloadCircuit(id, "DOWNLOAD_CIRCUIT")}  delete={() => {}} update={(id) => this.setState({ selectedCircuit: id })} play={(id) => this._playCircuit(id)} />
                    )}
                    ListEmptyComponent={<Text style={{ textAlign: "center", color: "black" }}>{Strings("circuits", "noCircuits")}</Text>}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(Favorites)
