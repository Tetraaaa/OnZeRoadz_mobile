import React from 'react';
import { TextInput, View, FlatList, Text, TouchableOpacity, Keyboard } from 'react-native';
import FetchRequest from "../Tools/FetchRequest"
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Colors';
import Config from "../Resources/Config";
import Url from "../Resources/Url";

class GooglePlacesSearchBar extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            predictions: [],
            focusOnBar: false
        }
        this.requests = []
    }

    componentDidMount()
    {
        this.keyboardListener = Keyboard.addListener("keyboardDidHide", () => { this.searchBar.blur() })
    }

    componentWillUnmount()
    {

        this.keyboardListener.remove()
    }

    _onSearch = (item) => 
    {
        this.requests.forEach(request => request.abort())
        let f = new FetchRequest(Url.googlePlaces + item.place_id + "&key=" + Config.apiKey)
        this.requests.push(f)
        f.open().then(response =>
        {
            if (response.ok)
            {
                response.json().then(json => this.props.onSearch(json))
                this.props.onChangeText(item.description)
                this.searchBar.blur()
            }
        })
            .catch(error => console.log(error))
    }

    _onChangeText = (text) =>
    {
        this.requests.forEach(request => request.abort())
        let f = new FetchRequest(Url.googleAutocompletion + text + "&key=" + Config.apiKey);
        this.requests.push(f);
        f.open()
            .then(response =>
            {
                if (response.ok)
                {
                    response.json().then(json => this.setState({ predictions: json.predictions }))
                }
            })
            .catch(error => console.log(error))

        this.props.onChangeText(text)
    }

    render()
    {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.primary, margin: 5, borderRadius: 3, elevation: 4 }}>
                <View style={{ flex: 1, margin: 5, borderRadius: 30, backgroundColor: "white" }}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", padding: 3 }}>
                        <View style={{ flex: 9 }}>
                            <TextInput style={{ padding: 0 }} ref={component => this.searchBar = component} onBlur={() => { this.setState({ focusOnBar: false }) }} onFocus={() => { this.setState({ focusOnBar: true }) }} value={this.props.value} onChangeText={this._onChangeText} placeholder={"Rechercher un lieu..."} selectTextOnFocus={true} />
                        </View>
                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                            <Icon color={Colors.primaryDark} name="search" size={36} />
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, backgroundColor: "white", borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }}>
                    {
                        this.state.focusOnBar ?
                            <FlatList
                                keyboardShouldPersistTaps={"handled"}
                                data={this.state.predictions}
                                keyExtractor={(item, index) => item.id}
                                renderItem={({ item }) =>
                                {
                                    return (
                                        <TouchableOpacity style={{ padding: 10, borderBottomWidth: 1, borderColor: Colors.primaryLight }} onPress={() => { this._onSearch(item) }}>
                                            <Text style={{ color: Colors.primaryDark }}>{item.description}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                                }
                            />
                            :
                            null
                    }
                </View>


            </View>

        );
    }
}

export default GooglePlacesSearchBar

