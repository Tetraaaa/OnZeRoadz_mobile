import React from "react";
import { View, Text, FlatList, ScrollView } from "react-native";
import { connect } from 'react-redux'
import FetchRequest from "../Tools/FetchRequest";
import Url from "../Resources/Url";
import CircuitListItem from './../Components/CircuitListItem';

class Circuits extends React.Component
{

    constructor(props){
        super(props);
        this.state = {
            myCircuits: []
        }
    }

    componentDidMount(){
        let f = new FetchRequest(Url.myCircuits);
        f.open()
            .then(response =>
            {
                if (response.ok)
                {
                    response.json()
                        .then(json =>
                        {
                            this.setState({myCircuits: json})
                        });
                }
                else
                {
                    Alert.alert("Erreur lors de la récupération du circuit", "Impossible de télécharger le circuit sélectionné.")
                }
            })
            .catch(error =>
            {
                Alert.alert("Erreur lors de la récupération du circuit", "Impossible de télécharger le circuit sélectionné.")
            })

    }

    _playCircuit = (id) => {
        this.props.navigation.navigate("PlayScreen", {id:id})
    }

    render()
    {
        return (
            <ScrollView style={{flex:1}}>
                <Text style={{ backgroundColor: Colors.primary, margin: 5, fontSize:25, borderRadius: 3, color:'rgba(255,255,255,1)', fontFamily: 'Billabong',textAlign: 'center', textAlignVertical:'center'}}>Mes circuits</Text>
                <FlatList
                    style={{margin:5}}
                    data={this.state.myCircuits}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <CircuitListItem data={item} />} />
                <Text style={{ backgroundColor: Colors.primary, margin: 5, fontSize:25, borderRadius: 3, color:'rgba(255,255,255,1)', fontFamily: 'Billabong',textAlign: 'center', textAlignVertical:'center'}}>Circuits téléchargés</Text>
                <FlatList
                    style={{margin:5}}
                    data={this.props.offlineReducer.circuits}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <CircuitListItem data={item} downloaded={true} play={(id) => this._playCircuit(id)} />} />
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(Circuits)