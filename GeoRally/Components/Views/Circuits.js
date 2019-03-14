import React from "react";
import { View, Text, FlatList, ScrollView, ActivityIndicator } from "react-native";
import { connect } from 'react-redux'
import FetchRequest from "../../Tools/FetchRequest";
import Url from "../../Resources/Url";
import CircuitListItem from './../../Components/CircuitListItem';
import Colors from "../../Colors";

class Circuits extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            myCircuits: [],
            isLoadingCircuits: true
        }
    }

    componentDidMount()
    {
        let f = new FetchRequest(Url.myCircuits);
        f.open()
            .then(response =>
            {
                if (response.ok)
                {
                    response.json()
                        .then(json =>
                        {
                            this.setState({ myCircuits: json, isLoadingCircuits:false })
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

    _playCircuit = (id) =>
    {
        this.props.navigation.navigate("PlayScreen", { id: id })
    }

    render()
    {
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ backgroundColor: Colors.primary, margin: 5, fontSize: 25, borderRadius: 3, color: 'rgba(255,255,255,1)', fontFamily: 'Billabong', textAlign: 'center', textAlignVertical: 'center' }}>Mes circuits</Text>
                    {this.state.isLoadingCircuits ?
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text>Chargement de vos circuits...</Text>
                            <ActivityIndicator size="large" color={Colors.primary} />
                        </View>
                        :
                        <FlatList
                            data={this.state.myCircuits}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => <CircuitListItem data={item} />} />
                    }

                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ backgroundColor: Colors.primary, margin: 5, fontSize: 25, borderRadius: 3, color: 'rgba(255,255,255,1)', fontFamily: 'Billabong', textAlign: 'center', textAlignVertical: 'center' }}>Circuits téléchargés</Text>
                    <FlatList
                        data={this.props.offlineReducer.circuits}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <CircuitListItem data={item} downloaded={true} play={(id) => this._playCircuit(id)} />} />
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(Circuits)